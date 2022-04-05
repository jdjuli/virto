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
        this.program = this.el.closest('[program]');
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();
        this.grabEndHandler = this.grabEndHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#box'});
        this.el.setAttribute('material',{src:'#box_'+this.data.type});

        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        if(this.attached){   
            this.currentPosition = this.el.getAttribute('position');
            this.initialPosition = this.currentPosition.clone();
            this.el.addEventListener('grab-end',this.grabEndHandler);
        }else{
            this.el.setAttribute('draggable','');
        }

        this.el.clone = ()=>{
            let clone = document.createElement('a-entity');
            clone.setAttribute('parameter',this.data);
            return clone;
        }
    },
    remove: function(){
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
    tick: function(){
        if(this.attached && this.initialPosition.distanceTo(this.currentPosition) > 0.3){
            parameter = this.el.clone()
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            parameter.setAttribute('position',position);
            setTimeout(()=>{
                this.program.appendChild(parameter);
                parameter.components.parameter.initComponent();
            },10);
            this.el.remove();
        }
    }
});