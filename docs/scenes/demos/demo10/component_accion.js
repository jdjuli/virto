AFRAME.registerComponent('accion',{
    schema:{
        type:"string"
    },
    init: function(){
        const _this = this;  
        if(this.data.target === undefined){
            this.target = this.el.sceneEl.querySelector("[drone]");
        }
        //Creo el click listener
        this.runListener = function(){
            _this.target.emit(_this.data);
        };
        //Creo el listener de colisiones
        this.collisionListener = function(e){
            console.log(e);
        };
        //Establezco el click listener
        this.el.addEventListener("run",this.runListener);
        this.el.addEventListener("collide",this.collisionListener);
    },
    remove: function(){
        this.el.removeEventListener(this.runListener);
    }
});