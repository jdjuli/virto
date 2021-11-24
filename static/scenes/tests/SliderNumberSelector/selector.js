AFRAME.registerComponent('selector',{
    schema: {
        min:{type:'number', default:0},
        max:{type:'number', default:5}
    },
    init: function() {
        this.interval = this.data.max-this.data.min;
        this.value = this.data.min + this.interval/2;
        this.el.setAttribute('gltf-model','selector-bar.gltf');
        this.el.setAttribute('material',{color:'red'});
        this.el.setAttribute('ammo-body',{type:'static'});

        this.cursor = document.createElement('a-entity');
        this.cursor.setAttribute('class','collidable');
        this.cursor.setAttribute('position',{x: 0, y: 0.1, z: 0});
        this.cursor.setAttribute('text',{value:this.value.toFixed(2), align:'center', zOffset:0.035, baseline:'bottom'});
        this.cursor.setAttribute('gltf-model','selector-cursor.gltf');
        
        this.cursor.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        
        this.el.appendChild(this.cursor);
    },
    tick: function (params) {
        if(this.cursor.is('grabbed')){
            let xLimit = 0.25;
            let position = this.cursor.getAttribute('position');
            //Force cursor to move only on the slider axis and coordinate range
            position.y = 0.1;
            position.z = 0;
            if(position.x < -xLimit){
                position.x = -xLimit;
            }else if(position.x > xLimit){
                position.x = xLimit
            }
            //Calculate value based on cursor position
            this.value = this.data.min + this.interval*(position.x+xLimit)/0.5;
            //Update text
            this.cursor.setAttribute('text','value',this.value.toFixed(2));
        }
    }
});