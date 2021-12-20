

AFRAME.registerComponent('instruction',{
    schema: {
        function:{type:'string',default:'move'},
        parameter:{type:'string'},
        amount:{type:'string'}
    },
    init: function(){  
        this.assetsMgr = this.el.sceneEl.systems['assets-manager'];
        let parentEl = this.el.parentEl; 
        this.attached = parentEl && parentEl.components['program'];
        this.ide = document.querySelector('[ide]');
        this.preview = null;
        this.parameter = null;
        this.amount = null;
        this.size = new THREE.Vector3(0,0,0);

        this.startPreviewInstruction = this.startPreviewInstruction.bind(this);
        this.startPreviewParameter = this.startPreviewParameter.bind(this);
        this.startPreviewAmount = this.startPreviewAmount.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.addParameter = this.addParameter.bind(this);
        this.addAmount = this.addAmount.bind(this);
        this.removeParameter = this.removeParameter.bind(this);
        this.removeAmount = this.removeAmount.bind(this);
        this.collisionHandler = this.collisionHandler.bind(this);
        this.run = this.run.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#instruction'});
        this.el.setAttribute('material', {src:'#instruction_'+this.data.function});
        this.el.addEventListener('model-loaded',(evt)=>{
            this.el.setAttribute('droppable','');
            if(!this.attached){
                this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
                this.el.setAttribute('draggable','');
            }else{
                this.el.addEventListener('collideend',this.collisionHandler);
                this.el.addEventListener('drag-drop',this.addInstruction);
                this.el.addEventListener('dragover-start',this.startPreviewInstruction);
            }
            this.el.addEventListener('drag-drop',this.addParameter);
            this.el.addEventListener('drag-drop',this.addAmount);
            this.el.addEventListener('dragover-start',this.startPreviewParameter);
            this.el.addEventListener('dragover-start',this.startPreviewAmount);
            this.el.addEventListener('dragover-end',this.endPreview);
            this.update();
        });     
        
        if(this.data.parameter){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('parameter',{type:this.data.parameter,function:this.data.function});
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.08});
            this.el.appendChild(newEntity);
            this.parameter = newEntity;
        }
        if(this.data.amount){
            let newEntity = document.createElement('a-entity');
            let amount = Number(this.data.amount);
            if(isNaN(amount)){
                newEntity.setAttribute('value',{variable:this.data.amount,display:'NAME'});
            }else{
                newEntity.setAttribute('value',{value:amount,display:'VALUE'});
            }
            newEntity.setAttribute('position',{x:0, y:0, z:0.08});
            this.el.appendChild(newEntity);
            this.amount = newEntity;
        }
    },
    update: function(oldData){
        (new THREE.Box3().setFromObject(this.el.object3D)).getSize(this.size);
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
    startPreviewAmount: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['value'] && !this.preview && !this.amount){
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
    addAmount: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.amount) return;
        let component = target.components['value'];
        if(component){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('value',component.data);
            newEntity.setAttribute('position',{x:0, y:0, z:0.08});
            this.amount = newEntity;
            this.data.amount = component.data.name || component.data.value;
            this.el.appendChild(newEntity);
            this.el.removeEventListener('drag-drop',this.addAmount);
            this.el.removeEventListener('dragover-start',this.startPreviewAmount);
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
    removeAmount: function() {
        this.data.amount = '';
        this.amount = null;
    },
    collisionHandler: function(evt) {
        let targetEl = evt.detail.targetEl;
        if(targetEl.classList.contains('finger')){
            let newPosition = this.el.getAttribute('position');
            newPosition.add(new THREE.Vector3(0,0,0.1));
            let parentToWorld = this.el.parentEl.object3D.localToWorld.bind(this.el.parentEl.object3D);
            let worldToIDE = this.ide.object3D.worldToLocal.bind(this.ide.object3D);
            newPosition = worldToIDE(parentToWorld(newPosition));
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute(this.attrName,this.data);
            newEntity.setAttribute('position',newPosition);
            if(this.el.isConnected){
                if(this.attached){
                    this.attached.removeInstruction.bind(this.attached)(this.el);
                }else{
                    this.el.remove();
                }
            }
            this.ide.appendChild(newEntity);
        }
    },
    run: function(drone){

        drone[this.data.function](this.data.parameter,this.amount.components['value'].getValue());
    }
});