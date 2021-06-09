AFRAME.registerComponent('salta',{
    init: function(){
        const el = this.el;
        this.clickListener = function(){
            const impulse = new Ammo.btVector3(0, 10, 0);
            const pos = new Ammo.btVector3(0, 0, 0);
            el.body.applyImpulse(impulse, pos);
            Ammo.destroy(impulse);
            Ammo.destroy(pos);
        };
        this.el.addEventListener("click",this.clickListener);
    },
    remove: function(){
        this.el.removeEventListener(this.clickListener);
    }

});