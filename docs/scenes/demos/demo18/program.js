AFRAME.registerComponent('program',{
    schema: {
        active:{type:'boolean',default:false},
        instructions:{type:'array',default:['init']}
    },
    init: function(){       
        if(this.data.active) this.open();   
        this.el.addEventListener('run',this.run.bind(this));     
        this.el.setAttribute('class','collidable');
    },
    update: function(oldData) {
        this.data.instructions = [];
        for(let c of this.el.children){
            this.data.instructions.push(c.components['instruction'].attrValue.type);
        }
        this.attrValue = this.data;
        this.flushToDOM();

        let worldToIDE = this.el.parentEl.object3D.matrixWorld.clone();
        let worldToProgam = this.el.object3D.matrixWorld.clone();
        this.programToIDE = worldToProgam.multiply(worldToIDE.invert());
    },
    open: function(){
        const el = this.el;
        
        el.setAttribute('geometry','primitive: box; width: 0.3; height: 0.02; depth: 0.3');
        el.setAttribute('material',{src:'textures/MetalPlates007_1K_Color.png'});
        el.setAttribute('droppable','');
        
        el.addEventListener('dragover-start',this.startPreview.bind(this));
        el.addEventListener('dragover-end',this.endPreview.bind(this));
        el.addEventListener('drag-drop',this.dragDrop.bind(this));
        
        let height = 0.061;
        if(this.data.instructions.length > 0){
            for(i of this.data.instructions){
                let new_instruction = document.createElement('a-entity');
                el.appendChild(new_instruction);
                new_instruction.setAttribute('instruction',{type:i});
                new_instruction.setAttribute('position',{x:0, y:height,z:0});
                height+=0.101;
            }
        }
    },
    startPreview: function(evt, where=null){
        if(!this.preview){
            this.preview = this.addInstruction(evt.detail.carried, where, true);
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.preview){
            this.removeInstruction(this.preview);
            this.preview = null;
        }
        if(evt) evt.stopPropagation();
    },
    dragDrop: function(evt){
        let target = evt.detail.dropped;
        if(target.components['instruction']){
            this.addInstruction(target);
        }
    },
    addInstruction: function(instruction, where, preview = false) {
        if(!instruction.parentNode) return;
        let new_instruction = document.createElement('a-entity');
        let position = new THREE.Vector3(0, 0.061, 0);
        let offset = new THREE.Vector3(0, 0.101, 0);
        let instructionAttr = Object.assign({},instruction.getAttribute('instruction'));
        instructionAttr.preview = preview;
        new_instruction.setAttribute('instruction',instructionAttr);
        if(!where){
            this.el.insertBefore(new_instruction,this.el.firstElementChild);
        }else{
            position.copy(where.getAttribute('position'));
            position.add(offset);
            this.el.insertBefore(new_instruction,where.nextElementSibling);
        }
        new_instruction.setAttribute('position',position);
        let moving_instruction = new_instruction.nextElementSibling;
        while(moving_instruction){
            moving_instruction.components['instruction'].displace(offset);
            moving_instruction = moving_instruction.nextElementSibling;
        }
        if(!preview){
            instruction.remove();
            this.update();
        }
        return new_instruction;
    },
    removeInstruction: function(instruction, reparent=false) {
        let worldToIDE = this.el.parentEl.object3D.matrixWorld.clone();
        let worldToProgam = this.el.object3D.matrixWorld.clone();
        this.programToIDE = worldToProgam.multiply(worldToIDE.invert());

        let moving_instruction = instruction.nextElementSibling;
        let offset = new THREE.Vector3(0, -0.101, 0);
        let new_instruction = undefined;
        instruction.remove();
        if(reparent){
            new_instruction = document.createElement('a-entity');
            position = instruction.getAttribute('position');
            new_instruction.setAttribute('position',this.programToIDE.multiplyVector3(position));
            new_instruction.setAttribute('instruction',instruction.getAttribute('instruction'));
            this.el.parentEl.appendChild(new_instruction);
        }
        while(moving_instruction){
            moving_instruction.components['instruction'].displace(offset);
            moving_instruction = moving_instruction.nextElementSibling;
        }
        this.update();
        return new_instruction;
    },
    run: function(drone) {
        if(this.running) return;
        this.running = true;
        let timeout = 250;
        for(const e of this.el.children){
            setTimeout(()=>{
                if(!e.parentEl) return;
                let instruction = e.components['instruction'];
                instruction.run.bind(instruction)(drone);
            },timeout);
            timeout += 500;
        }
        setTimeout(()=>{this.running = false;}, timeout);
    }
  });