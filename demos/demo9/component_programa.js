AFRAME.registerComponent('programa',{
    init: function(){
        const _this = this;  
        //Creo el click listener
        this.clickListener = function(){
            const acciones = _this.el.querySelectorAll("[accion]")
            for(i = 0 ; i < acciones.length ; i++){
                const accion = acciones[i];
                setTimeout(()=>{
                    accion.emit("run");
                }, i*250);
            }
        };
        //Establezco el click listener
        this.el.addEventListener("click",this.clickListener);
    },
    remove: function(){
        this.el.removeEventListener(this.clickListener);
    }
});