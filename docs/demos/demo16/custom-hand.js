AFRAME.registerComponent('custom-hand',{
    schema: {
      hand:{type:"string", default:"right"},
      colliderSelector:{type:"string",default:".collidable"}
    },
    init: function(){
      this.el.setAttribute("sphere-collider",{objects:this.data.colliderSelector});
      this.el.setAttribute("hand-controls",{hand:this.data.hand});
      this.el.setAttribute("super-hands","");
      this.el.setAttribute("ammo-body",{type:"kinematic"});
      this.el.setAttribute("ammo-shape",{type:"sphere",fit:"manual",sphereRadius:0.01});
            
      this.picker = this.el.firstElementChild;

      if(this.picker && this.picker.components['picker']){
        this.el.addEventListener("thumbstickdown",this.togglePicker.bind(this));
      }
      this.updateInterval = setInterval(this.updateObjects.bind(this),500);
    },
    updateObjects: function(){
      this.el.components["sphere-collider"].update();
    },
    togglePicker: function(){
      this.picker.components['picker'].toggleVisibility();
      if(this.picker.is('visible')){
        clearInterval(this.updateInterval);
        this.el.removeAttribute('super-hands'); 
      }else{
        this.el.setAttribute('super-hands',''); 
      }
    }
  });