AFRAME.registerComponent('accion',{
    schema:{
        name:{type:"string"},//Nombre de la accion a realizar
        target:{type:"string",default:"[drone]"},//selector css de la entidad que recibirá la accion
        program:{type:"string",default:"[programa]"},//selector css del programa al que asociarse
        class:{type:"string",default:"collidable"}//si la entidad contra la que colisiona tiene esta clase, se añade al programa.
    },
    init: function(){
        //Variables internas
        this.target = this.el.sceneEl.querySelector(this.data.target);
        this.programa = this.el.sceneEl.querySelector(this.data.program);
        this.posicionReferencia = this.el.getAttribute("position").clone();
        this.clonar = true;
        this.enPrograma = false;

        //Escuchadores de eventos
        this.el.addEventListener("run",this.run.bind(this));
        this.el.addEventListener("mover",this.mover.bind(this));
        this.el.addEventListener("collidestart",this.colision.bind(this));
    },
    remove: function(){
        this.el.removeEventListener("run",this.run);
        this.el.removeEventListener("mover",this.mover);
        this.el.removeEventListener("colision",this.colision);
    },
    run: function(evt){
        evt.preventDefault();
        evt.stopPropagation()
        this.target.emit(this.data.name,null,false);
    },
    mover: function(evt){
        this.el.setAttribute("position",evt.detail.posicion.clone());
        this.el.setAttribute("rotation","0 0 0");
        this.el.setAttribute("ammo-body","type","kinematic");
        this.posicionReferencia = evt.detail.posicion.clone();
        this.el.flushToDOM();
    },
    colision: function(evt){
        if(evt.detail.targetEl.classList.contains(this.data.class)){
            this.programa.emit("anadir",{instruccion: this.el},false);
            this.enPrograma = true;
            this.posicionReferencia = this.el.getAttribute("position").clone();
        }
        //console.log(evt.detail.targetEl); <- entidad contra la que se ha colisionado
    },
    distancia: function(pos1, pos2){
        return Math.sqrt( Math.pow(pos1.x-pos2.x, 2) + Math.pow(pos1.y-pos2.y, 2) + Math.pow(pos1.y-pos2.y, 2) );
    },
    tick: function (time, timeDelta) {
        var instruccion = this.el;
        if(this.clonar){
            if(this.distancia(this.posicionReferencia,instruccion.getAttribute("position")) > 2.0){
                var clone = this.el.cloneNode();
                clone.setAttribute("position",this.posicionReferencia.clone());
                instruccion.sceneEl.appendChild(clone);
                this.clonar = false;
            }
        }
        if(this.enPrograma){
            if(this.distancia(this.posicionReferencia,this.el.getAttribute("position")) > 2.0){
                this.programa.emit("quitar",{instruccion: instruccion},false);              
                this.enPrograma = false;
            }
        }
    }
});