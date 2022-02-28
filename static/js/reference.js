/*
 *   NOTE: to create unique random variable names, the expression: Date.now().toString(36) generate good results
 */
AFRAME.registerComponent('reference',{
    schema: {
        variable:{type:'string'},
    },
    init: function(){  
        this.attached = this.el.parentEl && this.el.parentEl.components['instruction'];
        this.program = this.el.closest('[program]');
        this.variable = this.program.querySelector(this.data.variable);
        this.variableComponent = this.variable.components.variable;
        this.initialPosition = null;
        this.grabEndHandler = this.grabEndHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#cylinderZ'});
        this.el.setAttribute('material',{color:'cyan'});

        this.el.icon = document.createElement('a-entity');
        this.el.icon.setAttribute('geometry',{primitive:'circle',radius:0.04});
        this.el.icon.setAttribute('material',{src:this.variableComponent.getIconSelector(),transparent:'true'});
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
            reference = document.createElement('a-entity');
            reference = document.createElement('a-entity');
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            reference.setAttribute('reference',{variable:this.data.variable});
            reference.setAttribute('position',position);
            setTimeout(()=>{this.program.appendChild(reference);},10);
            //this.attached.removeReference();
            this.el.remove();
        }
    }
});
