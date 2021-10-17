AFRAME.registerComponent('program',{
    schema: {
        active:{type:'boolean',default:false},
        instructions:{type:'array',default:['init']}
    },
    init: function(){       
        if(this.data.active) this.open();        
    },
    update: function(oldData){
        this.data.instructions = [];

        for(let el of this.el.children){
            let instruction = el.components.instruction;
            if(instruction && instruction.initialized){
                this.data.instructions.push(instruction.data.type);
            }
        }
    },
    open: function(){
        const el = this.el;

        el.setAttribute('geometry','primitive: box; width: 0.3; height: 0.02; depth: 0.3');
        el.setAttribute('ammo-body','type:static;emitCollisionEvents:true');
        el.setAttribute('ammo-shape','type:box');
        
        let height = 0.06;
        if(this.data.instructions.length > 0){
            for(i of this.data.instructions){
                let new_instruction = document.createElement('a-entity');
                el.appendChild(new_instruction);
                new_instruction.setAttribute('instruction',{type:i});
                new_instruction.setAttribute('position',{x:0, y:height,z:0});
                height+=0.1;
            }
            this.initInstruction = this.el.firstElementChild;
            this.el.setAttribute('ammo-constraint',{type:'fixed',target:this.initInstruction});
        }
    }
  });