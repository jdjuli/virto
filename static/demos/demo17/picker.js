AFRAME.registerComponent('picker',{
    schema: {
      width: {type:"float", default: 0.3},
      height: {type:"float", default: 0.13},
      cols: {type:"int", default: 2},
      instructions: {type:'array', default:['up','down']},
      target: {type:'selector', default:'[ide]'}
    },
    init: function(){
      this.displayIndex = 0;
      this.buttons = [];
      this.clickHandlers = [];
      this.instructionSelected = null;
      this.itemSize = this.data.width/(this.data.cols+1);
      this.itemSpacing = this.data.width/this.data.cols;
      this.itemBaseX = -this.data.width*0.5 + this.itemSpacing/2;
  
      for(let i=0 ; i<this.data.cols; i++){
        let tile = document.createElement('a-entity');
        tile.setAttribute('class','collidable');
        tile.setAttribute('geometry',{primitive:'box',height:this.itemSize,width:this.itemSize,depth:0.02});
        tile.setAttribute('material',{color:'green'});
        tile.setAttribute('position',{x:this.itemBaseX+i*this.itemSpacing, y:this.data.height*0.35, z:0.005});
        this.el.appendChild(tile);
        this.buttons.push(tile);
        this.clickHandlers[i] = this.clicked.bind(this,i);
      }

      this.el.setAttribute('geometry',{primitive:'box', height:this.data.height+0.1, width:this.data.width, depth:0.02});
      this.el.setAttribute('material',{color: 'gray'});
      this.el.setAttribute('position','0.2 0.2 -0.05');
      this.el.setAttribute('visible','false');

      this.E_right = document.createElement("a-entity");
      this.E_right.setAttribute("class","collidable");
      this.E_right.setAttribute("geometry",{primitive:"box", height:this.data.height*0.4, width:this.data.width*0.4, depth:0.02});
      this.E_right.setAttribute("material", "color", "green");
      this.E_right.setAttribute("position", {x:this.data.width*0.25, y:-this.data.height*0.5, z:0.005});
      this.E_right.setAttribute("text",{value:">", align:"center", width:this.data.width*2, zOffset:0.011});

      this.E_left = document.createElement("a-entity");
      this.E_left.setAttribute("class","collidable");
      this.E_left.setAttribute("geometry",{primitive:"box", height:this.data.height*0.4, width:this.data.width*0.4, depth:0.02});
      this.E_left.setAttribute("material", "color", "green");
      this.E_left.setAttribute("position", {x:-this.data.width*0.25, y:-this.data.height*0.5, z:0.005});
      this.E_left.setAttribute("text",{value: "<", align: "center", width:this.data.width*2, zOffset:0.011});
      
      this.moveLeftHandler = this.decrementIndex.bind(this);
      this.moveRightHandler = this.incrementIndex.bind(this);

      this.el.appendChild(this.E_right);
      this.el.appendChild(this.E_left);
      
      this.updateCatalog();
    },
    incrementIndex: function(){
      if(this.displayIndex<this.data.instructions.length-this.data.cols){
          this.displayIndex++;
          this.updateCatalog();
        }
    },
    decrementIndex: function(){
      if(this.displayIndex>0){
          this.displayIndex--;
          this.updateCatalog();
        }
    },
    updateCatalog: function(){    
      for(let i = 0 ; i < this.data.cols; i++){
        if(this.displayIndex+i < this.data.instructions.length){
          this.buttons[i].setAttribute("text",{value: this.data.instructions[this.displayIndex+i], align: "center", width:this.data.width*2, zOffset:0.011});
        }
      }
    },
    toggleVisibility: function(){
      if(this.el.is('visible')){
        this.el.removeState('visible');
        this.el.setAttribute("visible",false);
        for(let i=0 ; i<this.data.cols; i++){
          this.buttons[i].removeEventListener('collidestart',this.clickHandlers[i]);
          this.buttons[i].removeAttribute('ammo-body');
          this.buttons[i].removeAttribute('ammo-shape');
        }
        this.E_left.removeEventListener("collidestart",this.moveLeftHandler);
        this.E_left.removeAttribute('ammo-body');
        this.E_left.removeAttribute('ammo-shape');
        this.E_right.removeEventListener("collidestart",this.moveRightHandler);
        this.E_right.removeAttribute('ammo-body');
        this.E_right.removeAttribute('ammo-shape');
      }else{
        this.el.addState('visible');
        this.el.setAttribute("visible",true);
        for(let i=0 ; i<this.data.cols; i++){
          this.buttons[i].addEventListener('collidestart',this.clickHandlers[i]);
          this.buttons[i].setAttribute("ammo-body",{type:'kinematic',emitCollisionEvents:true});
          this.buttons[i].setAttribute('ammo-shape',{type:'box'});
        }
        this.E_left.addEventListener("collidestart",this.moveLeftHandler);
        this.E_left.setAttribute("ammo-body",{type:'kinematic',emitCollisionEvents:true});
        this.E_left.setAttribute('ammo-shape',{type:'box'});
        this.E_right.addEventListener("collidestart",this.moveRightHandler);
        this.E_right.setAttribute("ammo-body",{type:'kinematic',emitCollisionEvents:true});
        this.E_right.setAttribute('ammo-shape',{type:'box'});
      }
    },
    clicked: function(btnNum) {
      //Remove previous instruction or skip event if isn't attached to it's parent yet
      if(this.instructionSelected != null){
        if(this.instructionSelected.attached){
          this.instructionSelected.remove();
        }else if(this.instructionSelected.parentNode){
          const instruction = this.instructionSelected;
          this.instructionSelected.addEventListener('loaded',(e)=>{instruction.remove();});
        }
      }
      //Create selected instruction
      this.instructionSelected = document.createElement('a-entity');
      this.instructionSelected.setAttribute('instruction',{type:this.data.instructions[this.displayIndex+btnNum]});
      this.instructionSelected.setAttribute('position',{x:0.4, y:0.2, z:0});
      this.instructionSelected.setAttribute('grabbable','');
      this.data.target.appendChild(this.instructionSelected);
    }
  });