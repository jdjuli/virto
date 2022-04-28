

AFRAME.registerComponent('controller-help', {
    schema: {
      hand:{type:'string', default:'right', anyof:['right','left']}
    },
    init: function () {
      this.el.setAttribute('material',{src:'#controller'});
      this.el.setAttribute('scale','0.11 0.11 0.11');
    },
    update: function(){
      this.el.getChildEntities().forEach(e=>e.remove());
      let xFactor = this.data.hand=='right'?1:-1;
      this.el.setAttribute('obj-model',{obj:'#controller_'+this.data.hand});
      const color = '#b80000';

      let hint_1 = document.createElement('a-entity');
      let hint_2 = document.createElement('a-entity');
      let hint_3 = document.createElement('a-entity');
      let hint_4 = document.createElement('a-entity');
      let hint_5 = document.createElement('a-entity');
      hint_1.setAttribute('hint',{
        start:{x:0.1*xFactor,y:0.08,z:-0.16},
        end:{x:2*xFactor,y:0.5,z:-0.2},
        signHeight:1.4,
        signWidth:1.6,
        text:'__PRESS__\nopen/close menu\n\n__MOVE UP/DOWN__\nchange the category\n\n__MOVE RIGHT/LEFT__\nnavigate through the category',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      hint_2.setAttribute('hint',{
        start:{x:-0.02*xFactor,y:-0.24,z:-0.37},
        end:{x:1*xFactor,y:1,z:-2},
        signHeight:0.85,
        signWidth:1.4,
        text:'__PRESS__\nselect a teleport point\n\n__RELEASE__\nteleport to the selected point',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      hint_3.setAttribute('hint',{
        start:{x:-0.08*xFactor,y:-0.29,z:0.15},
        end:{x:-1.5*xFactor,y:-1.35,z:0},
        signHeight:0.8,
        signWidth:1.5,
        text:'__PRESS__\ngrab objects\n\n__RELEASE__\ndrop the grabbed object',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      hint_4.setAttribute('hint',{
        start:{x:-0.1*xFactor,y:0,z:-0.13},
        end:{x:-1*xFactor,y:1,z:-2},
        signHeight:0.5,
        signWidth:1.4,
        text:'__PRESS ON BOTH HANDS__\nopen / close this help',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      hint_5.setAttribute('hint',{
        start:{x:-0.08*xFactor,y:-0.29,z:0.15},
        end:{x:-0.7*xFactor,y:-2,z:1},
        signHeight:0.6,
        signWidth:1.6,
        text:'__PRESS & EXTEND INDEX FINGER__\npress buttons\n\n',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      this.el.appendChild(hint_1);
      this.el.appendChild(hint_2);
      this.el.appendChild(hint_3);
      this.el.appendChild(hint_4);
      this.el.appendChild(hint_5);
    }
  });