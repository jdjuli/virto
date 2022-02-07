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
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();

        this.grabEndHandler = this.grabEndHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#box'});
        this.el.addEventListener('model-loaded',(evt)=>{
            this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
            if(!this.attached){
                this.el.setAttribute('draggable','');
            }else{
                this.el.addEventListener('grab-end',this.grabEndHandler);
            }
        });     
    },
    update: function(oldData){
        this.el.setAttribute('material',{src:'#box_'+this.data.type});
    },
    grabEndHandler: function(evt){
        this.el.getAttribute('position').copy(this.initialPosition);
    },
    tick: function(){
        if(this.attached && this.initialPosition.distanceTo(this.currentPosition) > 0.3){
            parameter = document.createElement('a-entity');
            parameter = document.createElement('a-entity');
            position = this.ide.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            parameter.setAttribute('parameter',{type:this.data.type,function:this.data.function});
            parameter.setAttribute('position',position);
            setTimeout(()=>{this.ide.appendChild(parameter);},10);
            this.attached.removeParameter();
            this.el.remove();
        }
    }
});