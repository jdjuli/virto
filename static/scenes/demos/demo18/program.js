AFRAME.registerComponent('program',{
    schema: {
        active:{type:'boolean',default:false},
        instructions:{  parse: JSON.parse,
                        stringify: JSON.stringify,
                        default:'[{"itype":"instruction","idata":{"type":"up"}},{"itype":"instruction","idata":{"type":"down"}}]'}
    },
    init: function(){       
        if(this.data.active) this.open();   
        this.el.addEventListener('run',this.run.bind(this));     
        this.el.setAttribute('class','collidable');
    },
    update: function(oldData) {
        this.data.instructions = [];
        for(let c of this.el.children){
            let itype;
            if(c.components['instruction']){
                itype = 'instruction';
            }else if(c.components['condition']){
                itype = 'condition';
            }
            let idata = c.components[itype].data || c.components[itype].attrValue;
            this.data.instructions.push({itype:itype,idata:idata});
        }
        this.attrValue = this.data;
        this.flushToDOM();

        let worldToIDE = this.el.parentEl.object3D.matrixWorld.clone();
        let worldToLocal = this.el.object3D.matrixWorld.clone();
        this.localToIDE = worldToLocal.multiply(worldToIDE.invert());
    },
    open: function(){
        const el = this.el;
        
        el.setAttribute('geometry','primitive: box; width: 0.15; height: 0.15; depth: 0.15');
        el.setAttribute('material','color:#757A6D');
        el.setAttribute('droppable','');
        
        el.addEventListener('dragover-start',this.startPreview.bind(this));
        el.addEventListener('dragover-end',this.endPreview.bind(this));
        el.addEventListener('drag-drop',this.dragDrop.bind(this));
        
        let height = 0.126;
        if(this.data.instructions.length > 0){
            for(i of this.data.instructions){
                let new_instruction = document.createElement('a-entity');
                el.appendChild(new_instruction);
                new_instruction.setAttribute(i.itype,i.idata);
                new_instruction.components[i.itype].initComponent();
                new_instruction.setAttribute('position',{x:0, y:height,z:0});
                height+=new_instruction.components[i.itype].height+0.001;
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
        if(this.preview && this.preview.attached){
            this.removeInstruction(this.preview);
            this.preview = null;
        }
        if(evt) evt.stopPropagation();
    },
    dragDrop: function(evt){
        let dropped = evt.detail.dropped;
        let target = evt.detail.target;
        if(dropped.components['instruction'] || dropped.components['condition']){
            if(target == this.el){
                this.addInstruction(dropped);
            }else{
                let container = target.components['condition'];
                if(!container){
                    container = target.components['instruction'].container;
                }
                container.addInstruction.bind(container)(dropped);
            }
        }
    },
    addInstruction: function(instruction, where, preview = false) {
        if(!instruction.parentNode) return;
        let newEntity = document.createElement('a-entity');
        let originalComponent = instruction.components['instruction'] || instruction.components['condition'];
        let position = new THREE.Vector3(0, 0.126, 0);
        let offset = new THREE.Vector3(0, originalComponent.height+0.001, 0);
        let componentAttr = Object.assign({},originalComponent.data);
        componentAttr.preview = preview;
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
            let component = moving_instruction.components['instruction'] || moving_instruction.components['condition'];
            component.displace(offset);
            moving_instruction = moving_instruction.nextElementSibling;
        }
        if(!preview){
            instruction.remove();
            this.update();
        }
        return newEntity;
    },
    removeInstruction: function(instruction, reparent=false) {
        let worldToIDE = this.el.parentEl.object3D.matrixWorld.clone();
        let worldToLocal = instruction.parentEl.object3D.matrixWorld.clone();
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
            this.el.parentEl.appendChild(new_instruction);
        }
        while(moving_instruction){
            let component = moving_instruction.components['instruction'] || moving_instruction.components['condition'];
            component.displace(offset);
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
            timeout += 250;
        }
        setTimeout(()=>{this.running = false;}, timeout);
    }
  });