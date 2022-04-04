AFRAME.registerComponent('code',{
    init: function(){
        this.instructions = [];
        this.previewInstruction = false;
        this.exec = this.exec.bind(this);
        this.update = this.update().bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.programEl = this.el.closest('[program]');
        this.parentUpdatable = this.el.parentEl.components['instruction-conditional'];

        this.el.size=new THREE.Vector3(0,0,0);
        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true});

        this.el.clone = ()=>{
            let clone = document.createElement('a-entity');
            clone.setAttribute('code',{});
            clone.size = this.el.size;
            for(instruction of this.el.getChildEntities()){
                clone.appendChild(instruction.clone());
            }
            return clone;
        }
    },
    update: function(){
        let position = new THREE.Vector3(0,0,0);
        let first;
        let component;
        return (oldData)=>{
            let entities = this.el.getChildEntities();
            this.instructions = [];
            position.set(0,0,0);
            this.el.size.set(0,0,0);
            for(let i = 0 ; i < entities.length ; i++){
                let instructionEl = entities[i];
                let compInstruction = instructionEl.components['instruction']
                let compConditional = instructionEl.components['instruction-conditional'];
                let component = compInstruction || compConditional;
                if(component && !component.initialized) component.initComponent();
                if(i == 0){
                    position.x = instructionEl.size.x/2;
                    first = false;
                }else{
                    position.x += instructionEl.size.x/2 + entities[i-1].size.x/2;
                }
                this.el.size.x += instructionEl.size.x;
                this.el.size.y = Math.max(this.el.size.y,instructionEl.size.y);
                this.el.size.z = Math.max(this.el.size.z,instructionEl.size.z);

                instructionEl.object3D.position.copy(position);
                if(component){
                    if(compConditional){
                        instructionEl.object3D.position.x -= (instructionEl.size.x-0.6)/2;
                    }
                    component.initialPosition=instructionEl.object3D.position.clone();
                    this.instructions.push(component);
                }
            }
            if(this.parentUpdatable && this.parentUpdatable.initialized) this.parentUpdatable.update();
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
                    await instruction.exec();
                }
            }catch(e){
                console.warn(e);
            }
            resolve();
        });
    }
});