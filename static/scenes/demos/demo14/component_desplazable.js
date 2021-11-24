AFRAME.registerComponent('desplazable',{
    init: function(){
        const _this = this;  
        this.listener_grab_start = function(){
            this.setAttribute("ammo-body","type","kinematic");
        };
        this.listener_grab_end = function(){
            this.setAttribute("ammo-body","type","dynamic");
        };
        this.el.addEventListener("grab-start", this.listener_grab_start);
        this.el.addEventListener("grab-end", this.listener_grab_end);
    },
    remove: function(){
        this.el.removeEventListener("grab-start",this.listener_grab_start);
        this.el.removeEventListener("grab-end",this.listener_grab_end);
    }
});