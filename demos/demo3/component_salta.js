AFRAME.registerComponent('salta',{
    init: function(){
        const el = this.el;
        this.saltando = false;
        this.clickListener = function(){
            if(!el.saltando){
                el.saltando = true;
                el.getAttribute('position').y += 1;
                setTimeout(()=>{el.getAttribute('position').y -= 1; el.saltando=false;}, 1000)
            }
        };
        this.el.addEventListener("click",this.clickListener);
    },
    remove: function(){
        this.el.removeEventListener(this.clickListener);
    }

});