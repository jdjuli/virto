AFRAME.registerComponent('drone',{
    init: function(){
        const _this = this;   

        this.el.setAttribute('geometry',{primitive:'sphere',radius:0.1});
        this.el.setAttribute('material',{color:'cyan'});
        this.el.setAttribute('ammo-body',{type:'kinematic',mass:1.0,activationState:'disableDeactivation'});
        this.el.setAttribute('ammo-shape',{type:'sphere'});

        this.el.addEventListener("run",this.run.bind(this));
    },
    run: function(evt){
        let program = evt.detail.program;

        program.update();

        time = 0;
        for(const instruction of program.data.instructions){
            if(instruction == 'init') continue;
            setTimeout(this.execute.bind(this, instruction), time);
            time += 250;
        }
    },
    execute: function(instruction){
        const el = this.el;
        switch(instruction){
            case 'up':
                el.getAttribute('position').y+=0.2;
                break;
            case 'down':
                el.getAttribute('position').y-=0.2;
                break;
            case 'right':
                el.getAttribute('position').x+=0.2;
                break;
            case 'left':
                el.getAttribute('position').x-=0.2;
                break;
            case 'forward':
                el.getAttribute('position').z+=0.2;
                break;
            case 'backward':
                el.getAttribute('position').x-=0.2;
                break;
            default:
                console.log('unknown instruction: '+instruction);
        }
    }
});