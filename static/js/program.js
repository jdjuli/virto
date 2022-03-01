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
        this.previewInstruction = this.previewInstruction.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addInstruction = this.addInstruction.bind(this);

        this.el.setAttribute('geometry','primitive:box; height:0.1; width:2; depth:1');
        this.el.setAttribute('material','color:gray');

        this.controlEl = document.createElement('a-entity');
        this.controlEl.setAttribute('class','collidable');
        this.controlEl.setAttribute('geometry',{primitive:'box',height:0.6,width:0.3,depth:0.3});
        this.controlEl.setAttribute('material','color','cyan');
        this.controlEl.setAttribute('position',{x:-0.7,y:0.35,z:-0.1})
        this.controlEl.setAttribute('droppable','');
        this.controlEl.addEventListener('dragover-start',this.previewInstruction);
        this.controlEl.addEventListener('dragover-end',this.endPreview);
        this.controlEl.addEventListener('drag-drop',this.addInstruction);
        this.btnRunEl = document.createElement('a-entity');
        this.btnRunEl.setAttribute('class','collidable');
        this.btnRunEl.setAttribute('geometry',{primitive:'box',height:0.075,width:0.15,depth:0.05});
        this.btnRunEl.setAttribute('position',{x:0,y:0.2,z:0.15});
        this.btnRunEl.setAttribute('material','color','green');
        this.btnRunEl.setAttribute('text',{align:'center',value:'RUN',width:1,zOffset:0.031});
        this.btnRunEl.addEventListener('click',this.runButtonClick);
        this.btnRunEl.addEventListener('hitend',this.runButtonClick);
        this.btnRunEl.addEventListener('dragover-start',(evt)=>evt.stopPropagation());
        this.btnRunEl.addEventListener('dragover-end',(evt)=>evt.stopPropagation());
        this.btnRunEl.addEventListener('drag-drop',(evt)=>evt.stopPropagation());
        this.btnResetEl = document.createElement('a-entity');
        this.btnResetEl.setAttribute('class','collidable');
        this.btnResetEl.setAttribute('geometry',{primitive:'box',height:0.075,width:0.15,depth:0.05});
        this.btnResetEl.setAttribute('position',{x:0,y:0.1,z:0.15});
        this.btnResetEl.setAttribute('material','color','green');
        this.btnResetEl.setAttribute('text',{align:'center',value:'RESET',width:1,zOffset:0.031});
        this.btnResetEl.addEventListener('click',this.resetButtonClick);
        this.btnResetEl.addEventListener('hitend',this.resetButtonClick);
        this.btnResetEl.addEventListener('dragover-start',(evt)=>evt.stopPropagation());
        this.btnResetEl.addEventListener('dragover-end',(evt)=>evt.stopPropagation());
        this.btnResetEl.addEventListener('drag-drop',(evt)=>evt.stopPropagation());

        this.recyclebin = document.createElement('a-entity');
        this.recyclebin.setAttribute('recyclebin','');
        this.recyclebin.setAttribute('position',{x:0.9, y:0.105, z:0.4});
        
        this.controlEl.appendChild(this.btnRunEl);
        this.controlEl.appendChild(this.btnResetEl);
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
            console.log('START program: '+this.data.name+" parentProgram:");
            console.log(parentProgram);
            this.codeEl.components['code'].exec(this.el, findVariable);
            console.log('END program: '+this.data.name);
        }
    },
    previewInstruction: function(evt){
        let carried = evt.detail.carried;
        let component = carried.components['instruction'];
        if(component && !this.codeEl.components['code'].previewInstruction){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('obj-model',{obj:'#instruction'});
            preview.setAttribute('position',{x:0.25, y:0, z:0});
            preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.controlEl.appendChild(preview);
            this.codeEl.getAttribute('position').x+=0.2;
            this.codeEl.components['code'].previewInstruction = true;
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.codeEl.components['code'].previewInstruction){
            let preview = this.controlEl.querySelector('.preview');
            if(preview) preview.remove();
            this.codeEl.getAttribute('position').x-=0.2;
            this.codeEl.components['code'].previewInstruction = false;
        }
        evt.stopPropagation();
    },
    addInstruction: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.parameter) return;
        let component = target.components['instruction'];
        if(component){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('instruction',component.data);
            this.codeEl.insertBefore(newEntity, this.codeEl.firstElementChild);
            target.remove();
        }
        evt.stopPropagation();
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