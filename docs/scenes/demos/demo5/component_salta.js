AFRAME.registerComponent('salta',{
    init: function(){
        const el = this.el;
        this.clickListener = function(){
            var position = el.getAttribute('position');
            var impulse = new Ammo.btVector3(0, 5, 0);
            var pos = new Ammo.btVector3(position.x, position.y, position.z);
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