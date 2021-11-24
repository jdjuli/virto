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
            console.log("Ejecutando acción: "+_this.data);
            _this.target.emit(_this.data);
        };
        //Establezco el click listener
        this.el.addEventListener("run",this.runListener);
    },
    remove: function(){
        this.el.removeEventListener(this.runListener);
    }
});