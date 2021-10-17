AFRAME.registerComponent('programa',{
    init: function(){
        this.inicializarElementosDOM(this);
        this.el.addEventListener("run",this.ejecutar.bind(this));
        this.el.addEventListener("anadir",this.anadirInstruccion.bind(this));
        this.el.addEventListener("quitar",this.quitarInstruccion.bind(this));
    },
    remove: function(){
        this.el.removeEventListener(this.runListener);
    },
    quitarInstruccion: function(evt){
        var instruccion = evt.detail.instruccion;
        instruccion.setAttribute("ammo-body","type","dynamic");
        this.reparent(instruccion, instruccion.sceneEl);
        this.ordenarInstrucciones();
    },
    anadirInstruccion: function(evt){
        var instruccion = evt.detail.instruccion;
        this.reparent(instruccion,this.E_instrucciones);
        instruccion.emit("mover",{posicion: this.calcularPosicion(instruccion)},false);
    },
    ordenarInstrucciones: function(){
        var pos = new THREE.Vector3(0,0,0);
        pos.y += this.E_plataforma.getAttribute("geometry").height/2;
        for(var i = this.E_instrucciones.children.length-1 ; i>=0 ; i--){
            var instruccion = this.E_instrucciones.children[i];
            var semialtura = instruccion.getAttribute("geometry").height/2
            pos.y += semialtura;
            instruccion.emit("mover",{posicion: pos},false);
            pos.y += semialtura;
        }
    },
    reparent: function(entidad, nuevoPadre){
        var antiguoPadre = entidad.parentEl;
        if (antiguoPadre == nuevoPadre) return;
        entidad.removeFromParent();
        antiguoPadre.removeChild(entidad);
        nuevoPadre.appendChild(entidad);
        //entidad.addToParent();
    },
    calcularPosicion: function(node){
        var pos = new THREE.Vector3(0,0,0);
        pos.y += this.E_plataforma.getAttribute("geometry").height/2;
        pos.y += node.getAttribute("geometry").height/2;
        if(this.E_instrucciones.childElementCount > 0){
            for(var i of this.E_instrucciones.children){
                if(i == node) break;
                pos.y += i.getAttribute("geometry").height;
            }
        }
        return pos;
    },
    ejecutar: function(){
        var delay = 250;
        for(const i of this.E_instrucciones.children){
            if(i.hasAttribute("accion")){
                setTimeout(()=>{
                    i.emit("run");
                },delay);
                delay += 250;
            }
        }
    },
    inicializarElementosDOM: function(programa){
        this.E_plataforma = document.createElement("a-entity");
        this.E_ejecutar = document.createElement("a-entity");
        var textoEjecutar = document.createElement("a-entity");
        this.E_instrucciones = document.createElement("a-entity");
    
        this.E_plataforma.alturaInicial = 0.1;
        this.E_plataforma.setAttribute("geometry","primitive:box; height:"+this.E_plataforma.alturaInicial+"; width: 2; depth: 2");
        this.E_plataforma.setAttribute("material","color:blue;");
        this.E_plataforma.setAttribute("ammo-body","type:static; emitCollisionEvents: true;");
        this.E_plataforma.setAttribute("ammo-shape","type:box");
        this.E_plataforma.setAttribute("class","collidable");
        this.E_plataforma.flushToDOM();
        //this.E_plataforma.addEventListener("collidestart",this.insertarArriba.bind(this));
    
        textoEjecutar.setAttribute("text","value: Ejecutar; color:white; align: center; width: 5");
        textoEjecutar.setAttribute("position","0 0 0.5");
        this.E_ejecutar.appendChild(textoEjecutar);
    
        this.E_ejecutar.setAttribute("class","raycastable");
        this.E_ejecutar.setAttribute("geometry","primitive:box; height: 1; width: 1; depth: 1");
        this.E_ejecutar.setAttribute("material","color:green; shader: flat");
        this.E_ejecutar.setAttribute("position","2 0.5 0");
        this.E_ejecutar.setAttribute("ammo-body","type:static ;activationState:disableDeactivation");
        this.E_ejecutar.setAttribute("ammo-shape","type:box");
        this.E_ejecutar.setAttribute("clickable","");
        this.E_ejecutar.setAttribute("ejecuta","");
    
        programa.el.appendChild(this.E_plataforma);
        programa.el.appendChild(this.E_ejecutar);
        programa.el.appendChild(this.E_instrucciones);
    }
});