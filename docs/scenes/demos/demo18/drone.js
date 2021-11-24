AFRAME.registerComponent('drone',{
    init: function(){
        const _this = this;   

        this.el.setAttribute('geometry',{primitive:'sphere',radius:0.1});
        this.el.setAttribute('material',{color:'cyan'});
        this.el.setAttribute('ammo-body',{type:'kinematic',mass:1.0,activationState:'disableDeactivation'});
        this.el.setAttribute('ammo-shape',{type:'sphere'});

        this.initialPosition = this.el.getAttribute('position').clone();
    },
    up:function() {
        this.el.getAttribute('position').y+=0.2;
    },
    down:function() {
        this.el.getAttribute('position').y-=0.2;
    },
    forward:function() {
        this.el.getAttribute('position').z+=0.2;
    },
    backward:function() {
        this.el.getAttribute('position').z-=0.2;
    },
    left:function() {
        this.el.getAttribute('position').x+=0.2;
    },
    right:function() {
        this.el.getAttribute('position').x-=0.2;
    },
    resetPosition:function() {
        this.el.setAttribute('position',this.initialPosition);
    }
});