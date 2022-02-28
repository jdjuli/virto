AFRAME.registerComponent('drone',{
    init: function(){
        const _this = this;   
        this.el.setAttribute('gltf-model','#drone')
        this.el.addEventListener('model-loaded',(evt)=>{
            this.el.setAttribute('ammo-body',{type:'dynamic',linearDamping:0.8,angularDamping:0.8,gravity:{x:0,y:0,z:0},emitCollisionEvents:true,activationState:'disableDeactivation'});
            this.el.setAttribute('ammo-shape',{type:'box',fit:'manual',halfExtents:{x:0.2,y:0.2,z:0.2}});
        });

        this.initialPosition = this.el.getAttribute('position').clone();
        this.initialRotation = Object.assign({},this.el.getAttribute('rotation'));

        this.move = this.move.bind(this);
        this.rotate = this.rotate.bind(this);
    },
    move:function(direction, amount){
        let worldDirection = new THREE.Vector3(0,0,0)
        switch(direction){
            case 'up':
                worldDirection.y = 1;
                break;
            case 'down':
                worldDirection.y = -1;
                break    
            case 'left':
                worldDirection.x = 1;
                break;
            case 'right':
                worldDirection.x = -1;
                break; 
            case 'forward':
                worldDirection.z = 1;
                break;
            case 'backward':
                worldDirection.z = -1;
                break;  
        }
        let worldQuaternion = this.el.object3D.getWorldQuaternion(new THREE.Quaternion(0,0,0,0))
        let localDirection = worldQuaternion.multiplyVector3(worldDirection);
        localDirection.setLength(amount);
        let ammoVector = new Ammo.btVector3(localDirection.x,localDirection.y,localDirection.z);
        this.el.body.applyCentralImpulse(ammoVector);
        Ammo.destroy(ammoVector);
    },
    rotate: function(axis, degrees){
        let rotation = this.el.getAttribute('rotation');
        let vec = new Ammo.btVector3(0,0,0);
        switch(axis){
            case 'xaxis':
                vec.setX(degrees/22);
                break;
            case 'yaxis':
                vec.setY(degrees/22);
                break;
            case 'zaxis':
                vec.setZ(degrees/22);
                break;
        }
        this.el.body.applyLocalTorque(vec);
    },
    resetPosition:function() {
        this.el.setAttribute('ammo-body','type','static');
        this.el.components['ammo-body'].updateComponent();
        this.el.setAttribute('position',this.initialPosition);
        this.el.setAttribute('rotation',this.initialRotation);
        this.el.components['ammo-body'].syncToPhysics();
        this.el.setAttribute('ammo-body','type','dynamic');
    }
});