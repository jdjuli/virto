/*
 *   NOTE: to create unique random variable names, the expression: Date.now().toString(36) generate good results
 */
AFRAME.registerComponent('value',{
    schema: {
        variable:{type:'string'},
        value:{type:'number',default:0.0},
        display:{type:'string',default:'VALUE', oneOf:['NAME','VALUE']}
    },
    init: function(){  
        this.state = this.el.sceneEl.systems.state
        this.keysToWatch = ['variables'];
        this.attached = this.el.parentEl && this.el.parentEl.components['instruction'];
        this.ide = document.querySelector('[ide]');
        this.collisionHandler = this.collisionHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#cylinderZ'});
        this.el.setAttribute('material',{color:'cyan'});
        this.el.setAttribute('text',{value:'#REF!',width:1,zOffset:0.051,align:'center'});

        if(!this.attached){
            this.el.setAttribute('grabbable','');
            this.el.setAttribute('draggable','');
        }else{
            this.el.addEventListener('collidestart',this.collisionHandler);
        }

        if(this.data.variable){
            if(!this.state.state.variables.hasOwnProperty(this.data.variable)){
                this.el.sceneEl.emit('createVariable',{name:this.data.variable,value:this.data.value});
            }
            
            this.state.subscribe(this);
            this.onStateUpdate = this.onStateUpdate.bind(this);
        }        
    },
    update: function(oldData) {
        if(this.data.variable){
            this.onStateUpdate();
        }else{
            if(this.data.display == 'NAME'){
                this.el.setAttribute('text','value','#');
            }else{
                this.el.setAttribute('text','value',this.data.value.toFixed(1));
            }
        }
    },
    collisionHandler: function(evt) {
        let targetEl = evt.detail.targetEl;
        if(targetEl.classList.contains('finger')){
            if(this.data.variable){//If it's a variable, preserve it reparented to the IDE
                let newPosition = this.el.getAttribute('position');
                newPosition.add(new THREE.Vector3(0,0,0.2));
                let parentToWorld = this.el.parentEl.object3D.localToWorld.bind(this.el.parentEl.object3D);
                let worldToIDE = this.ide.object3D.worldToLocal.bind(this.ide.object3D);
                newPosition = worldToIDE(parentToWorld(newPosition));
                let newEntity = document.createElement('a-entity');
                newEntity.setAttribute(this.attrName,this.data);
                newEntity.setAttribute('position',newPosition);
                this.ide.appendChild(newEntity);
            }
            this.el.remove();
            if(this.attached){
                this.attached.removeAmount();
            }
        }
        evt.stopPropagation();
    },
    onStateUpdate: function () {
        if(this.state.state.variables.hasOwnProperty(this.data.variable)){
            this.data.value = this.state.state.variables[this.data.variable];
            if(this.data.display == 'NAME'){
                this.el.setAttribute('text','value',this.data.variable);
            }else{
                this.el.setAttribute('text','value',this.data.value.toFixed(1));
            }
            
        }
    },
    getValue(){
        return this.data.value;
    }
});
