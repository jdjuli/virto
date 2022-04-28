AFRAME.registerComponent('instruction-loop',{
    schema: {
        reference:{type:'string'}
    },
    init: function(){  
        this.innerLoop = null;
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();
        this.program = this.el.closest('[program]');
        this.code = this.el.parentEl.components['code'];
        this.innerLoop = this.el.querySelector('[code]');
        this.el.size=new THREE.Vector3(0,0,0);
        this.el.minSize=new THREE.Vector3(0.6,0.7,0.2);

        this.exec = this.exec.bind(this);
        this.startPreviewInstruction = this.startPreviewInstruction.bind(this);
        this.startPreviewReference = this.startPreviewReference.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.addReference = this.addReference.bind(this);
        this.update = this.update.bind(this);
        this.grabEndHandler = this.grabEndHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#loop_open'});
        this.el.setAttribute('material',{src:'#instruction_loop'});

        this.el.setAttribute('droppable','');
        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        this.el.setAttribute('draggable','');

        this.el.addEventListener('dragover-end',this.endPreview(true));
        this.el.addEventListener('dragover-start',this.startPreviewInstruction(true));
        this.el.addEventListener('dragover-start',this.startPreviewReference);
        this.el.addEventListener('drag-drop',this.addInstruction(true));
        this.el.addEventListener('drag-drop',this.addReference);

        if(this.el.parentElement.getDOMAttribute('code') != null){
            this.el.addEventListener('grab-end',this.grabEndHandler);
        }

        this.endEl = document.createElement('a-entity');
        this.endEl.setAttribute('class','collidable');
        this.endEl.setAttribute('obj-model',{obj:'#loop_close'});
        this.endEl.setAttribute('material',{src:'#instruction_loop'});
        this.endEl.setAttribute('position',new THREE.Vector3(0.3+(this.innerLoop?this.innerLoop.size.x:0),0,0));  
        this.endEl.setAttribute('droppable','');
        this.endEl.addEventListener('dragover-end',this.endPreview(false));
        this.endEl.addEventListener('dragover-start',this.startPreviewInstruction(false));
        this.endEl.addEventListener('drag-drop',this.addInstruction(false));
        this.el.appendChild(this.endEl);

        this.unionEl = document.createElement('a-entity');
        this.unionEl.setAttribute('obj-model',{obj:'#loop_union'});
        this.unionEl.setAttribute('material',{src:'#instruction_loop'});
        this.unionEl.setAttribute('position',new THREE.Vector3(0.05,-0.25,0));
        this.el.appendChild(this.unionEl);

        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true,subtree: true});

        this.el.clone = ()=>{
            let clone = document.createElement('a-entity');
            let ilClone = this.innerLoop.clone();
            clone.setAttribute('instruction-loop',this.data);
            clone.size = this.el.size;
            clone.appendChild(ilClone);
            return clone;
        }
    },
    update: function(){
        this.code = this.el.parentEl.components['code'];
        if(this.reference){
            if(this.reference.attached == false){
                this.reference = null;
                this.data.reference = '';
            }
        }else{
            if(this.data.reference){
                let ref = document.createElement('a-entity');
                ref.setAttribute('reference',{variable:this.data.reference});
                ref.setAttribute('position',{x:-0.05,y:-0.1,z:0.13});
                this.reference = ref;
                this.el.appendChild(ref);
            }
        }
        if(!this.innerLoop){
            this.innerLoop = document.createElement('a-entity');
            this.innerLoop.size = {x:0, y:0, z:0};
            this.innerLoop.setAttribute('code','');
            this.el.appendChild(this.innerLoop);
        }
        this.innerLoop.object3D.position.set(0.15,0.1,0);
        this.unionEl.object3D.scale.x = 1 + this.innerLoop.size.x/0.1;
        this.endEl.object3D.position.set(this.innerLoop.size.x+0.3,0,0);
        this.el.size.set(this.el.minSize.x+this.innerLoop.size.x, this.el.minSize.y, this.el.minSize.z);
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
        let component = carried.components['reference']
        if(component && component.type=='boolean' && !this.reference && !this.program.is('previewing')){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('obj-model',{obj:'#cylinderZ'});
            preview.setAttribute('position',{x:-0.05,y:-0.1, z:0.13});
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
            if(!carried.attached || carried==this.el) return; 
            let component = carried.components[carried.getAttributeNames().filter((n)=>/instruction-?\w*/.test(n))[0]];
            if(component && !carried.parentEl.components['code'] && !this.program.is('previewing') && !this.isAncestor(carried)){
                let carriedPosition = new THREE.Vector3(0,0,0);
                
                let preview = document.createElement('a-entity');
                preview.setAttribute('class','preview');
                switch(component.attrName){
                    case 'instruction':
                        preview.setAttribute('obj-model',{obj:'#instruction'});
                        preview.size={x:0.2,y:0.5,z:0.2};
                    break;
                    case 'instruction-conditional':
                        preview.setAttribute('obj-model',{obj:'#condition_preview'});
                        preview.size={x:0.6,y:0.7,z:0.2};
                    break;
                    case 'instruction-loop':
                        preview.setAttribute('obj-model',{obj:'#loop_preview'});
                        preview.size={x:0.6,y:1.1,z:0.2};
                    break;
                }
                preview.setAttribute('material',{color:'#44aa44',opacity:0.7});

                if(inside){
                    this.el.object3D.worldToLocal(carried.object3D.getWorldPosition(carriedPosition)); 
                    this.innerLoop.prepend(preview);
                }else if(this.code){
                    this.code.el.insertBefore(preview,this.el.nextElementSibling);
                }
                this.program.addState('previewing');
                evt.stopPropagation();
            }
        }).bind(this);
    },
    endPreview: function(inside){
        return ((evt)=>{
            if(this.program.is('previewing')){
                if(this.preview && this.preview.attached != false){
                   this.preview.remove(); 
                } else if(inside) {
                    this.innerLoop.components.code.endPreview();
                } else if (this.code) {
                    this.code.endPreview();
                }
                this.program.removeState('previewing');
            }
            evt.stopPropagation();
        }).bind(this);
    },
    addReference: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.reference) return;
        let component = target.components['reference'];
        if(component && component.type=='boolean'){
            let newEntity = document.createElement('a-entity');
            let position = new THREE.Vector3(-0.05,-0.1,0.13);
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
            if(!dropped.attached || !(this.code || inside)) return; 
            let component = dropped.components[dropped.getAttributeNames().filter((n)=>/instruction-?\w*/.test(n))[0]];
            if(component && component!=this && !this.isAncestor(dropped)){
                let instruction = component.el.clone();
                if(inside){
                    let droppedPosition = new THREE.Vector3(0,0,0);
                    this.el.object3D.worldToLocal(dropped.object3D.getWorldPosition(droppedPosition));
                    this.innerLoop.prepend(instruction);
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
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition(new THREE.Vector3()));
            instruction.setAttribute('position',position);
            this.program.appendChild(instruction);
            this.el.remove();
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
            const getVal = ()=>{
                boolVal = this.reference.components['reference'].get();
                if(!Number.isNaN(Number.parseInt(boolVal))){
                    reject('Variables on conditions must be boolean');
                }else{
                    return boolVal;
                }
            }
            
            while(getVal()){
                await this.innerLoop.components['code'].exec();
            }
            resolve();
        });
    },
});