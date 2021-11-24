AFRAME.registerComponent('instruction-selector',{
    schema: {
      instructions:{type:'array',default:['init']}
    },
    init: function(){
      this.displayIndex = 0;        
      this.instructionSelected = null;
      this.el.setAttribute("geometry",{primitive: "box", height: 0.1, width: 0.3, depth: 0.1});
      this.el.setAttribute("material",{color: "gray"});
      this.el.setAttribute("ammo-body",{type:'static'});
      this.el.setAttribute('ammo-shape',{type:'box'});
      this.initNavigation();
    },
    initNavigation: function(){
      this.E_right = document.createElement("a-entity");
      this.E_right.setAttribute("class","picker_control collidable");
      this.E_right.setAttribute("geometry",{primitive:"box", height:0.08, width: 0.08, depth: 0.01});
      this.E_right.setAttribute("material", "color", "green");
      this.E_right.setAttribute("position", {x:0.1, y:0, z:0.055});
      this.E_right.setAttribute("text",{value: ">", align: "center", width: 0.8, zOffset: 0.011});
      this.E_right.setAttribute("clickable");
    
      this.E_left = document.createElement("a-entity");
      this.E_left.setAttribute("class","picker_control collidable");
      this.E_left.setAttribute("geometry",{primitive:"box", height:0.08, width: 0.08, depth: 0.01});
      this.E_left.setAttribute("material", "color", "green");
      this.E_left.setAttribute("position", {x:-0.1, y:0, z:0.055});
      this.E_left.setAttribute("text",{value: "<", align: "center", width: 0.8, zOffset: 0.011});
      this.E_left.setAttribute("clickable");
      
      this.E_center = document.createElement("a-entity");
      this.E_center.setAttribute("class","picker_control collidable");
      this.E_center.setAttribute("geometry",{primitive:"box", height:0.08, width: 0.08, depth: 0.01});
      this.E_center.setAttribute("material", "color", "green");
      this.E_center.setAttribute("position", {x:0, y:0, z:0.055});
      this.E_center.setAttribute("text",{value: this.data.instructions[0], align: "center", width: 0.8, zOffset: 0.011});
      this.E_center.setAttribute("clickable");

      this.E_left.addEventListener("click",this.decrementIndex.bind(this));
      this.E_right.addEventListener("click",this.incrementIndex.bind(this));
      this.E_center.addEventListener("click",this.selectedItem.bind(this));
  
      this.el.appendChild(this.E_right);
      this.el.appendChild(this.E_left);
      this.el.appendChild(this.E_center);
    },
    incrementIndex: function(){
      if(this.displayIndex<this.data.instructions.length-1){
          this.displayIndex++;
          this.E_center.setAttribute('text','value',this.data.instructions[this.displayIndex]);
        }
    },
    decrementIndex: function(){
      if(this.displayIndex>0){
          this.displayIndex--;
          this.E_center.setAttribute('text','value',this.data.instructions[this.displayIndex]);
        }
    },
    selectedItem: function(evt){
      const intructionType = this.E_center.getAttribute('text').value
      if(this.instructionSelected != null && this.instructionSelected.attached){
        this.instructionSelected.remove();
      }
      this.instructionSelected = document.createElement('a-entity');
      this.instructionSelected.setAttribute('instruction',{type:intructionType});
      this.instructionSelected.setAttribute('position',{x:0, y:0.1, z:0});
      this.el.appendChild(this.instructionSelected);
      console.log(intructionType);
    }
  });