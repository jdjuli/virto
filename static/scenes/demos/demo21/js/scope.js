Array.prototype.shuffle = function(){
    let randomIdx, aux;
    for(let i = this.length-1 ; i > 0 ; i--){
        randomIdx = Math.floor(Math.random()*(i+1));
        aux = this[i];
        this[i] = this[randomIdx];
        this[randomIdx] = aux;
    }
    return this;
    
};

AFRAME.registerComponent('scope',{
    schema:{
        width:{type:'number',default:1.5}
    },
    init: function(){ 
        this.variables = new Map();
        this.update = this.update.bind(this);
        this.icons = Array.from(this.el.sceneEl.querySelectorAll('[id^=icon]'))/*.shuffle()*/.map(el=>'#'+el.id);  
        
        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true});
    },
    remove: function(){
        this.mutationObs.disconnect();
    },
    update: function(){
        this.variables.clear();
        let idx = 0;
        let variableEls = this.el.getChildEntities().filter((a)=>a.getDOMAttribute('variable'));
        let incrementX = Math.min(this.data.width/variableEls.length, 0.2);
        let baseX = this.data.width*-0.5;
        for(let variableEl of variableEls){
            let name = variableEl.getAttribute('id');
            if(this.variables.has(name)){
                console.error('Cannot create two variables with the same name ('+name+')');
            }else{
                let position = new THREE.Vector3(baseX+incrementX*idx, 0, 0);
                variableEl.setAttribute('position',position);
                if(!variableEl.components.variable.initialized) variableEl.components.variable.initComponent();
                if(!variableEl.getAttribute('variable').icon){
                    variableEl.setAttribute('variable','icon',this.icons.pop());
                } 
                if(variableEl.components.variable) variableEl.components.variable.initialPosition = position.clone();
                this.variables.set(name,variableEl);
            }
            idx++;
        }
    },
    createNewVariable: function(name){
        let element = document.createElement('a-entity');
        element.setAttribute('variable',{value:0,icon:this.icons.pop()});
        element.setAttribute('id',name);
        this.el.appendChild(element);
    }
});