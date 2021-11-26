AFRAME.registerComponent('instruction',{
    schema: {
        type:{type:'string',default:'up'},
        preview:{type:'boolean',default:false}
    },
    init: function(){       
        this.program = this.el.parentNode.components['program'];
        this.el.setAttribute('obj-model',{obj:'instruction.obj'});
        
        this.el.setAttribute('material',{src:'textures/'+this.data.type+'.png'});
        if(this.data.preview){
            this.el.setAttribute('model-opacity',0.5);
        }else{
            this.el.setAttribute('class','collidable');
            this.el.setAttribute('grabbable',{suppressY:this.program?true:false, constraintComponentName:'ammo-constraint'});
            this.el.addEventListener('grab-start',(e)=>this.el.setAttribute('scale','0.5 0.5 0.5'));
            this.el.addEventListener('grab-end',(e)=>this.el.removeAttribute('scale'));
            
            if(this.program){
                this.el.setAttribute('droppable','');
                this.el.addEventListener('drag-drop',this.addInstruction.bind(this));
                this.el.addEventListener('dragover-start',this.startPreview.bind(this));
                this.el.addEventListener('dragover-end',this.endPreview.bind(this));
            }else{
                this.el.setAttribute('draggable','');
                this.el.addEventListener('model-loaded',(evt)=>{
                    this.el.setAttribute('ammo-body',{type:'dynamic',linearDamping:1,angularDamping:1,gravity:{x:0,y:0,z:0},emitCollisionEvents:true});
                    this.el.setAttribute('ammo-shape',{type:'box'});
                });
            }
        }
        
    },
    update: function(oldData){

    },
    displace: function(offset){
        this.el.getAttribute('position').add(offset);
    },
    startPreview: function(evt){
        if(this.program){
             this.program.startPreview.bind(this.program)(evt, this.el);
        }
        if(evt) evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.program){
            this.program.endPreview.bind(this.program)();
        }
        if(evt) evt.stopPropagation();
    },
    addInstruction: function(evt) {
        let target = evt.detail.dropped;
        if(this.program && target.components['instruction']){
            this.endPreview();
            this.program.addInstruction.bind(this.program)(target, this.el);
        }
    },
    tick: function() {
        if(this.program){
            let position = this.el.object3D.position;
            if(Math.sqrt(position.x*position.x + position.z*position.z) > 0.1){
                //This condition solves a very uncommon and difficult to reproduce bug
                if(!this.el.components['grabbable'] || !this.el.components['grabbable'].grabber){
                    return;
                }
                let superHand = this.el.components['grabbable'].grabber.components['super-hands'];
                let instructionRemoved = this.program.removeInstruction.bind(this.program)(this.el,true);
                let constraintId = Math.random().toString(36).substr(2, 9);
                //Ensure that grabbable component is initialized
                instructionRemoved.components['instruction'].initComponent();
                instructionRemoved.components['grabbable'].initComponent();
                instructionRemoved.setAttribute('ammo-constraint__'+constraintId, {type:'lock', target:superHand.el});
                instructionRemoved.addState('grabbed');
                superHand.state.set(superHand.GRAB_EVENT,instructionRemoved);
                instructionRemoved.components.grabbable.constraints.set(superHand.el,constraintId);
                instructionRemoved.addState('dragged');
                superHand.state.set(superHand.DRAG_EVENT,instructionRemoved);
                instructionRemoved.setAttribute('scale','0.5 0.5 0.5');
            }
        }
    },
    run: function(drone) {
        let droneComponent = drone.components['drone'];
        droneComponent[this.data.type].bind(droneComponent)();
    }
  });