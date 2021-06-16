AFRAME.registerComponent('programa',{
    init: function(){
        const _this = this;  
        //Creo el run listener
        this.runListener = function(){
            if( !_this.el.is("ejecutando") ){

                _this.el.addState("ejecutando")
                var acciones_nodelist = _this.el.querySelectorAll("[accion]")
                const acciones = Array.prototype.slice.call(acciones_nodelist, 0);
                acciones.sort((a, b)=>{
                    var b_y = b.getAttribute("position").y;
                    var a_y = a.getAttribute("position").y;
                    if(a_y > b_y) return -1;
                    if(a_y < b_y) return  1;
                    return 0;
                })
                for(i = 0 ; i < acciones.length ; i++){
                    const accion = acciones[i];
                    setTimeout(()=>{
                        accion.emit("run");
                    }, i*250);
                }
                setTimeout(()=>{_this.el.removeState("ejecutando")}, acciones.length*250);
            }
        };
        //Establezco el run listener
        this.el.addEventListener("run",this.runListener);
    },
    remove: function(){
        this.el.removeEventListener(this.runListener);
    }
});