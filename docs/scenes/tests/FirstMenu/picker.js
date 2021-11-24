AFRAME.registerComponent('picker',{
    schema: {
      width: {type:"float", default: 0.4},
      height: {type:"float", default: 0.2},
      cols: {type:"int", default: 2}
    },
    init: function(){
      this.items = this.el.querySelectorAll(":not(.picker_control)");
      this.displayIndex = 0;
      this.visibleItems = [];
      this.itemSize = (this.data.width*0.7)/(this.data.cols+1);
      this.itemSpacing = (this.data.width*0.7)/(this.data.cols);
      this.itemBaseX = -this.data.width*0.35 + this.itemSpacing/2;
      
      for(let item of this.items){
        item.setAttribute("geometry",{primitive:'box',height:this.itemSize,width:this.itemSize,depth:0.02});
        item.setAttribute("visible","false");
        item.setAttribute("ammo-body",{type:'kinematic',linearDamping:0,emitCollisionEvents:false,disableCollision:true,activationState:'disableSimulation'});
        item.setAttribute("ammo-shape",{type:'box'});
      }
  
      this.el.setAttribute("geometry",{
      primitive: "box",
        height: this.data.height+0.1,
        width: this.data.width,
        depth: 0.02
      });
      this.el.setAttribute("material",{
        color: "gray"
      });
      this.el.setAttribute("position","0.2 0.2 -0.05");
      this.initNavigation();
    },
    initNavigation: function(){
      this.E_right = document.createElement("a-entity");
      this.E_right.setAttribute("class","picker_control collidable");
      this.E_right.setAttribute("geometry",{
        primitive:"box",
        height:this.data.height*0.8,
        width: this.data.width*0.1,
        depth: 0.02
      });
      this.E_right.setAttribute("material", "color", "green");
      this.E_right.setAttribute("position", {
        x:this.data.width*0.40,
        y:0,
        z:0.005
      });
      this.E_right.setAttribute("text",{
        value: ">",
        align: "center",
        width: this.data.width*2,
        zOffset: 0.011
      });
      this.E_right.setAttribute("ammo-body",{type:"kinematic",emitCollisionEvents:"true"});
      this.E_right.setAttribute("ammo-shape","type","box");
    
      this.E_left = document.createElement("a-entity");
      this.E_left.setAttribute("class","picker_control collidable");
      this.E_left.setAttribute("geometry",{
        primitive:"box",
        height:this.data.height*0.8,
        width: this.data.width*0.1,
        depth: 0.02
      });
      this.E_left.setAttribute("material", "color", "green");
      this.E_left.setAttribute("position", {
        x:-this.data.width*0.4,
        y:0,
        z:0.005
      });
      this.E_left.setAttribute("text",{
        value: "<",
        align: "center",
        width: this.data.width*2,
        zOffset: 0.011
      });
      this.E_left.setAttribute("ammo-body",{type:"kinematic",emitCollisionEvents:"true"});
      this.E_left.setAttribute("ammo-shape","type","box");
      
      this.E_left.addEventListener("collidestart",this.decrementIndex.bind(this));
      this.E_right.addEventListener("collidestart",this.incrementIndex.bind(this));
      this.el.addEventListener("selectedItem",this.selectedItem.bind(this));
  
      this.el.appendChild(this.E_right);
      this.el.appendChild(this.E_left);
      
      this.updateCatalog();
      //this.toggleVisibility();
    },
    incrementIndex: function(){
      if(this.displayIndex<this.items.length-this.data.cols){
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
      while(this.visibleItems.length>0){
        let item = this.visibleItems.pop();
        item.setAttribute("visible","false");
        item.setAttribute("ammo-body","emitCollisionEvents",false);
        item.setAttribute("ammo-body","activationState","disableSimulation");
        item.setAttribute("ammo-body","disableCollision",true);        
        item.setAttribute("position",{x:0,y:0.4,z:0.000});
      }
      for(let i = 0 ; i < this.data.cols; i++){
        if(this.displayIndex+i < this.items.length){
          let tile = this.items[this.displayIndex+i];
          tile.setAttribute("position",{x:this.itemBaseX+this.itemSpacing*i,y:0,z:0.01});
          tile.setAttribute("ammo-body","emitCollisionEvents",true);
          tile.setAttribute("ammo-body","activationState","active");
          tile.setAttribute("ammo-body","disableCollision",false);
          tile.setAttribute("visible","true");
          this.visibleItems.push(tile);
        }
      }
    },
    toggleVisibility: function(){
      if(this.el.getAttribute("visible")){
        this.el.setAttribute("visible",false);
        this.E_right.setAttribute("ammo-body","disableCollision",true);
        this.E_right.setAttribute("ammo-body","activationState","disableSimulation");
        this.E_left.setAttribute("ammo-body","disableCollision",true);
        this.E_left.setAttribute("ammo-body","activationState","disableSimulation");
      }else{
        this.el.setAttribute("visible",true);
        this.E_right.setAttribute("ammo-body","disableCollision",false);
        this.E_right.setAttribute("ammo-body","activationState","active");
        this.E_left.setAttribute("ammo-body","disableCollision",false);
        this.E_left.setAttribute("ammo-body","activationState","active");
      }
    },
    selectedItem: function(evt){
      console.log(evt.detail.type);
    }
  });