AFRAME.registerComponent('ide-control',{
    schema: {
        drone:{type:'selector',default:'[drone]'}
    },
    init: function(){
      this.el.setAttribute("geometry",{primitive: "box", height: 0.1, width: 0.2, depth: 0.1});
      this.el.setAttribute("material",{color: "gray"});
      this.initNavigation();
    },
    initNavigation: function(){   
      
      this.btn_run = document.createElement("a-entity");
      this.btn_run.setAttribute("class","picker_control collidable");
      this.btn_run.setAttribute("geometry",{primitive:"box", height:0.08, width: 0.08, depth: 0.01});
      this.btn_run.setAttribute("material", "color", "green");
      this.btn_run.setAttribute("position", {x:-0.05, y:0, z:0.055});
      this.btn_run.setAttribute("text",{value: 'run', align: "center", width: 0.8, zOffset: 0.011});
      this.btn_run.setAttribute("clickable");
      this.btn_run.addEventListener("click",this.runProgram.bind(this));

      this.btn_reset = document.createElement("a-entity");
      this.btn_reset.setAttribute("class","picker_control collidable");
      this.btn_reset.setAttribute("geometry",{primitive:"box", height:0.08, width: 0.08, depth: 0.01});
      this.btn_reset.setAttribute("material", "color", "green");
      this.btn_reset.setAttribute("position", {x:0.05, y:0, z:0.055});
      this.btn_reset.setAttribute("text",{value: 'reset', align: "center", width: 0.8, zOffset: 0.011});
      this.btn_reset.setAttribute("clickable");
      this.btn_reset.addEventListener("click",this.resetDronePosition.bind(this));

      this.el.appendChild(this.btn_run);
      this.el.appendChild(this.btn_reset);
    },
    runProgram: function(evt){
      let programs = Array.from(document.querySelectorAll('[program]'));
      let activeProgram = programs.filter(function(program){return program.components.program.data.active;})[0].components['program'];
      activeProgram.run.bind(activeProgram)(this.data.drone);
    },
    resetDronePosition: function(evt) {
      this.data.drone.components['drone'].resetPosition();
    }
  });