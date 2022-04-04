AFRAME.registerComponent('reference',{
    schema: {
        variable:{type:'string'},
    },
    init: function(){  
        let parentEl = this.el.parentEl;
        this.attached = parentEl && (parentEl.components['instruction'] || parentEl.components['instruction-conditional']);
        this.program = this.el.closest('[program]');
        this.variable = this.program.querySelector(this.data.variable);
        this.initialPosition = null;
        this.grabEndHandler = this.grabEndHandler.bind(this);
        this.update = this.update.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#cylinderZ'});
        this.el.setAttribute('material',{color:'cyan'});

        this.el.icon = document.createElement('a-entity');
        this.el.icon.setAttribute('geometry',{primitive:'circle',radius:0.04});
        
        this.el.icon.setAttribute('position',{x:0,y:0,z:0.051});

        this.el.appendChild(this.el.icon);

        this.el.setAttribute('grabbable','');
        if(this.attached){   
            this.currentPosition = this.el.getAttribute('position');
            this.initialPosition = this.currentPosition.clone();
            this.el.addEventListener('grab-end',this.grabEndHandler);
        }else{
            this.el.setAttribute('draggable','');
        }

        this.el.clone = ()=>{
            let clone = document.createElement('a-entity');
            clone.setAttribute('reference',this.data);
            return clone;
        }
    },
    update: function(){
        this.variableComponent = this.variable.components.variable;
        this.variableComponent.getIconSelector().then((icon)=>{
            this.el.icon.setAttribute('material',{src:icon,transparent:'true'});
        });
    },
    remove: function(){
        if(this.el.is('grabbed')){
            let grabber = this.el.components.grabbable.grabber;
            grabber.components['super-hands'].state.forEach((v,k)=>{
                if(!v.attached) grabber.components['super-hands'].state.delete(k);
            });
        }
    },
    get: function(){
        return this.variableComponent.get();
    },
    set: function(value){
        return this.variableComponent.set.bind(this.variableComponent)(value);
    },
    grabEndHandler: function(evt){
        this.el.getAttribute('position').copy(this.initialPosition);
    },
    tick: function(){
        if(this.attached && this.initialPosition.distanceTo(this.currentPosition) > 0.3){
            reference = this.el.clone();
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            reference.setAttribute('position',position);
            setTimeout(()=>{this.program.appendChild(reference);},10);
            this.el.remove();
        }
    }
});
