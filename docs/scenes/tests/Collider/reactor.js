AFRAME.registerComponent('reactor',{
    init: function(){
        this.el.addEventListener('collidestart',(e)=>{
            this.el.setAttribute('material','color','blue');
        });
        this.el.addEventListener('collideend',(e)=>{
            this.el.setAttribute('material','color','green');
        });
    }
  });