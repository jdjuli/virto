AFRAME.registerComponent('ide',{
    schema: {},
    init: function(){
        let el = this.el;

        el.setAttribute('geometry','primitive:box; height:0.1; width:2; depth:1');
        el.setAttribute('material',{src:'textures/Wood052_1K_Color.png'});
        el.setAttribute('ammo-body','type:static');
        el.setAttribute('ammo-shape','type:box');

    }
  });