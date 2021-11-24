AFRAME.registerComponent('program',{
    schema: {
        active:{type:'boolean',default:true},
    },
    init: function(){       
        this.el.addEventListener('run',this.run.bind(this));     
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry','primitive: box; width: 0.4; height: 0.7; depth: 0.4');
        this.el.setAttribute('material','color:#757A6D');
        this.el.setAttribute('droppable','');
    },
    update: function(oldData) {
        if(this.data.active) this.open();  
    },
    open: function(){
        this.el.addEventListener('drag-drop',this.dragDrop.bind(this));
    },
    startPreview: function(evt, where=null){
        if(!this.preview){
            this.preview = this.addInstruction(evt.detail.carried, where, true);
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.preview && this.preview.attached){
            this.removeInstruction(this.preview);
            this.preview = null;
        }
        if(evt) evt.stopPropagation();
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
        let originalComponent = instruction.components['instruction'] || instruction.components['condition'];
        let position = new THREE.Vector3(0.3, 0, 0);
        let offset = new THREE.Vector3(originalComponent.size.x+0.001, 0, 0);
        let componentAttr = Object.assign({},originalComponent.data);
        newEntity.setAttribute(originalComponent.attrName,componentAttr);

        if(!where){
            this.el.insertBefore(newEntity,this.el.firstElementChild);
        }else{
            position.copy(where.getAttribute('position'));
            componentWhere = where.components['instruction'] || where.components['condition'];
            position.y += componentWhere.height;
            this.el.insertBefore(newEntity,where.nextElementSibling);
        }
        newEntity.setAttribute('position',position);

        let moving_instruction = newEntity.nextElementSibling;
        while(moving_instruction){
            moving_instruction.getAttribute('position').add(offset);
            moving_instruction = moving_instruction.nextElementSibling;
        }
        instruction.remove();
        return newEntity;
    },
    removeInstruction: function(instruction) {
        let moving_instruction = instruction.nextElementSibling;
        let old_component = instruction.components['instruction'] || instruction.components['condition'];
        let offset = new THREE.Vector3(-old_component.size.x-0.001, 0, 0);
        instruction.remove();
        while(moving_instruction){
            moving_instruction.getAttribute('position').add(offset);
            moving_instruction = moving_instruction.nextElementSibling;
        }
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