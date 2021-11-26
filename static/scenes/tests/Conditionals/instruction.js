AFRAME.registerComponent('instruction',{
    schema: {
        type:{type:'string',default:'up'},
        preview:{type:'boolean',default:false}
    },
    init: function(){   
        this.height = 0.1;    
        this.container = this.findContainer();
    },
    findContainer: function (params) {
        let parent = this.el.parentNode;
        if(parent == null) return undefined;
        while(parent.components && !(parent.components['program'] || parent.components['condition'])){
            parent = parent.parentNode;
        }
        if(parent.components){
            return parent.components['program'] || parent.components['condition'];
        }
    },
    update: function(oldData){
        this.el.setAttribute('geometry',{primitive:'box',height:this.height,width:0.1,depth:0.1});
        this.el.setAttribute('text',{value:this.data.type, zOffset:0.06, align:'center', width:0.5});

        if(this.data.preview){
            this.el.setAttribute('material',{color:'cyan',opacity:0.5});
        }else{
            this.el.setAttribute('material','color:green');
            this.el.setAttribute('class','collidable');
            
            this.el.setAttribute('grabbable',{suppressY:this.container?true:false, constraintComponentName:'ammo-constraint'});
            this.el.addEventListener('grab-start',this.scaleDown.bind(this));
            this.el.addEventListener('grab-end',this.scaleUp.bind(this));
            
            if(this.container){
                this.el.setAttribute('droppable','');
                this.el.addEventListener('drag-drop',this.addInstruction.bind(this));
                this.el.addEventListener('dragover-start',this.startPreview.bind(this));
                this.el.addEventListener('dragover-end',this.endPreview.bind(this));
            }else{
                this.el.setAttribute('draggable','');
                this.el.setAttribute('ammo-body',{type:'dynamic',linearDamping:1,angularDamping:1,gravity:{x:0,y:0,z:0},emitCollisionEvents:true});
                this.el.setAttribute('ammo-shape',{type:'box'});
            }
        }
    },
    remove: function() {
        this.el.removeEventListener('grab-start', this.scaleDown.bind(this));
        this.el.removeEventListener('grab-end', this.scaleUp.bind(this));
        this.el.removeEventListener('drag-drop', this.addInstruction.bind(this));
        this.el.removeEventListener('dragover-start', this.startPreview.bind(this));
        this.el.removeEventListener('dragover-end', this.endPreview.bind(this));
    },
    displace: function(offset){
        this.el.getAttribute('position').add(offset);
    },
    scaleUp: function(evt) {
        this.el.removeAttribute('scale');
        evt.stopPropagation();
    },
    scaleDown: function(evt) {
        this.el.setAttribute('scale','0.5 0.5 0.5');
        evt.stopPropagation();
    },
    startPreview: function(evt){
        if(this.container){
             this.container.startPreview.bind(this.container)(evt, this.el);
        }
        if(evt) evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.container){
            this.container.endPreview.bind(this.container)();
        }
        if(evt) evt.stopPropagation();
    },
    addInstruction: function(evt) {
        let target = evt.detail.dropped;
        if(this.container && (target.components['instruction'] || target.components['condition']) ){
            this.endPreview();
            this.container.addInstruction.bind(this.container)(target, this.el);
        }
    },
    tick: function() {
        if(this.container){
            let position = this.el.object3D.position;
            if(Math.sqrt(position.x*position.x + position.z*position.z) > 0.1){
                let superHand = this.el.components['grabbable'].grabber.components['super-hands'];
                let instructionRemoved = this.container.removeInstruction.bind(this.container)(this.el,true);
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