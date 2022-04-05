AFRAME.registerComponent('code',{
    init: function(){
        this.instructions = [];
        this.previewInstruction = false;
        this.exec = this.exec.bind(this);
        this.update = this.update().bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.programEl = this.el.closest('[program]');

        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true});
    },
    update: function(){
        let position = new THREE.Vector3(0,0,0);
        let i;
        return (oldData)=>{
            this.instructions = [];
            i=0;
            for(let instructionEl of this.el.getChildEntities()){
                position.set(0.2*i++,0,0);
                if(instructionEl.getDOMAttribute('instruction')){
                    instructionEl.object3D.position.copy(position);
                    instructionEl.components['instruction'].initialPosition=position.clone();
                    this.instructions.push(instructionEl);
                }else{
                    instructionEl.setAttribute('position',position);
                }
            }
        }
    },
    remove: function(){
        this.mutationObs.disconnect();
    },
    endPreview: function(){
        let toRemove = this.el.getChildEntities();
        toRemove = toRemove.filter((e)=>e.classList.contains('preview'));
        for(e of toRemove) e.remove();
        this.programEl.removeState('previewing');
    },
    exec: async function(){
        return new Promise( async (resolve,reject)=>{
            try{
                for(instruction of this.instructions){
                    await instruction.components.instruction.exec();
                }
            }catch(e){
                console.warn(e);
            }
            resolve();
        });
    }
});