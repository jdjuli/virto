/* 
 * Component to teleport dynamic entities 2m above if they fall below 'below_y'.
 * Based on: https://stackoverflow.com/questions/66423513/how-to-move-a-dynamic-body-with-a-frame-physics-system-when-using-ammo-driver
 */
AFRAME.registerComponent('teleport',{
    schema:{
        below_y:{type:'number',default:0.0}
    },
    init: function(){
        this.el.addEventListener('body-loaded', function(evt){
            this.physics = this.el.components['ammo-body'];
            this.zero = new Ammo.btVector3(0,0,0);
        }.bind(this));
    },  
    tick: function(){
        if(!this.physics) return;

        if(this.physics.body.getCollisionFlags() == 2){
            this.physics.updateCollisionFlags();
            this.physics.body.setLinearVelocity(this.zero);
        }
        if(this.el.object3D.position.y < this.data.below_y){
            this.el.object3D.position.y+=2;
            this.physics.body.setCollisionFlags(2);
            this.physics.syncToPhysics();
        }
    }
});