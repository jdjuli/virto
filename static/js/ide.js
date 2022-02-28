AFRAME.registerComponent('ide',{
    schema: {},
    init: function(){
        this.programs = new Map();
    },
    update: function(){
        this.programs.clear();
        let programEls = this.el.getChildEntities().filter((a)=>a.getAttribute('program'));
        for(let programEl of programEls){
            let name = programEl.getAttribute('program').name;
            if(this.programs.has(name)){
                console.error('Cannot create two programs with the same name ('+name+')');
            }else{
                this.programs.set(name,programEl);
            }
        }
    },
    createProgram: function(name){
        if(this.programs.has(name)){
            console.error('Cannot create two programs with the same name ('+name+')');
        }else{
            let program = document.createElement('a-entity');
            program.setAttribute('program');
            this.el.appendChild(program);
            this.programs.set(name,program);
        }
    }
  });