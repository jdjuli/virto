AFRAME.registerComponent('selector',{
    schema: {
        min:{type:'number', default:0},
        max:{type:'number', default:5},
        value:{type:'number'},
        width:{type:'number', default:0.5}
    },
    init: function() {
        this.interval = this.data.max-this.data.min;
        this.value = this.data.value || this.data.min + this.interval/2;

        this.cursor = document.createElement('a-entity');
        this.cursor.setAttribute('class','collidable');
        this.cursor.setAttribute('obj-model',{obj:'#selectorCursor'});
        this.cursor.setAttribute('material',{color:'red'});

        this.textEl = document.createElement('a-entity');
        this.textEl.setAttribute('text',{value:this.value.toFixed(0), align:'center', baseline:'center', width:1});
        this.textEl.setAttribute('position',{x:0,y:0,z:0.035});

        this.cursor.appendChild(this.textEl)

        this.cursor.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        
        this.el.appendChild(this.cursor);

        this.el.addEventListener('grab-end',(evt)=>{
            evt.stopPropagation();
        });
    },
    tick: function (params) {
        if(this.cursor.is('grabbed')){
            let xLimit = this.data.width/2;
            let position = this.cursor.getAttribute('position');
            let oldValue = this.data.value;
            //Force cursor to move only on the slider axis and coordinate range
            position.y = 0;
            position.z = 0;
            if(position.x < -xLimit){
                position.x = -xLimit;
            }else if(position.x > xLimit){
                position.x = xLimit
            }
            //Calculate value based on cursor position
            this.data.value = Math.round(this.data.min + this.interval*(position.x+xLimit)/this.data.width);
            if(oldValue != this.data.value){
                this.el.emit('valuechanged',{value:this.data.value});
                //Update text
                this.textEl.setAttribute('text','value',this.data.value.toFixed(0));
            }
            
        }
    }
});