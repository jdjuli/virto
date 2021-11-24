AFRAME.registerComponent('instruction',{
    schema: {
        type:{type:'string',default:'up'}
    },
    init: function(){       
        const el = this.el;
        this.program = this.el.parentEl.components['program'];

        el.setAttribute('class','collidable');
        el.setAttribute('material','color:green');
        el.setAttribute('text',{value:this.data.type, zOffset:0.06, align:'center', width:0.5});
        el.setAttribute('geometry',{primitive:'box',height:0.1,width:0.1,depth:0.1});
        el.setAttribute('ammo-body',{type:'kinematic',emitCollisionEvents:true});
        el.setAttribute('ammo-shape',{type:'box'});
        el.setAttribute('grabbable',{usePhysics:'never',suppressY:this.program?true:false});

        el.addEventListener('grab-start',(e)=>this.el.setAttribute('scale','0.5 0.5 0.5'));
        el.addEventListener('grab-end',(e)=>this.el.removeAttribute('scale'));
        el.addEventListener('collidestart',this.collisionHandler.bind(this));
    },
    collisionHandler: function(evt) {
        let target = evt.detail.targetEl;
        if(this.program && target.components['instruction']){
            this.program.addInstruction.bind(this.program)(target, this.el);
        }
    },
    tick: function() {
        if(this.program){
            let position = this.el.object3D.position;
            if(Math.sqrt(position.x*position.x + position.z*position.z) > 0.1){
                this.program.removeInstruction.bind(this.program)(this.el);
            }
        }
    },
    run: function(drone) {
        let droneComponent = drone.components['drone'];
        droneComponent[this.data.type].bind(droneComponent)();
    }
  });