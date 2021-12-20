AFRAME.registerComponent('ide',{
    schema: {},
    init: function(){
        this.el.setAttribute('geometry','primitive:box; height:0.1; width:2; depth:1');
        this.el.setAttribute('material','color:gray');
        this.el.setAttribute('ammo-body','type:static');
        this.el.setAttribute('ammo-shape','type:box');

        this.recyclebin = document.createElement('a-entity');
        this.recyclebin.setAttribute('recyclebin','');
        this.recyclebin.setAttribute('position',{x:-0.9, y:0.105, z:0.4});

        this.el.appendChild(this.recyclebin);
    }
  });