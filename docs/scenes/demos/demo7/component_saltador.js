AFRAME.registerComponent('saltador',{
    schema:{
        altura:{type:'int', default:1},
        duracion:{type:'int', default:1000}
    },
    init: function(){
        const _this = this;   
        //Creo el click listener
        this.saltaListener = function(){
            if( !_this.el.is('saltando') ){
                _this.el.getAttribute('position').y += _this.data.altura;
                _this.el.addState('saltando');
            }
        };
        this.stateaddedListener = function(evt){
            if(evt.detail === 'saltando'){
                setTimeout(()=>{
                    _this.el.getAttribute('position').y -= _this.data.altura;
                    _this.el.removeState('saltando');
                }, 1000);
            }
        }
        //Establezco el click listener
        this.el.addEventListener("salta",this.saltaListener);
        //Establezco el listener que programa el final del salto
        this.el.addEventListener("stateadded",this.stateaddedListener);
    },
    remove: function(){
        this.el.removeEventListener(this.clickListener);
    }
});