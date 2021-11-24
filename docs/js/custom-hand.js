  AFRAME.registerComponent('custom-hand',{
    schema: {
      hand:{type:"string", oneOf:['left','right']},
      colliderSelector:{type:"string"}
    },
    init: function(){
      this.useAmmo = this.el.sceneEl.systems['physics'].data.driver == 'ammo'; 
      this.el.setAttribute("sphere-collider",{objects:this.data.colliderSelector});
      this.el.setAttribute("hand-controls",{hand:this.data.hand});
      this.el.setAttribute("super-hands","");
      if(this.useAmmo){
        this.el.setAttribute("ammo-body",{type:"kinematic"});
        this.el.setAttribute("ammo-shape",{type:"sphere",fit:"manual",sphereRadius:0.01});
        this.el.addEventListener('pointingstart',this.createIndexFinger.bind(this));
        this.el.addEventListener('pointingend',this.destroyIndexFinger.bind(this));
      }
      
      this.handMenu = this.el.firstElementChild;
      if(this.handMenu && this.handMenu.components['hand-menu']){
        this.el.addEventListener("thumbstickdown",this.toggleMenu.bind(this));
      }

      this.updateInterval = setInterval(this.updateObjects.bind(this),500);
    },
    updateObjects: function(){
      this.el.components["sphere-collider"].update();
    },
    toggleMenu: function(){
      this.handMenu.components['hand-menu'].toggleVisibility();
      if(this.handMenu.is('visible')){
        this.el.removeAttribute('super-hands'); 
      }else{
        this.el.setAttribute('super-hands',''); 
      }
    },
    createIndexFinger: function (params) {
      this.indexFinger = document.createElement('a-entity');
      this.indexFinger.setAttribute('class','finger');
      this.indexFinger.setAttribute("ammo-body",{type:'kinematic',emitCollisionEvents:true});
      this.indexFinger.setAttribute("ammo-shape",{type:'box', fit:'manual', halfExtents:{x:0.007, y:0.007, z:0.04}});
      if(this.data.hand == 'right'){
        this.indexFinger.setAttribute('position',{x:0.025, y:0.04, z:-0.06})
      }else if(this.data.hand == 'left'){
        this.indexFinger.setAttribute('position',{x:-0.025, y:0.04, z:-0.06})
      }
      this.el.appendChild(this.indexFinger);
    },
    destroyIndexFinger: function (params) {
      this.indexFinger.remove();
      this.indexFinger = null;
    }
  });