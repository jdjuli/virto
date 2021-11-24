AFRAME.registerComponent('block',{
    schema: {},
    init: function(){
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('clickable','');
        this.el.setAttribute('hoverable','');
        this.el.setAttribute('material',{color:'blue'});
    },
    tick: function(){
        if(this.el.is('hovered') && !this.el.is('clicked')){
            this.el.setAttribute('material',{color:'green'});
        }else if(this.el.is('clicked')){
            this.el.setAttribute('material',{color:'red'});
        }else{
            this.el.setAttribute('material',{color:'blue'});
        }
    }
});