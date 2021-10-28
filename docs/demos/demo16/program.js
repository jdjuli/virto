AFRAME.registerComponent('program',{
    schema: {
        active:{type:'boolean',default:false},
        instructions:{type:'array',default:['init']}
    },
    init: function(){       
        if(this.data.active) this.open();   
        this.el.addEventListener('run',this.run.bind(this));     
    },
    open: function(){
        const el = this.el;

        el.setAttribute('geometry','primitive: box; width: 0.3; height: 0.02; depth: 0.3');
        el.setAttribute('material','color:#757A6D');
        el.setAttribute('ammo-body','type:static;emitCollisionEvents:true');
        el.setAttribute('ammo-shape','type:box');
        el.addEventListener('collidestart',this.collisionHandler.bind(this));
        
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
    collisionHandler: function(evt){
        let target = evt.detail.targetEl;
        if(target.components['instruction']){
            this.addInstruction(target);
        }
    },
    addInstruction: function(instruction, where) {
        if(!instruction.parentNode) return;
        let new_instruction = document.createElement('a-entity');
        let position = new THREE.Vector3(0, 0.061, 0);
        new_instruction.setAttribute('instruction',instruction.getAttribute('instruction'));
        if(!where){
            this.el.insertBefore(new_instruction,this.el.firstElementChild);
        }else{
            position.y = where.getAttribute('position').y + 0.101;
            this.el.insertBefore(new_instruction,where.nextElementSibling);
        }
        let moving_instruction = new_instruction;
        do{
            moving_instruction.setAttribute('position',position);
            position.y+=0.101;
            moving_instruction = moving_instruction.nextElementSibling;
        }while(moving_instruction);
        instruction.remove();
        this.update();
    },
    update: function(oldData) {
        this.data.instructions = [];
        for(let c of this.el.children){
            this.data.instructions.push(c.components['instruction'].attrValue.type);
        }
        this.attrValue = this.data;
        this.flushToDOM();
    },
    removeInstruction: function(instruction) {
        let position = new THREE.Vector3(0, instruction.getAttribute('position').y, 0);
        let moving_instruction = instruction.nextElementSibling;
        instruction.remove();
        while(moving_instruction){
            moving_instruction.setAttribute('position',position);
            position.y+=0.101;
            moving_instruction = moving_instruction.nextElementSibling;
        }
        this.update();
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
            timeout += 250;
        }
        setTimeout(()=>{this.running = false;}, timeout);
    }
  });