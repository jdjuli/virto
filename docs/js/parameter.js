const DIRECTIONS = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    FORWARD: "forward",
    BACKWARD: "backward"
}

AFRAME.registerComponent('parameter', {
    schema: {default:'up', oneOf:DIRECTIONS},
    init: function () {
        let parent = this.el.parentEl;
        this.attached = parent && parent.components['instruction'];
        this.ide = document.querySelector('[ide]');
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model','obj:/vr-programming/models/direction.obj');
        this.el.addEventListener('model-loaded',(evt)=>{
            if(!this.attached){
                this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
                this.el.setAttribute('draggable','');
                this.el.setAttribute('ammo-body',{type:'dynamic',linearDamping:1,angularDamping:1,gravity:{x:0,y:0,z:0}});
            }else{
                this.el.setAttribute('ammo-body',{type:'static',emitCollisionEvents:true});
            }
            this.el.setAttribute('ammo-shape',{type:'box'});
            this.el.addEventListener('collidestart',this.collisionHandler.bind(this));
        });     
    },
    update: function(oldData){
        this.el.setAttribute('material',{src:'/vr-programming/textures/'+this.data+'.png'});
    },
    remove: function(){
        this.el.removeEventListener('collidestart',this.collisionHandler);
    },
    collisionHandler: function(evt) {
        let targetEl = evt.detail.targetEl;
        if(targetEl.classList.contains('finger')){
            let newPosition = this.el.getAttribute('position');
            newPosition.add(new THREE.Vector3(0,0,0.2));
            let parentToWorld = this.el.parentEl.object3D.localToWorld.bind(this.el.parentEl.object3D);
            let worldToIDE = this.ide.object3D.worldToLocal.bind(this.ide.object3D);
            newPosition = worldToIDE(parentToWorld(newPosition));
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute(this.attrName,this.attrValue);
            newEntity.setAttribute('position',newPosition);
            this.el.remove();
            this.ide.appendChild(newEntity);
            if(this.attached){
                this.attached.removeParameter.bind(this.attached)();
            }
        }
        evt.stopPropagation();
    }
});