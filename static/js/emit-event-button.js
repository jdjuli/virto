AFRAME.registerComponent('emit-event-button', {
    schema: {event:{type:'string'},
             emitTo:{type:'selector'},
             text:{type:'string'},
             height:{type:'number',default:0.1},
             width:{type:'number',default:0.2},
             color:{type:'string',default:'#c97f4d'}},
    init: function () {
        this.emitEvent = this.emitEvent.bind(this);

        if(!this.data.emitTo) this.data.emitTo = this.el.sceneEl;

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry',{primitive:'box', width:this.data.width, height:this.data.height, depth: 0.05});
        this.el.setAttribute('material',{color:this.data.color});
        this.el.setAttribute('text',{value:this.data.text,width:1,zOffset:0.026,align:'center'});
        if(AFRAME.utils.device.isMobileVR()){
            this.el.addEventListener('collidestart',this.emitEvent); 
            this.el.addEventListener('hitend',this.emitEvent); 
        }else{
            this.el.setAttribute('clickable','');
            this.el.addEventListener('click',this.emitEvent); 
        }
    },
    emitEvent: function() {
        if(!this.data.event){
            console.warn('Event name required, the button has been pressed but no event will be emited');
            return;
        }
        this.data.emitTo.emit(this.data.event);
    }
});
