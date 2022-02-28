AFRAME.registerComponent('code',{
    init: function(){
        this.instructions = [];
        this.previewInstruction = false;
        this.exec = this.exec().bind(this);
        this.update = this.update.bind(this);

        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true});
    },
    update: function(){
        this.instructions = [];
        
        let instructionEls = this.el.getChildEntities().filter((a)=>a.getDOMAttribute('instruction'));
        for(let instructionEl of instructionEls){
            let position = new THREE.Vector3(0.2*this.instructions.length,0,0);
            instructionEl.setAttribute('position',position);
            instructionEl.components['instruction'].initialPosition= position.clone();
            this.instructions.push(instructionEl);
        }
    },
    remove: function(){
        this.mutationObs.disconnect();
    },
    exec: function(){
        return (program,findVariable)=>{
            console.log('START code block');
            for(i = 0 ; i < this.instructions.length ; i++){
                fun = ((idx)=>()=>{
                    this.instructions[idx].components.instruction.exec(program,findVariable);
                })(i);
                setTimeout(fun, 250*i);
            }
            console.log('END code block');
        }
    }
});