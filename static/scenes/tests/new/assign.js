AFRAME.registerComponent('assign',{
    schema: {
        function:{type:'string',default:'move'},
        ref_1:{type:'string'},
        ref_2:{type:'string'}
    },
    init: function(){  
        let parentEl = this.el.parentEl; 
        this.attached = parentEl && parentEl.components['program'];
        this.ide = document.querySelector('[ide]');
        this.preview = null;
        this.positions = [{added:false, position:new THREE.Vector3(0, 0, 0.08)    , el:null},
                          {added:false, position:new THREE.Vector3(0, 0.155, 0.08), el:null}];
        this.size = new THREE.Vector3(0,0,0);
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();

        this.startPreviewInstruction = this.startPreviewInstruction.bind(this);
        this.startPreviewReference = this.startPreviewReference.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.addReference = this.addReference.bind(this);
        this.removeReference = this.removeReference.bind(this);
        this.grabEndHandler = this.grabEndHandler.bind(this);
        this.run = this.run.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#instruction'});
        this.el.setAttribute('material', {src:'#instruction_'+this.data.function});
        this.el.addEventListener('model-loaded',(evt)=>{
            this.el.setAttribute('droppable','');
            this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
            if(!this.attached){
                this.el.setAttribute('draggable','');
            }else{
                this.el.addEventListener('collideend',this.collisionHandler);
                this.el.addEventListener('drag-drop',this.addInstruction);
                this.el.addEventListener('dragover-start',this.startPreviewInstruction);
                this.el.addEventListener('grab-end',this.grabEndHandler);
            }
            this.el.addEventListener('drag-drop',this.addReference);
            this.el.addEventListener('dragover-start',this.startPreviewReference);
            this.el.addEventListener('dragover-end',this.endPreview);
            this.update();
        });
    },
    update: function(oldData){
        (new THREE.Box3().setFromObject(this.el.object3D)).getSize(this.size);
        if(this.data.ref_1 && !this.positions[0].el){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('reference',{variable:this.data.reference});
            newEntity.setAttribute('position',this.positions[0].position.clone());
            this.el.appendChild(newEntity);
            this.positions[0].el = newEntity;
            this.positions[0].added = true;
        }
        if(this.data.ref_2 && !this.positions[1].el){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('reference',{variable:this.data.reference});
            newEntity.setAttribute('position',this.positions[1].position.clone());
            this.el.appendChild(newEntity);
            this.positions[1].el = newEntity;
            this.positions[1].added = true;
        }
    },
    startPreviewReference: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['reference'] && !this.preview && !this.positions.every((a)=>a.set) ){
            let distance;
            let nearest = 0;
            let minDistance = Number.POSITIVE_INFINITY;
            let localPos = this.el.object3D.worldToLocal(carried.object3D.getWorldPosition());
            for(i = 0 ; i < this.positions.length ; i++){
                if(this.positions[i].added){
                    continue;
                }else{
                    distance = localPos.distanceTo(this.positions[i].position);
                    if(distance < minDistance){
                        minDistance = distance;
                        nearest = i;
                    }
                }
            }
            this.preview = document.createElement('a-entity');
            this.preview.setAttribute('class','preview');
            this.preview.setAttribute('obj-model',{obj:'#cylinderZ'});
            this.preview.setAttribute('position',this.positions[nearest].position.clone());
            this.preview.setAttribute('material',{color:'#33ffff',opacity:0.7});
            this.el.appendChild(this.preview);
        }
        evt.stopPropagation();
    },
    startPreviewInstruction: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['instruction'] && !this.preview){
            this.preview = document.createElement('a-entity');
            this.preview.setAttribute('class','preview');
            this.preview.setAttribute('obj-model',{obj:'/vr-programming/models/instruction.obj'});
            this.preview.setAttribute('position',{x:this.el.object3D.position.x + this.size.x/2 + carried.components['instruction'].size.x/2 , y:0, z:0});
            this.preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.el.after(this.preview);
            let movingInstruction = this.preview.nextElementSibling;
            while(movingInstruction){
                movingInstruction.object3D.position.x += 0.2;
                movingInstruction = movingInstruction.nextElementSibling;
            }
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(!this.preview) return;
        let movingInstruction = this.preview.nextElementSibling;
        while(movingInstruction){
            movingInstruction.object3D.position.x -= 0.2;
            movingInstruction = movingInstruction.nextElementSibling;
        }
        this.preview.remove();
        this.preview = null;
        evt.stopPropagation();
    },
    addReference: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || (this.ref_1 && this.ref_2)) return;
        let component = target.components['reference'];
        if(component){
            let distance;
            let nearest = 0;
            let minDistance = Number.POSITIVE_INFINITY;
            let localPos = this.el.object3D.worldToLocal(target.object3D.getWorldPosition());
            for(i = 0 ; i < this.positions.length ; i++){
                if(this.positions[i].added){
                    continue;
                }else{
                    distance = localPos.distanceTo(this.positions[i].position);
                    if(distance < minDistance){
                        minDistance = distance;
                        nearest = i;
                    }
                }
            }
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('reference',component.data);
            newEntity.setAttribute('position',this.positions[nearest].position.clone());
            switch(nearest){
                case 0: 
                    this.positions[0].el = newEntity; 
                    this.positions[0].added = true;
                    this.data.ref_1 = component.data.variable;
                    break;
                case 1: 
                    this.positions[1].el = newEntity; 
                    this.positions[1].added = true;
                    this.data.ref_2 = component.data.variable;
                    break;
            }
            this.el.appendChild(newEntity);
            target.remove();
        }
        evt.stopPropagation();
    },
    addInstruction: function(evt){
        let target = evt.detail.dropped;
        let component = target.components['instruction'];
        if(component){
            if(target.isConnected) target.remove();
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('instruction',component.data);
            newEntity.setAttribute('position',{x:this.el.object3D.position.x + this.size.x/2 + component.size.x/2, y:0, z:0});
            let movingInstruction = this.el.nextElementSibling;
            while(movingInstruction){
                movingInstruction.object3D.position.x += 0.2;
                instruction = movingInstruction.components['instruction'];
                if(instruction){
                    instruction.initialPosition.copy(instruction.currentPosition);
                }
                movingInstruction = movingInstruction.nextElementSibling;
            }
            this.el.after(newEntity);
        }
        evt.stopPropagation();
    },
    removeReference: function() {
        this.data.reference = '';
        this.reference = null;
    },
    grabEndHandler: function(evt){
        this.el.getAttribute('position').copy(this.initialPosition);
    },
    run: function(drone){
        drone[this.data.function](this.data.parameter,this.reference.components['reference'].get());
    },
    tick: function(){
        if(this.attached && this.initialPosition.distanceTo(this.currentPosition) > 0.3){
            instruction = document.createElement('a-entity');
            position = this.ide.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            instruction.setAttribute('assign',this.data);
            instruction.setAttribute('position',position);
            this.ide.appendChild(instruction);
            this.attached.removeInstruction(this.el);
        }
    }
});