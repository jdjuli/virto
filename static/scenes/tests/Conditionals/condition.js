AFRAME.registerComponent('condition',{
    schema: {
        preview:{type:'boolean',default:false},
        open:{type:'boolean',default:true},
        branchTrue:{parse:function(value) {
            if(!Array.isArray(value)){
                return JSON.parse(value);
            }else{
                return value;
            }
        }},
        branchFalse:{parse:function(value) {
            if(!Array.isArray(value)){
                return JSON.parse(value);
            }else{
                return value;
            }
        }}
    },
    init: function(){       
        this.height = 0.15;
        this.container = this.findContainer();
        this.preview = null;
        this.ide = this.findIde();
        this.data.open = this.container != undefined;
        
        
        this.conditionEnd = document.createElement('a-entity');

        this.el.addEventListener('model-loaded',()=>{
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
                    this.el.setAttribute('ammo-shape',{type:'box',offset:{x:0,y:0.025,z:0}});
                }
            }
            this.el.appendChild(this.conditionEnd);
            this.conditionEnd.addEventListener('model-loaded',(evt)=>{
                this.updateConditionEndPosition();
                evt.stopPropagation();
            });
            this.conditionEnd.setAttribute('gltf-model','conditionEnd.gltf');
        });
        this.el.setAttribute('gltf-model','condition.gltf');
    },
    update: function(oldData){
        if(oldData && !oldData.open && this.data.open){
            this.open();
        }
        if(this.data.open){
            this.data.branchTrue = [];
            for(let c of this.branchTrue.children){
                let itype;
                if(c.components['instruction']){
                    itype = 'instruction';
                }else if(c.components['condition']){
                    itype = 'condition';
                }
                let idata = c.components[itype].data || c.components[itype].attrValue;
                this.data.branchTrue.push({itype:itype,idata:idata});
            }
            this.data.branchFalse = [];
            for(let c of this.branchFalse.children){
                let itype;
                if(c.components['instruction']){
                    itype = 'instruction';
                }else if(c.components['condition']){
                    itype = 'condition';
                }
                let idata = c.components[itype].data || c.components[itype].attrValue;
                this.data.branchFalse.push({itype:itype,idata:idata});
            }
        }
        
    },
    open: function() {
        this.branchTrue = document.createElement('a-entity');
        this.branchFalse = document.createElement('a-entity');
        this.branchTrue.setAttribute('position',{x:0.075,y:0.15,z:0});
        this.el.appendChild(this.branchTrue);
        this.branchFalse.setAttribute('position',{x:-0.075,y:0.15,z:0});
        this.el.appendChild(this.branchFalse);
        
        for(let i of this.data.branchTrue){
            let entity = document.createElement('a-entity');
            entity.setAttribute(i.itype,i.idata);
            entity.components[i.itype].initComponent();
            this.addInstruction(entity,this.branchTrue);
            
        }
        
        for(let i of this.data.branchFalse){
            let entity = document.createElement('a-entity');
            entity.setAttribute(i.itype,i.idata);
            entity.components[i.itype].initComponent();
            this.addInstruction(entity,this.branchFalse);
            
        }

        this.updateConditionEndPosition();
    },
    findContainer: function (params) {
        let parent = this.el.parentNode;
        while(parent.components && !(parent.components['program'] || parent.components['condition'])){
            parent = parent.parentNode;
        }
        if(parent.components){
            return parent.components['program'] || parent.components['condition'];
        }
    },
    findIde: function (params) {
        let ide = this.el.parentNode;
        while(ide.components && !ide.attributes.getNamedItem('ide')){
            ide = ide.parentNode;
        }
        return ide;
    },
    remove: function() {
        this.el.removeEventListener('grab-start', this.scaleDown.bind(this));
        this.el.removeEventListener('grab-end', this.scaleUp.bind(this));
        this.el.removeEventListener('drag-drop', this.dragDrop.bind(this));
        this.el.removeEventListener('dragover-start', this.startPreview.bind(this));
        this.el.removeEventListener('dragover-end', this.endPreview.bind(this));
    },
    displace: function(offset){
        this.el.getAttribute('position').add(offset);
    },
    updateConditionEndPosition: function() {
        let positionTrue = new THREE.Vector3(0,0.15,0);
        let positionFalse = new THREE.Vector3(0,0.15,0);
        if(this.data.open){
            for(let e of this.branchTrue.children){
                let component = e.components['instruction'] || e.components['condition'];
                if(!component.initialized) component.initComponent();
                positionTrue.y += component.height + 0.001;
            }
            for(let e of this.branchFalse.children){
                let component = e.components['instruction'] || e.components['condition'];
                if(!component.initialized) component.initComponent();
                positionFalse.y += component.height + 0.001;
            }
        }   
        this.conditionEnd.setAttribute('position',{x:0, y:Math.max(positionFalse.y,positionTrue.y), z:0});
    },
    scaleUp: function(evt) {
        this.el.removeAttribute('scale');
        evt.stopPropagation();
    },
    scaleDown: function(evt) {
        this.el.setAttribute('scale','0.5 0.5 0.5');
        evt.stopPropagation();
    },
    distance(pos1, pos2){
        return(Math.sqrt(Math.pow(pos1.x-pos2.x,2) + Math.pow(pos1.y-pos2.y,2) + Math.pow(pos1.z-pos2.z,2)));
    },
    startPreview: function(evt, where=null){
        if(!this.el.attached) return;
        if(!this.preview && this.data.open){
            let carried = evt.detail.carried;
            this.preview = this.addInstruction(carried,where,true);
        }
        if(evt) evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.preview){
            this.removeInstruction(this.preview);
            this.preview = null;
        }
        if(evt) evt.stopPropagation();
    },
    dragDrop: function(evt) {
        let target = evt.detail.dropped;
        if(target.components['instruction'] || target.components['condition']){
            this.addInstruction(target);
        }
        evt.stopPropagation();
    },
    addInstruction: function(instruction, where, preview = false) {
        if(!instruction.parentNode) return;
        let newEntity = document.createElement('a-entity');
        let originalComponent = instruction.components['instruction'] || instruction.components['condition'];
        let position = new THREE.Vector3(0, 0.0, 0);
        let offset = new THREE.Vector3(0, originalComponent.height+0.001, 0);
        let componentAttr = Object.assign({},originalComponent.data);
        componentAttr.preview = preview;
        newEntity.setAttribute(originalComponent.attrName,componentAttr);
        //Calculate nearest branch
        let positionTrue = this.branchTrue.object3D.position;
        let positionFalse = this.branchFalse.object3D.position;
        let positionEntity = instruction.object3D.position;
        let parent;

        if(this.distance(positionEntity, positionTrue) < this.distance(positionEntity,positionFalse)){
            parent = this.branchTrue;
        }else{
            parent = this.branchFalse;
        }

        if(!where){
            parent.insertBefore(newEntity,parent.firstElementChild);
        }else{
            position.copy(where.getAttribute('position'));
            componentWhere = where.components['instruction'] || where.components['condition'];
            position.y += componentWhere.height;
            parent.insertBefore(newEntity,where.nextElementSibling);
        }
        newEntity.setAttribute('position',position);

        let moving_instruction = newEntity.nextElementSibling;
        while(moving_instruction){
            let component = moving_instruction.components['instruction'] || moving_instruction.components['condition'];
            component.displace(offset);
            moving_instruction = moving_instruction.nextElementSibling;
        }
        if(!preview){
            instruction.remove();
            this.update();
        }
        this.updateConditionEndPosition();
        return newEntity;
    },
    removeInstruction: function(instruction, reparent=false) {
        let worldToIDE = this.ide.object3D.matrixWorld.clone();
        let worldToLocal = instruction.parentNode.object3D.matrixWorld.clone();
        this.localToIDE = worldToLocal.multiply(worldToIDE.invert());

        let moving_instruction = instruction.nextElementSibling;
        let old_component = instruction.components['instruction'] || instruction.components['condition'];
        let offset = new THREE.Vector3(0, -old_component.height-0.001, 0);
        let new_instruction = undefined;
        instruction.remove();
        if(reparent){
            new_instruction = document.createElement('a-entity');
            position = instruction.getAttribute('position');
            new_instruction.setAttribute('position',this.localToIDE.multiplyVector3(position));
            let old_component = instruction.components['instruction'] || instruction.components['condition'];
            new_instruction.setAttribute(old_component.attrName,old_component.data);
            this.ide.appendChild(new_instruction);
        }
        while(moving_instruction){
            let component = moving_instruction.components['instruction'] || moving_instruction.components['condition'];
            component.displace(offset);
            moving_instruction = moving_instruction.nextElementSibling;
        }
        this.update();
        this.updateConditionEndPosition();
        return new_instruction;
    },
    tick: function() {
        if(this.container && this.el.is('grabbed')){
            let position = this.el.object3D.position;
            if(Math.sqrt(position.x*position.x + position.z*position.z) > 0.1){
                let superHand = this.el.components['grabbable'].grabber.components['super-hands'];
                let instructionRemoved = this.container.removeInstruction.bind(this.container)(this.el,true);
                let constraintId = Math.random().toString(36).substr(2, 9);
                //Ensure that condition component is initialized
                instructionRemoved.components['condition'].attrValue.open = false;
                instructionRemoved.components['condition'].initComponent();
                instructionRemoved.addEventListener('model-loaded',()=>{
                    instructionRemoved.components['grabbable'].initComponent();
                    instructionRemoved.setAttribute('ammo-constraint__'+constraintId, {type:'lock', target:superHand.el});
                    instructionRemoved.addState('grabbed');
                    superHand.state.set(superHand.GRAB_EVENT,instructionRemoved);
                    instructionRemoved.components.grabbable.constraints.set(superHand.el,constraintId);
                    instructionRemoved.addState('dragged');
                    superHand.state.set(superHand.DRAG_EVENT,instructionRemoved);
                    instructionRemoved.setAttribute('scale','0.5 0.5 0.5');
                });
            }
        }
    },
    run: function(drone) {
        let droneComponent = drone.components['drone'];
        droneComponent[this.data.type].bind(droneComponent)();
    }
  });