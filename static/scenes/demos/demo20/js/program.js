AFRAME.registerComponent('program',{
    schema: {
        name:{type:'string'},
    },
    init: function(){       
        childEls = this.el.getChildEntities();
        this.previewActive = false;
        this.exec = this.exec().bind(this);
        this.runButtonClick = this.runButtonClick.bind(this)();
        this.resetButtonClick = this.resetButtonClick.bind(this)();

        this.el.setAttribute('geometry','primitive:box; height:0.1; width:2; depth:1');
        this.el.setAttribute('material','color:#79a8ad');

        this.controlEl = document.createElement('a-entity');
        this.controlEl.setAttribute('program-controls','');
        this.controlEl.setAttribute('position',{x:-0.7,y:0.35,z:-0.1});

        this.recyclebin = document.createElement('a-entity');
        this.recyclebin.setAttribute('recyclebin','');
        this.recyclebin.setAttribute('position',{x:0.9, y:0.105, z:0.4});
        
        this.el.addEventListener('run',this.runButtonClick);
        this.el.addEventListener('reset',this.resetButtonClick);

        this.el.appendChild(this.controlEl);
        this.el.appendChild(this.recyclebin);
    },
    update: function(){
        this.scopeEl = childEls.find((e)=>e.components['scope']);
        if(!this.scopeEl){
            this.scopeEl = document.createElement('a-entity');
            this.scopeEl.setAttribute('scope','');
            this.el.appendChild(this.scopeEl);
        }
        this.scopeEl.setAttribute('position',{x:0,y:0.1,z:0.3})

        this.codeEl = childEls.find((e)=>e.components['code']);
        if(!this.codeEl){
            this.codeEl = document.createElement('a-entity');
            this.codeEl.setAttribute('code','');
            this.el.appendChild(this.codeEl);
        }
        this.codeEl.setAttribute('position',{x:-0.45,y:0.35,z:-0.1});
    },
    exec: function(){
        return (parentProgram, parentFindVariable=null)=>{
            findVariable = ((selector)=>{
                try{
                    return this.scopeEl.querySelector(selector).components.variable;
                }catch(e){
                    console.log(e);
                    if(parentFindVariable){
                        return parentFindVariable(selector);
                    }else{
                        return null;
                    }  
                }
            }).bind(this);
            this.codeEl.components['code'].exec(this.el, findVariable);
        }
    },
    //As click event is fired twice each time, I had to check currentTime to ensure that is called once
    runButtonClick: function(){
        let lastRun;
        let now;
        return ()=>{
            now = Date.now()>>9; //Integer division by 2^9 (512)
            if(lastRun != now) this.exec();
            lastRun = now;
        }
    },
    resetButtonClick: function(){
        let lastRun;
        let now;
        return ()=>{
            now = Date.now()>>9; //Integer division by 2^9 (512)
            if(lastRun != now){
                this.el.sceneEl.querySelector('[drone]').components['drone'].resetPosition();
            }
            lastRun = now;
        }
    },
  });