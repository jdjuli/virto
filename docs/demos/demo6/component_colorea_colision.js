AFRAME.registerComponent('colorea_colision',{
    init: function(){
        const _this = this;  
        //Creo el run listener
        this.collideListener = function(evt){
            if( !_this.el.is("encendido") && evt.detail.body.el.hasAttribute("dynamic-body")){
                _this.el.addState("encendido");
                _this.prevColor = _this.el.getAttribute("material","color");
                _this.el.setAttribute("material","color","red");
                setTimeout(()=>{
                    _this.el.setAttribute("material","color",_this.prevColor.color);
                    _this.el.removeState("encendido");
                },100);
            }
            
        };
        //Establezco el run listener
        this.el.addEventListener("collide",this.collideListener);
    },
    remove: function(){
        this.el.removeEventListener(this.collideListener);
    }
});