

AFRAME.registerComponent('instruction',{
    schema: {
        function:{type:'string',default:'move'},
        parameter:{type:'string'},
        reference:{type:'string'}
    },
    init: function(){  
        this.assetsMgr = this.el.sceneEl.systems['assets-manager'];
        let parentEl = this.el.parentEl; 
        this.attached = parentEl && parentEl.components['program'];
        this.ide = document.querySelector('[ide]');
        this.preview = null;
        this.parameter = null;
        this.reference = null;
        this.size = new THREE.Vector3(0,0,0);
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();

        this.startPreviewInstruction = this.startPreviewInstruction.bind(this);
        this.startPreviewParameter = this.startPreviewParameter.bind(this);
        this.startPreviewReference = this.startPreviewReference.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.addParameter = this.addParameter.bind(this);
        this.addReference = this.addReference.bind(this);
        this.removeParameter = this.removeParameter.bind(this);
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
            this.el.addEventListener('drag-drop',this.addParameter);
            this.el.addEventListener('drag-drop',this.addReference);
            this.el.addEventListener('dragover-start',this.startPreviewParameter);
            this.el.addEventListener('dragover-start',this.startPreviewReference);
            this.el.addEventListener('dragover-end',this.endPreview);
            this.update();
        });
    },
    update: function(oldData){
        (new THREE.Box3().setFromObject(this.el.object3D)).getSize(this.size);
        if(this.data.parameter && !this.parameter){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('parameter',{type:this.data.parameter,function:this.data.function});
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.08});
            this.el.appendChild(newEntity);
            this.parameter = newEntity;
        }
        if(this.data.reference && !this.reference){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('reference',{variable:this.data.reference});
            newEntity.setAttribute('position',{x:0, y:0, z:0.08});
            this.el.appendChild(newEntity);
            this.reference = newEntity;
        }
    },
    remove: function(){
        this.el.removeEventListener('drag-drop',this.addParameter);
        this.el.removeEventListener('collideend',this.collisionHandler);
    },
    startPreviewParameter: function(evt){
        let carried = evt.detail.carried;
        let component = carried.components['parameter'];
        if(component && !this.preview && !this.parameter && component.data.function == this.data.function ){
            this.preview = document.createElement('a-entity');
            this.preview.setAttribute('class','preview');
            this.preview.setAttribute('geometry',{primitive:'box',height:0.1,width:0.1,depth:0.1});
            this.preview.setAttribute('position',{x:0, y:0.155, z:0.08});
            this.preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.el.appendChild(this.preview);
        }
        evt.stopPropagation();
    },
    startPreviewReference: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['reference'] && !this.preview && !this.reference){
            this.preview = document.createElement('a-entity');
            this.preview.setAttribute('class','preview');
            this.preview.setAttribute('obj-model',{obj:'#cylinderZ'});
            this.preview.setAttribute('position',{x:0, y:0, z:0.08});
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
    addParameter: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.parameter) return;
        let component = target.components['parameter'];
        if(component && component.data.function == this.data.function){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('parameter',component.data);
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.08});
            this.parameter = newEntity;
            this.data.parameter = component.data.type;
            this.el.appendChild(newEntity);
            this.el.removeEventListener('drag-drop',this.addParameter);
            this.el.removeEventListener('dragover-start',this.startPreviewParameter);
            target.remove();
        }
        evt.stopPropagation();
    },
    addReference: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.reference) return;
        let component = target.components['reference'];
        if(component){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('reference',component.data);
            newEntity.setAttribute('position',{x:0, y:0, z:0.08});
            this.reference = newEntity;
            this.data.reference = component.data.variable;
            this.el.appendChild(newEntity);
            this.el.removeEventListener('drag-drop',this.addReference);
            this.el.removeEventListener('dragover-start',this.startPreviewReference);
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
    removeParameter: function(){
        this.data.parameter = '';
        this.parameter = null;
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
            instruction.setAttribute('instruction',this.data);
            instruction.setAttribute('position',position);
            this.ide.appendChild(instruction);
            this.attached.removeInstruction(this.el);
        }
    }
});