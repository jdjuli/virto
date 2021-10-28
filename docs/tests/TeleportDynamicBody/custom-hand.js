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
      
      this.indexFinger = document.createElement("a-entity");
      this.indexFinger.setAttribute("geometry",{primitive:"box",height:0.01,width:0.01,depth:0.05});
      this.indexFinger.setAttribute("material",{opacity:0.0});
      this.indexFinger.setAttribute("ammo-body",{type:"kinematic",activationState:"disableSimulation"});
      this.indexFinger.setAttribute("ammo-shape",{type:"box"});
      if(this.data.hand == "right"){
        this.indexFinger.setAttribute("position",{x:0.025, y:0.04, z:-0.07})
      }else if(this.data.hand == "left"){
        this.indexFinger.setAttribute("position",{x:-0.025, y:0.04, z:-0.07})
      }
      this.el.appendChild(this.indexFinger);
      
      this.picker = this.el.sceneEl.querySelector("[picker]");

      this.el.addEventListener("pointingstart",this.enableIndex.bind(this));
      this.el.addEventListener("pointingend",this.disableIndex.bind(this));
      this.el.addEventListener("thumbstickdown",this.togglePicker.bind(this));
      this.updateObjects = setInterval(this.updateObjects.bind(this),250);
    },
    enableIndex: function(){
      this.indexFinger.setAttribute("ammo-body","activationState","active");
    },
    disableIndex: function(){
      this.indexFinger.setAttribute("ammo-body","activationState","disableSimulation");
    },
    updateObjects: function(){
      this.el.components["sphere-collider"].update();
    },
    togglePicker: function(){
      if(this.picker === null){
        this.picker = this.el.sceneEl.querySelector("[picker]");
      } 
      if(this.picker !== null){
        this.picker.components["picker"].toggleVisibility();
      }
    }
  });