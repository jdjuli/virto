AFRAME.registerComponent('ejecuta',{
    init: function(){
        const _this = this;  
        this.target = this.el.sceneEl.querySelector("[programa]");
        //Establezco el click listener
        this.el.addEventListener("grab-start",this.emitirEvento.bind(this));
    },
    remove: function(){
        this.el.removeEventListener(this.clickListener);
    },
    emitirEvento: function(evt){
        this.target.emit("run");
    }
});