const DIRECTIONS = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    FORWARD: "forward",
    BACKWARD: "backward"
}

AFRAME.registerComponent('parameter', {
    schema: {type:{default:'up', oneOf:DIRECTIONS},
             function:{type:'string'}},
    init: function () {
        let parent = this.el.parentEl;
        this.attached = parent && parent.components['instruction'];
        this.ide = document.querySelector('[ide]');

        this.collisionHandler = this.collisionHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#box'});
        this.el.addEventListener('model-loaded',(evt)=>{
            if(!this.attached){
                this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
                this.el.setAttribute('draggable','');
            }else{
                this.el.addEventListener('collidestart',this.collisionHandler);
            }
        });     
    },
    update: function(oldData){
        this.el.setAttribute('material',{src:'#box_'+this.data.type});
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
            newEntity.setAttribute(this.attrName,this.data);
            newEntity.setAttribute('position',newPosition);
            this.el.remove();
            this.ide.appendChild(newEntity);
            if(this.attached){
                this.attached.removeParameter();
            }
        }
        evt.stopPropagation();
    }
});