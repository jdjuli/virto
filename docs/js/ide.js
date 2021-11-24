AFRAME.registerComponent('ide',{
    schema: {},
    init: function(){
        let el = this.el;

        el.setAttribute('geometry','primitive:box; height:0.1; width:2; depth:1');
        el.setAttribute('material','color:gray');
        el.setAttribute('ammo-body','type:static');
        el.setAttribute('ammo-shape','type:box');

    }
  });