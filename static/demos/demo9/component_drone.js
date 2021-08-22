AFRAME.registerComponent('drone',{
    init: function(){
        const _this = this;   

        this.subeListener = function(){
            _this.el.getAttribute('position').y += 1;
        };
        this.bajaListener = function(){
            _this.el.getAttribute('position').y -= 1;
        };

        this.el.addEventListener("sube",this.subeListener);
        this.el.addEventListener("baja",this.bajaListener);
    },
    remove: function(){
        this.el.removeEventListener(this.subeListener);
        this.el.removeEventListener(this.bajaListener);
    }
});