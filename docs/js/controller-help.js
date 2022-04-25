

AFRAME.registerComponent('controller-help', {
    schema: {
      hand:{type:'string', default:'right', anyof:['right','left']}
    },
    init: function () {
      this.el.setAttribute('material',{src:'#controller'});
    },
    update: function(){
      this.el.getChildEntities().forEach(e=>e.remove());
      let xFactor = this.data.hand=='right'?1:-1;
      this.el.setAttribute('obj-model',{obj:'#controller_'+this.data.hand});
      const color = '#b80000';

      let hint_1 = document.createElement('a-entity');
      let hint_2 = document.createElement('a-entity');
      let hint_3 = document.createElement('a-entity');
      hint_1.setAttribute('hint',{
        start:{x:0.1*xFactor,y:0.08,z:-0.16},
        end:{x:0.2*xFactor,y:0.6,z:0.6},
        signHeight:0.43,
        text:'__PRESS__\nopen/close menu\n\n__MOVE UP/DOWN__\nchange the category\n\n__MOVE RIGHT/LEFT__\nnavigate through the category',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      hint_2.setAttribute('hint',{
        start:{x:-0.02*xFactor,y:-0.24,z:-0.37},
        end:{x:0*xFactor,y:0.1,z:-0.7},
        signHeight:0.32,
        text:'__PRESS__\nselect a teleport point\n\n__RELEASE__\nteleport to the selected point',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      hint_3.setAttribute('hint',{
        start:{x:-0.08*xFactor,y:-0.29,z:0.15},
        end:{x:-0.35*xFactor,y:0,z:0.6},
        signHeight:0.27,
        text:'__PRESS__\ngrab objects\n\n__RELEASE__\ndrop the grabbed object',
        lineColor:color,
        lookAt:'[camera]:not([aframe-injected])'}
      );
      this.el.appendChild(hint_1);
      this.el.appendChild(hint_2);
      this.el.appendChild(hint_3);
    }
  });