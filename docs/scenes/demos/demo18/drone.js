AFRAME.registerComponent('drone',{
    init: function(){
        const _this = this;   
        


        this.el.setAttribute('gltf-model','/vr-programming/models/drone.gltf')
        this.el.addEventListener('model-loaded',(evt)=>{
            this.el.setAttribute('ammo-body',{type:'dynamic',linearDamping:0.8,angularDamping:0.8,gravity:{x:0,y:0,z:0},emitCollisionEvents:true,activationState:'disableDeactivation'});
            this.el.setAttribute('ammo-shape',{type:'box',fit:'manual',halfExtents:{x:0.2,y:0.2,z:0.2}});
            this.impulseVector = new Ammo.btVector3(0,0,0);
        });
        

        this.initialPosition = this.el.getAttribute('position').clone();
    },
    up:function() {
        this.impulseVector.setValue(0,0.5,0);
        this.el.body.applyCentralImpulse(this.impulseVector);
    },
    down:function() {
        this.impulseVector.setValue(0,-0.5,0);
        this.el.body.applyCentralImpulse(this.impulseVector);
    },
    forward:function() {
        this.impulseVector.setValue(0,0,0.5);
        this.el.body.applyCentralImpulse(this.impulseVector);
    },
    backward:function() {
        this.impulseVector.setValue(0,0,-0.5);
        this.el.body.applyCentralImpulse(this.impulseVector);
    },
    left:function() {
        this.impulseVector.setValue(-0.5,0,0);
        this.el.body.applyCentralImpulse(this.impulseVector);
    },
    right:function() {
        this.impulseVector.setValue(0.5,0,0);
        this.el.body.applyCentralImpulse(this.impulseVector);
    },
    resetPosition:function() {
        this.el.setAttribute('ammo-body','type','static');
        this.el.components['ammo-body'].updateComponent();
        this.el.setAttribute('position',this.initialPosition);
        this.el.components['ammo-body'].syncToPhysics();
        this.el.setAttribute('ammo-body','type','dynamic');
    }
});