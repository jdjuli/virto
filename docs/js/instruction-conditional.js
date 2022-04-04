AFRAME.registerComponent('instruction-conditional',{
    schema: {
        reference:{type:'string'}
    },
    init: function(){  
        this.previewingBranch = null;
        this.branchTrue = null;
        this.branchFalse = null;
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();
        this.program = this.el.closest('[program]');
        this.code = this.el.parentEl.components['code'];
        this.el.size=new THREE.Vector3(0,0,0);
        this.el.minSize=new THREE.Vector3(0.6,1.1,0.2);

        this.exec = this.exec.bind(this);
        this.nearestBranch = (this.nearestBranch()).bind(this);
        this.startPreviewInstruction = this.startPreviewInstruction.bind(this);
        this.startPreviewReference = this.startPreviewReference.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.addReference = this.addReference.bind(this);
        this.update = this.update.bind(this);
        this.grabEndHandler = this.grabEndHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#condition_open'});
        this.el.setAttribute('material',{src:'#instruction_conditional'});

        this.el.setAttribute('droppable','');
        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        this.el.setAttribute('draggable','');

        this.el.addEventListener('dragover-end',this.endPreview(true));
        this.el.addEventListener('dragover-start',this.startPreviewInstruction(true));
        this.el.addEventListener('dragover-start',this.startPreviewReference);
        this.el.addEventListener('drag-drop',this.addInstruction(true));
        this.el.addEventListener('drag-drop',this.addReference);

        if(this.code){
            this.el.addEventListener('grab-end',this.grabEndHandler);
        }

        this.endEl = document.createElement('a-entity');
        this.endEl.setAttribute('class','collidable');
        this.endEl.setAttribute('obj-model',{obj:'#condition_close'});
        this.endEl.setAttribute('material',{src:'#instruction_conditional'});
        this.endEl.setAttribute('position',new THREE.Vector3(0,0,0));
        this.endEl.setAttribute('droppable','');
        this.endEl.addEventListener('dragover-end',this.endPreview(false));
        this.endEl.addEventListener('dragover-start',this.startPreviewInstruction(false));
        this.endEl.addEventListener('dragover-start',(evt)=>evt.stopPropagation());
        this.endEl.addEventListener('drag-drop',this.addInstruction(false));
        this.el.appendChild(this.endEl);

        this.branchTrue = this.el.querySelector('[code].branchTrue');
        this.branchFalse = this.el.querySelector('[code].branchFalse');

        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true,subtree: true});

        this.el.clone = ()=>{
            let clone = document.createElement('a-entity');
            let btClone = this.branchTrue.clone();
            let bfClone = this.branchFalse.clone();
            let endEl = this.endEl.cloneNode();
            clone.setAttribute('instruction-conditional',this.data);
            clone.size = this.el.size;
            btClone.setAttribute('class','branchTrue');
            bfClone.setAttribute('class','branchFalse');
            clone.appendChild(btClone);
            clone.appendChild(bfClone);
            clone.appendChild(endEl);
            return clone;
        }
    },
    update: function(){
        if(this.reference){
            if(!this.reference.attached){
                this.reference = null;
                this.data.reference = '';
            }
        }else{
            if(this.data.reference){
                let ref = document.createElement('a-entity');
                ref.setAttribute('reference',{variable:this.data.reference});
                ref.setAttribute('position',{x:-0.15,y:0,z:0.13});
                this.reference = ref;
                this.el.appendChild(ref);
            }
        }
        if(!this.branchTrue){
            this.branchTrue = document.createElement('a-entity');
            this.branchTrue.size = {x:0, y:0, z:0};
            this.branchTrue.classList.add('branchTrue');
            this.branchTrue.setAttribute('code','');
            this.el.appendChild(this.branchTrue);
        }
        if(!this.branchFalse){
            this.branchFalse = document.createElement('a-entity');
            this.branchFalse.size = {x:0, y:0, z:0};
            this.branchFalse.classList.add('branchFalse');
            this.branchFalse.setAttribute('code','');
            this.el.appendChild(this.branchFalse);
        }
        this.branchTrue.object3D.position.set(0.1,0.6,0);
        this.branchFalse.object3D.position.set(0.1,0,0);
        this.endEl.object3D.position.set(Math.max(this.branchTrue.size.x,this.branchFalse.size.x),0,0);
        this.el.size.set(this.el.minSize.x+Math.max(this.branchTrue.size.x,this.branchFalse.size.x), this.el.minSize.y, this.el.minSize.z);
        if(this.code) this.code.update();
        
    },
    remove: function(){
        this.mutationObs.disconnect();
        if(this.el.is('grabbed')){
            let grabber = this.el.components.grabbable.grabber;
            grabber.components['super-hands'].state.forEach((v,k)=>{
                if(!v.attached) grabber.components['super-hands'].state.delete(k);
            });
        }
    },
    grabEndHandler: function(evt){
        this.el.getAttribute('position').copy(this.initialPosition);
    },
    startPreviewReference: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['reference'] && !this.reference && !this.program.is('previewing')){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('obj-model',{obj:'#cylinderZ'});
            preview.setAttribute('position',{x:-0.15, y:0, z:0.13});
            preview.setAttribute('material',{color:'#33ffff',opacity:0.7});
            this.el.appendChild(preview);
            this.program.addState('previewing');
            this.preview = preview;
        }
        evt.stopPropagation();
    },
    startPreviewInstruction: function(inside){
        return ((evt)=>{
            let carried = evt.detail.carried;
            if(!carried.attached) return; 
            let component = carried.components['instruction'];
            if(component && !this.program.is('previewing')){
                let carriedPosition = new THREE.Vector3(0,0,0);
                
                let preview = document.createElement('a-entity');
                preview.setAttribute('class','preview');
                preview.setAttribute('obj-model',{obj:'#instruction'});
                preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
                preview.size={x:0.2,y:0.5,z:0.2};

                if(inside){
                    this.el.object3D.worldToLocal(carried.object3D.getWorldPosition(carriedPosition)); 
                    this.previewingBranch = this.nearestBranch(carriedPosition);
                    this.previewingBranch.prepend(preview);
                    this.program.addState('previewing');
                }else if(this.code){
                    this.code.el.insertBefore(preview,this.el.nextElementSibling);
                    this.program.addState('previewing');
                }
                evt.stopPropagation();
            }
        }).bind(this);
    },
    endPreview: function(inside){
        return ((evt)=>{
            if(this.preview && this.preview.attached){
                this.preview.remove();
                this.program.removeState('previewing');
            }else if(inside){
                if(this.previewingBranch && this.program.is('previewing')){
                    this.previewingBranch.components.code.endPreview();
                    this.previewingBranch = null;
                    this.program.removeState('previewing');
                }
            }else if(this.code){
                this.code.endPreview();
            }
            evt.stopPropagation();
        }).bind(this);
    },
    addReference: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.reference) return;
        let component = target.components['reference'];
        if(component){
            let newEntity = document.createElement('a-entity');
            let position = new THREE.Vector3(-0.15,0,0.13);
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('reference',component.data);
            newEntity.setAttribute('position',position);
            this.reference = newEntity;
            this.data.reference = component.data.variable;
            this.el.appendChild(newEntity);
            target.remove();
            evt.stopPropagation();
        }
    },
    addInstruction: function(inside){
        return ((evt)=>{
            let dropped = evt.detail.dropped;
            if(!dropped.attached) return; 
            let component = dropped.components['instruction'];
            if(component){
                let instruction = document.createElement('a-entity');
                instruction.setAttribute('class','collidable');
                instruction.setAttribute('instruction',component.data);
                if(inside){
                    let droppedPosition = new THREE.Vector3(0,0,0);
                    this.el.object3D.worldToLocal(dropped.object3D.getWorldPosition(droppedPosition));
                    this.nearestBranch(droppedPosition).prepend(instruction);
                }else if(this.code){
                    this.code.el.insertBefore(instruction,this.el.nextElementSibling);
                }
                dropped.remove();
                if(this.code) this.code.updateComponent();
                evt.stopPropagation();
            }
        }).bind(this);
    },
    tick: function(){
        if(this.el.parentEl.components['code'] && this.initialPosition.distanceTo(this.currentPosition) > 0.3){
            instruction = this.el.clone();
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            instruction.setAttribute('position',position);
            this.program.appendChild(instruction);
            this.el.remove();
        }
    },
    nearestBranch: function(){
        let posTrue = new THREE.Vector3(0.2,0,0);
        let posFalse = new THREE.Vector3(0.2,0.6,0);
        return (position)=>{
            if(posTrue.distanceTo(position)>posFalse.distanceTo(position)){
                return this.branchTrue;
            }else{
                return this.branchFalse;
            }
        }
    },
    isAncestor(entity){
        let isAncestor = this.el == entity;
        let ancestor = this.el.parentEl;
        while(!isAncestor && ancestor){
            isAncestor = ancestor==entity;
            ancestor = ancestor.parentEl;
        } 
        return isAncestor;
    },
    exec: async function(){
        return new Promise( async (resolve,reject)=>{
            boolVal = this.reference.components['reference'].get();
            if(!Number.isNaN(Number.parseInt(boolVal))){
                reject('Variables on conditions must be boolean');
            }
            console.log(Date.now());
            
            if(boolVal){
                console.log('executing TRUE branch');
                await this.branchTrue.components['code'].exec();
                console.log('end of TRUE branch');
            }else{
                console.log('executing FALSE branch');
                await this.branchFalse.components['code'].exec();
                console.log('end of FALSE branch');
            }
            resolve();
        });
    },
});