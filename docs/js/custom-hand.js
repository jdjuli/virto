  AFRAME.registerComponent('custom-hand',{
    schema: {
      hand:{type:"string", oneOf:['left','right']},
      colliderSelector:{type:"string"}
    },
    init: function(){
      this.movingThumbstick = false;
      this.useAmmo = this.el.sceneEl.systems['physics'] && this.el.sceneEl.systems['physics'].data.driver == 'ammo'; 
      this.oppositeHand = Array.prototype.slice.apply(document.querySelectorAll('[custom-hand]')).filter(e=>e!=this.el)[0];

      this.toggleMenu = this.toggleMenu.bind(this);
      this.toggleHelp = this.toggleHelp.bind(this);
      this.buttonHelpDown = this.buttonHelpDown.bind(this);
      this.buttonHelpUp = this.buttonHelpUp.bind(this);
      this.thumbstickHandler = this.thumbstickHandler.bind(this);
      this.createIndexFinger = this.createIndexFinger.bind(this);
      this.destroyIndexFinger = this.destroyIndexFinger.bind(this);

      this.el.setAttribute("obb-collider",{objects:this.data.colliderSelector,radius:0.05});
      this.el.setAttribute("hand-controls",{hand:this.data.hand});
      this.el.setAttribute("super-hands",{
        grabStartButtons:['gripdown'],
        grabEndButtons:['gripup'],  
        dragDropStartButtons:['gripdown'],
        dragDropEndButtons:['gripup']
      });

      this.help = document.createElement('a-entity');
      this.help.setAttribute('controller-help',{hand:this.data.hand});
      this.help.setAttribute('scale',{x:0.11,y:0.11,z:0.11});
      this.help.setAttribute('rotation',{x:17,y:0,z:this.data.hand=='left'?8:-8});
      this.help.setAttribute('position',{x:this.data.hand=='left'?0.02:-0.02,y:0.05,z:0});
      this.el.appendChild(this.help);

      this.el.setAttribute("teleport-controls",{startEvents:['triggerdown'],endEvents:['triggerup'],cameraRig:'[multidevice]'});
      if(this.useAmmo){
        this.el.setAttribute("ammo-body",{type:"kinematic"});
        this.el.setAttribute("ammo-shape",{type:"sphere",fit:"manual",sphereRadius:0.01});
      }
      
      this.menuEl = document.createElement('a-entity');
      this.menuEl.setAttribute('hand-menu',{contents:JSON.stringify(
        [
          {name:'Instructions', 
           items:[
            {textureAsset:'#box_move', component:'instruction', data:{function:'move'}},
            {textureAsset:'#box_rotate', component:'instruction', data:{function:'rotate'}},
            {textureAsset:'#box_cond', component:'instruction-conditional', data:{}},
            {textureAsset:'#box_loop', component:'instruction-loop', data:{}}
           ]
          },
          {name:'Parameters', 
           component:'parameter', 
           items:[
             {textureAsset:'#box_up', data:{type:'up',function:'move'}},
             {textureAsset:'#box_down', data:{type:'down',function:'move'}},
             {textureAsset:'#box_right', data:{type:'right',function:'move'}},
             {textureAsset:'#box_left', data:{type:'left',function:'move'}},
             {textureAsset:'#box_forward', data:{type:'forward',function:'move'}},
             {textureAsset:'#box_backward', data:{type:'backward',function:'move'}},
             {textureAsset:'#box_xaxis', data:{type:'xaxis',function:'rotate'}},
             {textureAsset:'#box_yaxis', data:{type:'yaxis',function:'rotate'}},
             {textureAsset:'#box_zaxis', data:{type:'zaxis',function:'rotate'}}
           ]
          },
          {name:'Variables',
           component:'variable', 
           items:[
            {textureAsset:'#box_text', text:'S', data:{type:'integer',value:0,min:-9,max:9}},
            {textureAsset:'#box_text', text:'M', data:{type:'integer',value:0,min:-99,max:99}},
            {textureAsset:'#box_text', text:'L', data:{type:'integer',value:0,min:-999,max:999}},
            {textureAsset:'#box_text', text:'T/F', data:{type:'boolean',value:'true'}},
           ]
          },
        ]
      )});
      this.menuEl.setAttribute('position',{x:this.data.hand=='right'?-0.18:0.18, y:0.1, z:-0.05});
      this.menuEl.setAttribute('rotation',{x:-20, y:0, z:0});
      this.menu = this.menuEl.components['hand-menu'];
      this.superHands = this.el.components['super-hands'];
      this.el.appendChild(this.menuEl);
      this.el.addEventListener('thumbstickmoved',this.thumbstickHandler);
      this.el.addEventListener("thumbstickdown",this.toggleMenu);
      this.el.addEventListener('pointingstart',this.createIndexFinger);
      this.el.addEventListener('pointingend',this.destroyIndexFinger);
      this.el.addEventListener(this.data.hand=='right'?'bbuttondown':'ybuttondown',this.buttonHelpDown);
      this.el.addEventListener(this.data.hand=='right'?'bbuttonup':'ybuttonup',this.buttonHelpUp);
    },
    toggleMenu: function(){
      if(this.menu.isOpen){
        this.menu.close();
      }else{
        this.menu.open();
      }
    },
    toggleHelp: function(){
      this.help.object3D.visible = !this.help.object3D.visible;
    },
    buttonHelpDown: function(){
      this.el.addState('togglingHelp');
      if(this.oppositeHand.is('togglingHelp')){
        this.toggleHelp();
        this.oppositeHand.components['custom-hand'].toggleHelp();
      }
    },
    buttonHelpUp: function(){
      this.el.removeState('togglingHelp');
    },
    thumbstickHandler(evt){
      let movementAllowed = !this.movingThumbstick && this.menu && this.menu.isOpen;
      let thumbstickDisplacedEnough = Math.abs(evt.detail.x) > 0.95 || Math.abs(evt.detail.y) > 0.95;
      if( movementAllowed && thumbstickDisplacedEnough){
        if(evt.detail.y < -0.95){
          this.menu.decreaseCategory();
        }else if(evt.detail.y > 0.95){
          this.menu.increaseCategory();
        }else if(evt.detail.x < -0.95){
          this.menu.decreaseFirstItem();
        }else{
          this.menu.increaseFirstItem();
        }
        this.movingThumbstick = true;
        //Update finger collider
        if(this.indexFinger) this.indexFinger.components['obb-collider'].update();
      }else if(!thumbstickDisplacedEnough){
        this.movingThumbstick = false;
      }
    },
    createIndexFinger: function (params) {
      if((this.menu && this.menu.isOpen) || this.superHands.state.has('grab-start')) return;
      this.indexFinger = document.createElement('a-entity');
      this.indexFinger.setAttribute('class','finger');
      if(this.useAmmo){
        this.indexFinger.setAttribute("ammo-body",{type:'kinematic'});
        this.indexFinger.setAttribute("ammo-shape",{type:'sphere', fit:'manual', sphereRadius:0.005});
      }
      this.indexFinger.setAttribute("obb-collider",{objects:this.data.colliderSelector,radius:0.005});
      this.indexFinger.setAttribute('geometry',{primitive:'plane',height:0.001,width:0.001})
      if(this.data.hand == 'right'){
        this.indexFinger.setAttribute('position',{x:0.025, y:0.04, z:-0.09});
      }else if(this.data.hand == 'left'){
        this.indexFinger.setAttribute('position',{x:-0.025, y:0.04, z:-0.09});
      }
      this.el.appendChild(this.indexFinger);
    },
    destroyIndexFinger: function (params) {
      if(!this.indexFinger) return;
      this.indexFinger.remove();
      this.indexFinger = null;
    },
  });