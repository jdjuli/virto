AFRAME.registerComponent('program',{
    schema: {
        active:{type:'boolean',default:true},
    },
    init: function(){       
        this.running = false;
        this.timeoutHandles = [];
        this.size = new THREE.Vector3(0,0,0);
        this.ide = this.el.sceneEl.querySelector('[ide]');
        this.drone = this.el.sceneEl.querySelector('[drone]').components.drone;

        this.run = this.run.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.startPreviewInstruction = this.startPreviewInstruction.bind(this);
        this.endPreview = this.endPreview.bind(this);

        this.btnRun = document.createElement('a-entity');
        this.btnRun.setAttribute('emit-event-button',{emitTo:this.el,event:'run',text:'run'});    
        this.btnRun.setAttribute('position',this.el.getAttribute('position').clone().add(new THREE.Vector3(0,0.2,0.2)));
        this.ide.appendChild(this.btnRun);

        this.scope = document.createElement('a-entity');
        this.scope.setAttribute('scope','');
        this.scope.setAttribute('position',{x:0.3,y:-0.3,z:0})
        this.el.appendChild(this.scope);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry','primitive: box; width: 0.4; height: 0.7; depth: 0.4');
        this.el.setAttribute('material','color:#757A6D');
        this.el.setAttribute('sound__correct',{src:'#sound_correct'});
        this.el.setAttribute('sound__error',{src:'#sound_error'});
        this.el.setAttribute('droppable','');
        this.el.addEventListener('dragover-start',this.startPreviewInstruction);
        this.el.addEventListener('dragover-end',this.endPreview);
        this.el.addEventListener('run',this.run);

        this.sndCorrect = this.el.components['sound__correct'];
        this.sndError = this.el.components['sound__error'];
    },
    update: function(oldData) {
        (new THREE.Box3().setFromObject(this.el.object3D)).getSize(this.size);
        if(this.data.active) this.open();  
    },
    open: function(){
        this.el.addEventListener('drag-drop',this.dragDrop);
    },
    startPreviewInstruction: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['instruction'] && !this.preview){
            let instruction = carried.components['instruction'];
            let scope = this.scope.components['scope'];
            this.preview = document.createElement('a-entity');
            this.preview.setAttribute('class','preview');
            this.preview.setAttribute('obj-model',{obj:'/vr-programming/models/instruction.obj'});
            this.preview.setAttribute('position',{x:(this.size.x/2 + scope.size.x + instruction.size.x/2), y:0, z:0});
            this.preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.el.insertBefore(this.preview,this.el.firstElementChild.nextElementSibling);
            let movingInstruction = this.preview.nextElementSibling;
            while(movingInstruction){
                movingInstruction.object3D.position.x += 0.2;
                instruction = movingInstruction.components['instruction'];
                if(instruction) instruction.initialPosition.copy(instruction.currentPosition);
                movingInstruction = movingInstruction.nextElementSibling;
            }
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(!this.preview) return;
        let component = this.preview.components['instruction'] || this.preview.components['condition'];
        let movingInstruction = this.preview.nextElementSibling;
        while(movingInstruction){
            movingInstruction.object3D.position.x -= 0.2;
            instruction = movingInstruction.components['instruction'];
            if(instruction) instruction.initialPosition.copy(instruction.currentPosition);
            movingInstruction = movingInstruction.nextElementSibling;
        }
        this.preview.remove();
        this.preview = null;
        evt.stopPropagation();
    },
    dragDrop: function(evt){
        let dropped = evt.detail.dropped;
        if(dropped.components['instruction']){
            this.addInstruction(dropped);
        }
    },
    addInstruction: function(instruction, where) {
        if(!instruction.parentNode) return;
        let newEntity = document.createElement('a-entity');
        let scope = this.scope.components['scope'];
        let originalComponent = instruction.components['instruction'] || instruction.components['condition'];
        let position = new THREE.Vector3((this.size.x/2 + scope.size.x + originalComponent.size.x/2), 0, 0);
        let offset = new THREE.Vector3(originalComponent.size.x+0.001, 0, 0);
        let componentAttr = Object.assign({},originalComponent.data);
        newEntity.setAttribute(originalComponent.attrName,componentAttr);
        if(!where){
            this.el.insertBefore(newEntity,this.el.firstElementChild.nextElementSibling);
        }else{
            position.copy(where.getAttribute('position'));
            componentWhere = where.components['instruction'] || where.components['condition'];
            position.y += componentWhere.height;
            this.el.insertBefore(newEntity,where.nextElementSibling);
        }
        newEntity.setAttribute('position',position);
        if(!this.preview){
            //If the program was previewing an instruction, it'll be removed and there's no need for moving the next ones
            let moving_instruction = newEntity.nextElementSibling;
            while(moving_instruction){
                moving_instruction.getAttribute('position').add(offset);
                moving_instruction = moving_instruction.nextElementSibling;
            }
        }
        instruction.remove();
        if(this.preview){
            this.preview.remove();
            this.preview = null;
        }
        
        return newEntity;
    },
    removeInstruction: function(instruction) {
        let moving_instruction = instruction.nextElementSibling;
        let old_component = instruction.components['instruction'] || instruction.components['condition'];
        let offset = new THREE.Vector3(-old_component.size.x-0.001, 0, 0);
        while(moving_instruction){
            moving_instruction.getAttribute('position').add(offset);
            instructionComponent = moving_instruction.components['instruction'];
            if(instructionComponent){
                instructionComponent.initialPosition.copy(instructionComponent.currentPosition);
            }
            moving_instruction = moving_instruction.nextElementSibling;
        }
        instruction.remove();
    },
    run: function() {
        if(this.running) return;
        this.running = true;
        let timeout;
        if(this.hasErrors()){
            timeout = 664; //sndError duration
            this.sndError.playSound();
        }else{
            timeout = 500; //sndCorrect duration
            this.sndCorrect.playSound();
            for(const e of this.el.children){
                this.timeoutHandles.push(setTimeout(()=>{
                    if(!e.parentEl) return;
                    let instruction = e.components['instruction'];
                    instruction.run.bind(instruction)(this.drone);
                },timeout));
                timeout += 250;
            }
        }
        setTimeout(()=>{
            this.running = false;
            this.timeoutHandles = [];
        }, timeout);
    },
    hasErrors(){
        let errors = false;
        let i = 0;
        let children = this.el.children;
        while(!errors && i < children.length){
            let instruction = children[i].components.instruction;
            if(instruction){
                errors |= instruction.data.amount.length==0 || instruction.data.parameter.length==0;
            }
            i+=1;
        }
        return errors;
    }
  });