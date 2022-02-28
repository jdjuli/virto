AFRAME.registerComponent('hand-menu',{
    schema: {
      width: {type:"float", default: 0.3},
      height: {type:"float", default: 0.13},
      cols: {type:"int", default: 3},
      contents: {parse: function(input){
                  return JSON.parse(input.replaceAll('\'','\"'));
                },
                stringify: JSON.stringify},
      target: {type:'selector', default:'[ide]'}
    },
    init: function(){
      this.category = 0;
      this.firstItem = 0;
      this.isOpen = false;
      this.text = document.createElement('a-entity');
      this.ide = document.querySelector('[ide]');
      this.buttons = [];
      this.buttonHandlers = [];
      
      this.el.setAttribute('geometry',{primitive:'box',height:this.data.height,width:this.data.width,depth:0.02});
      this.el.setAttribute('material',{color:'gray'});
      this.text.setAttribute('position',{x:0,y:0.05,z:0.011});
      this.el.appendChild(this.text);
      this.el.setAttribute('visible',false)
    },
    updateContents(){
      //Update the title of the menu
      this.text.setAttribute('text',{value:this.data.contents[this.category].name, align:'center', width:0.75});
      //Calculate the new number of buttons
      this.numButtons = Math.min(this.data.cols,this.data.contents[this.category].items.length);
      if(this.numButtons != this.buttons.length) this.createButtons(this.numButtons);
      //Create each button, attach it to the menu and set the event listener
      for(let i = 0 ; i < this.numButtons ; i++){
        let button = this.buttons[i];
        let text = this.data.contents[this.category].items[this.firstItem+i].text;
        button.setAttribute('material',{src:this.data.contents[this.category].items[this.firstItem+i].textureAsset});
        if(text){
          button.setAttribute('text',{value:text,width:1,zOffset:0.051,align:'center'});
        }else{
          button.removeAttribute('text');
        }
      }
    },
    createButtons(){
      while(this.buttons.length > 0){
        let button = this.buttons.pop();
        button.removeEventListener('collidestart',this.buttonHandlers.pop());
        button.remove();
      }
      //Calculate the size and position of the new buttons
      let calculatedButtonHeight = this.data.height*0.6;
      let calculatedButtonWidth = this.data.width*0.8/(this.numButtons+1);
      let buttonDimension = Math.min(calculatedButtonHeight,calculatedButtonWidth);
      let buttonSpacing = buttonDimension+(this.data.width-buttonDimension*this.numButtons)/(this.numButtons+1);
      let baseX = (-(this.numButtons-1)/2)*buttonSpacing;
      for(let i = 0 ; i < this.numButtons ; i++){
        let button = document.createElement('a-entity');
        button.setAttribute('obj-model',{obj:'#box'});
        button.setAttribute('scale',{x:buttonDimension*10, y:buttonDimension*10, z:0.25});
        button.setAttribute('position',{x:baseX+buttonSpacing*i, y:-0.01, z:0.005});
        button.setAttribute('class','collidable');
        let handler = this.buttonPressed.bind(this,i);
        button.addEventListener('collidestart',handler);
        this.el.appendChild(button);
        this.buttons.push(button);
        this.buttonHandlers.push(handler);
      }
    },
    open: function(){
      this.el.setAttribute('visible', true);
      this.updateContents();
      
      this.isOpen = true;
    },
    close: function(){
      this.el.setAttribute('visible', false);
      this.isOpen = false;
    },
    increaseCategory: function(){
      if(this.category < this.data.contents.length-1){
        this.category++;
        this.firstItem = 0;
        this.updateContents();
      }
    },
    decreaseCategory: function(){
      if(this.category > 0){
        this.category--;
        this.firstItem = 0;
        this.updateContents();
      }
    },
    increaseFirstItem: function(){
      if(this.firstItem < this.data.contents[this.category].items.length-this.numButtons){
        this.firstItem++;
        this.updateContents();
      }
    },
    decreaseFirstItem: function(){
      if(this.firstItem > 0){
        this.firstItem--;
        this.updateContents();
      }
    },
    buttonPressed: function(btnNum, evt){
      if(!this.isOpen) return;

      let selected = document.createElement('a-entity');
      let componentName = this.data.contents[this.category].component;
      let componentArg = this.data.contents[this.category].items[this.firstItem+btnNum].data;
      selected.setAttribute(componentName,componentArg);
      
      if(componentName != 'variable'){
        let position = this.el.object3D.position.clone();
        position.add(new THREE.Vector3(0,0.15,-0.1));
        position = this.ide.object3D.worldToLocal(this.el.object3D.localToWorld(position));
        selected.setAttribute('position',position);
        this.ide.appendChild(selected);
      }else{
        scope = this.ide.querySelectorAll('[program] [scope]')[0]
        scope.appendChild(selected)
      }
    }
  });