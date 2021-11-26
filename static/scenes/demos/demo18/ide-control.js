AFRAME.registerComponent('ide-control',{
    schema: {
        drone:{type:'selector',default:'[drone]'}
    },
    init: function(){
      this.el.setAttribute("geometry",{primitive: "box", height: 0.1, width: 0.2, depth: 0.1});
      this.el.setAttribute("material",{src:'textures/Wood025_1K_Color.png'});
      this.initNavigation();
    },
    initNavigation: function(){   
      
      this.btn_run = document.createElement("a-entity");
      this.btn_run.setAttribute("class","collidable");
      this.btn_run.setAttribute("obj-model",{obj:'instruction.obj'});
      this.btn_run.setAttribute("material", {src:'textures/run.png'});
      this.btn_run.setAttribute('scale',{x:0.8, y:0.8, z:0.2});
      this.btn_run.setAttribute("position", {x:-0.05, y:0, z:0.055});
      this.btn_run.addEventListener('model-loaded',(evt)=>{
        this.btn_run.setAttribute("ammo-body",{type:'static',emitCollisionEvents:'true'});
        this.btn_run.setAttribute("ammo-shape",{type:'box'});
        this.btn_run.addEventListener("collidestart",this.runProgram.bind(this));
      });

      this.btn_reset = document.createElement("a-entity");
      this.btn_reset.setAttribute("class","picker_control collidable");
      this.btn_reset.setAttribute("obj-model",{obj:'instruction.obj'});
      this.btn_reset.setAttribute("material", {src:'textures/reset.png'});
      this.btn_reset.setAttribute('scale',{x:0.8, y:0.8, z:0.2});
      this.btn_reset.setAttribute("position", {x:0.05, y:0, z:0.055});
      this.btn_reset.addEventListener('model-loaded',(evt)=>{
        this.btn_reset.setAttribute("ammo-body",{type:'static',emitCollisionEvents:'true'});
        this.btn_reset.setAttribute("ammo-shape",{type:'box'});
        this.btn_reset.addEventListener("collidestart",this.resetDronePosition.bind(this));
      });

      this.el.appendChild(this.btn_run);
      this.el.appendChild(this.btn_reset);
    },
    runProgram: function(evt){
      if(!evt.detail.targetEl.classList.contains('finger')) return;
      this.btn_run.removeAttribute('ammo-shape');
      this.btn_run.removeAttribute('ammo-body');
      let programs = Array.from(document.querySelectorAll('[program]'));
      let activeProgram = programs.filter(function(program){return program.components.program.data.active;})[0].components['program'];
      activeProgram.run.bind(activeProgram)(this.data.drone);
      this.btn_run.setAttribute("ammo-body",{type:'static',emitCollisionEvents:'true'});
      this.btn_run.setAttribute('ammo-shape',{type:'box'});
    },
    resetDronePosition: function(evt) {
      if(!evt.detail.targetEl.classList.contains('finger')) return;
      this.btn_reset.removeAttribute('ammo-shape');
      this.btn_reset.removeAttribute('ammo-body');
      this.data.drone.components['drone'].resetPosition();
      this.btn_reset.setAttribute("ammo-body",{type:'static',emitCollisionEvents:'true'});
      this.btn_reset.setAttribute('ammo-shape',{type:'box'});
    }
  });