AFRAME.registerComponent('program',{
    schema: {
        active:{type:'boolean',default:false},
        instructions:{type:'array',default:['init']}
    },
    init: function(){       
        if(this.data.active) this.open();        
    },
    open: function(){
        const el = this.el;

        el.setAttribute('geometry','primitive: box; width: 0.3; height: 0.02; depth: 0.3');
        el.setAttribute('ammo-body','type:static;emitCollisionEvents:true');
        el.setAttribute('ammo-shape','type:box');

        let height = 0.06;
        for(i of this.data.instructions){
            let new_instruction = document.createElement('a-entity');
            new_instruction.setAttribute('instruction',{type:i,preview:false});
            new_instruction.setAttribute('position','y',height);
            el.appendChild(new_instruction);
            height+=0.1;
        }
        
    }
  });