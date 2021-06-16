AFRAME.registerComponent('ejecuta',{
    init: function(){
        const _this = this;  
        this.target = this.el.sceneEl.querySelector("[programa]");
        this.clickListener = function(){
            console.log("Ejecutando programa");
            _this.target.emit("run");
        };
        //Establezco el click listener
        this.el.addEventListener("click",this.clickListener);
    },
    remove: function(){
        this.el.removeEventListener(this.clickListener);
    }
});