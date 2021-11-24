AFRAME.registerComponent('clonable',{
    schema:{
        distance:{type:"int", default:3},//Distancia a partir de la cual la entidad se clonará
    },
    init: function(){
        //Variables internas
        this.posicionReferencia = this.el.getAttribute("position").clone();
    },
    distancia: function(pos1, pos2){
        return Math.sqrt( Math.pow(pos1.x-pos2.x, 2) + Math.pow(pos1.y-pos2.y, 2) + Math.pow(pos1.y-pos2.y, 2) );
    },
    tick: function (time, timeDelta) {
        if(this.distancia(this.posicionReferencia,this.el.getAttribute("position")) > this.data.distance){
            var clone = this.el.cloneNode();
            clone.setAttribute("position",this.posicionReferencia.clone());
            this.el.sceneEl.appendChild(clone);
            this.el.removeAttribute("clonable");
        }
    }
});