AFRAME.registerComponent('esfera_marron',{
    init: function(){
        var el = this.el;
        el.setAttribute('geometry',{'primitive':'sphere','radius':1.0});
        el.setAttribute('material','color','brown');
    }
});