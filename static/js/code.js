AFRAME.registerComponent('code',{
    init: function(){
        this.instructions = [];
        this.previewInstruction = false;
        this.exec = this.exec().bind(this);
        this.update = this.update().bind(this);
        this.endPreview = this.endPreview.bind(this);

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

                    //instructionEl.setAttribute('ammo-body','type','static');
                    //instructionEl.components['ammo-body'].updateComponent();
                    instructionEl.object3D.position.copy(position);
                    instructionEl.components['instruction'].initialPosition=position.clone();
                    //instructionEl.components['ammo-body'].syncToPhysics();
                    //instructionEl.setAttribute('ammo-body','type','dynamic');

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
        this.el.removeState('previewing');
    },
    exec: function(){
        return (program,findVariable)=>{
            if(!this.el.is('running')){
                this.el.addState('running');
                for(i = 0 ; i < this.instructions.length ; i++){
                    fun = ((idx)=>()=>{
                        this.instructions[idx].components.instruction.exec(program,findVariable);
                    })(i);
                    setTimeout(fun, 250*i);
                }
                setTimeout(()=>this.el.removeState('running'), 250*i);
            }
        }
    }
});