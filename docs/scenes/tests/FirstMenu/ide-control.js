AFRAME.registerComponent('ide-control',{
    schema: {},
    init: function(){
        const el = this.el;
        this.btnLeft = document.createElement('a-entity');
        this.btnCenter = document.createElement('a-entity');
        this.btnRight = document.createElement('a-entity');

        el.setAttribute('class','collidable');
        el.setAttribute('geometry','primitive:box; height:0.15; width:0.3; depth:0.15');
        el.setAttribute('material','color:cyan');
        el.setAttribute('ammo-body','type:dynamic');
        el.setAttribute('ammo-shape','type:box');
        el.setAttribute('grabbable','constraintComponentName:ammo-constraint');
        this.btnLeft.setAttribute('class','collidable');
        this.btnCenter.setAttribute('class','collidable');
        this.btnLeft.setAttribute('class','collidable');
        this.btnLeft.setAttribute('geometry','primitive:box; height:0.01; width:0.08; depth:0.08');
        this.btnCenter.setAttribute('geometry','primitive:box; height:0.01; width:0.08; depth:0.08');
        this.btnRight.setAttribute('geometry','primitive:box; height:0.01; width:0.08; depth:0.08');
        this.btnLeft.setAttribute('ammo-body','type:static; emitCollisionEvents:true');
        this.btnCenter.setAttribute('ammo-body','type:static; emitCollisionEvents:true');
        this.btnRight.setAttribute('ammo-body','type:static; emitCollisionEvents:true');
        this.btnLeft.setAttribute('ammo-shape','type:box');
        this.btnCenter.setAttribute('ammo-shape','type:box');
        this.btnRight.setAttribute('ammo-shape','type:box');
        this.btnLeft.setAttribute('position','-0.10 0.085 0');
        this.btnCenter.setAttribute('position','0 0.085 0');
        this.btnRight.setAttribute('position','0.10 0.085 0');
        this.btnLeft.setAttribute('material','color:red');
        this.btnCenter.setAttribute('material','color:green');
        this.btnRight.setAttribute('material','color:blue');
        this.btnLeft.addEventListener('collidestart',function(evt){el.emit('buttonLeft',evt.detail,true);});
        this.btnCenter.addEventListener('collidestart',function(evt){el.emit('buttonCenter',evt.detail,true);});
        this.btnRight.addEventListener('collidestart',function(evt){el.emit('buttonRight',evt.detail,true);});
        el.appendChild(this.btnLeft);
        el.appendChild(this.btnCenter);
        el.appendChild(this.btnRight);
    },
  });