AFRAME.registerComponent('selector',{
    schema: {
        target:{type:'selector'},
        min:{type:'number', default:0},
        max:{type:'number', default:5},
        length:{type:'number',default:0.5}
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
        /*this.cursor.addEventListener('model-loaded',(e)=>{
            this.cursor.setAttribute('ammo-body',{type:'dynamic',linearDamping:1,angularDamping:1,gravity:{x:0,y:0,z:0},emitCollisionEvents:true});
            this.cursor.setAttribute('ammo-shape',{type:'hacd'});
            console.log('model loaded');
        });*/
        this.cursor.setAttribute('gltf-model','selector-cursor.gltf');
        

        
        this.cursor.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        
        //this.cursor.setAttribute('ammo-constraint',{type:'slider',target:this.el});
        
        this.el.appendChild(this.cursor);
    },
    tick: function (params) {
        if(this.cursor.is('grabbed')){
            let xLimit = this.data.length/2.0;
            let position = this.cursor.getAttribute('position');
            //correct cursor position
            position.y = 0.1;
            position.z = 0;
            if(position.x < -xLimit){
                position.x = -xLimit;
            }else if(position.x > xLimit){
                position.x = xLimit
            }

            this.value = this.data.min + this.interval*(position.x+xLimit)/this.data.length;

            this.cursor.setAttribute('text','value',this.value.toFixed(2));
        }
    }
});