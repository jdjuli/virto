var buscarTarget = function(component){
    //Busco el target o lo asigno a el propio elemento
    if(component.data.target !== null){
        component.target = component.el.sceneEl.querySelector(component.data.target);
    }else{
        component.target = component;
    }
    //Me aseguro de que el target tiene la propiedad "saltando"
    if(component.target.saltando === undefined){
        component.target.saltando = false;
    } 
}

AFRAME.registerComponent('salta_otro',{
    schema:{
        target:{type:"string",default:null}
    },
    init: function(){
        const _this = this;
        buscarTarget(this);        
        //Creo el click listener
        this.clickListener = function(){
            if( !_this.target.saltando ){
                _this.target.saltando = true;
                _this.target.getAttribute('position').y += 1;
                setTimeout(()=>{_this.target.getAttribute('position').y -= 1; _this.target.saltando = false;}, 1000);
            }
        };
        //Establezco el click listener
        this.el.addEventListener("click",this.clickListener);
    },
    update: function(oldData){
        if(this.data.target !== oldData.target){
            //Busco de nuevo el target porque ha cambiado
            buscarTarget(this);
        }
    },
    remove: function(){
        this.el.removeEventListener(this.clickListener);
    }
});