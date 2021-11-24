const REGEX_FLOAT = /^\d*(\.\d*)?\d$/g;

AFRAME.registerComponent('instruction',{
    schema: {
        function:{type:'string',default:'move'},
        parameter:{type:'string'},
        amount:{default:1.0 }
    },
    init: function(){  
        let parentEl = this.el.parentEl; 
        this.attached = parentEl && parentEl.components['program'];
        this.ide = document.querySelector('[ide]');
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'/vr-programming/models/instruction.obj'});
        this.el.setAttribute('material', {src:'/vr-programming/textures/instruction_'+this.data.function+'.png'});
        this.el.addEventListener('model-loaded',(evt)=>{
            this.el.setAttribute('droppable','');
            if(!this.attached){
                this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
                this.el.setAttribute('draggable','');
                this.el.setAttribute('ammo-body',{type:'dynamic',linearDamping:1,angularDamping:1,gravity:{x:0,y:0,z:0},emitCollisionEvents:true});
            }else{
                this.el.setAttribute('ammo-body',{type:'kinematic',emitCollisionEvents:true});
                this.el.addEventListener('collideend',this.collisionHandler.bind(this));
            }
            this.el.setAttribute('ammo-shape',{type:'box',fit:'manual',halfExtents:'0.09 0.09 0.09', offset:'0 -0.15 0'});
            this.el.addEventListener('drag-drop',this.addParameter.bind(this));
            this.el.addEventListener('dragover-start',this.startPreview.bind(this));
            this.el.addEventListener('dragover-end',this.endPreview.bind(this));
            this.update();
        });     
        
        if(this.data.parameter){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('parameter',this.data.parameter);
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.08});
            this.el.appendChild(newEntity);
            this.parameter = newEntity;
        }
    },
    update: function(oldData){
        this.size = (new THREE.Box3().setFromObject(this.el.object3D)).getSize();
    },
    remove: function(){
        this.el.removeEventListener('drag-drop',this.addParameter);
        this.el.removeEventListener('collideend',this.collisionHandler);
    },
    startPreview: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['parameter']){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('geometry',{primitive:'box',height:0.1,width:0.1,depth:0.1});
            preview.setAttribute('position',{x:0, y:0.155, z:0.08});
            preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.el.appendChild(preview);
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        for(let e of this.el.querySelectorAll('.preview')){
            e.remove();
        }
        evt.stopPropagation();
    },
    addParameter: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.parameter) return;
        let component = target.components['parameter'];
        if(component){
            let newEntity = document.createElement('a-entity');
            target.remove();
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('parameter',component.attrValue);
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.08});
            this.parameter = newEntity;
            this.data.parameter = component.attrValue;
            this.el.appendChild(newEntity);
            this.el.removeEventListener('drag-drop',this.addParameter);
        }
    },
    removeParameter: function(){
        this.data.parameter = undefined;
        this.parameter = null;
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
            newEntity.setAttribute(this.attrName,this.attrValue);
            newEntity.setAttribute('position',newPosition);
            if(this.attached){
                this.attached.removeInstruction.bind(this.attached)(this.el);
            }else{
                this.el.remove();
            }
            this.ide.appendChild(newEntity);
        }
    }
});