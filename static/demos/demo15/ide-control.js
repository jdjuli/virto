AFRAME.registerComponent('ide-control',{
    schema: {
        drone:{type:'selector',default:'[drone]'}
    },
    init: function(){
      this.el.setAttribute("geometry",{primitive: "box", height: 0.1, width: 0.1, depth: 0.1});
      this.el.setAttribute("material",{color: "gray"});
      this.el.setAttribute("ammo-body",{type:'static'});
      this.el.setAttribute('ammo-shape',{type:'box'});
      this.initNavigation();
    },
    initNavigation: function(){   
      
      this.E_center = document.createElement("a-entity");
      this.E_center.setAttribute("class","picker_control collidable");
      this.E_center.setAttribute("geometry",{primitive:"box", height:0.08, width: 0.08, depth: 0.01});
      this.E_center.setAttribute("material", "color", "green");
      this.E_center.setAttribute("position", {x:0, y:0, z:0.055});
      this.E_center.setAttribute("text",{value: 'run', align: "center", width: 0.8, zOffset: 0.011});
      this.E_center.setAttribute("ammo-body",{type:"kinematic",emitCollisionEvents:"true"});
      this.E_center.setAttribute("ammo-shape","type","box");

      this.E_center.addEventListener("hitend",this.runProgram.bind(this));

      this.el.appendChild(this.E_center);
    },
    runProgram: function(evt){
      let programs = Array.from(document.querySelectorAll('[program]'));
      let activeProgram = programs.filter(function(program){return program.components.program.data.active;})[0];
      this.data.drone.emit('run',{program:activeProgram.components.program});
    }
  });