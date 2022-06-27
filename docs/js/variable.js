function randomUsableColor(){
    return '#'+(64+128*Math.random()).toString(16)+(64+128*Math.random()).toString(16)+(64+128*Math.random()).toString(16)
}

AFRAME.registerComponent('variable',{
    schema:{
        value:{type:'string'},
        icon:{type:'string'},
        type:{type:'string',default:'integer',oneOf:['integer','boolean']},
        min:{type:'number',default:-9},
        max:{type:'number',default:9}
    },
    init: function(){ 
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();
        this.program = this.el.closest('[program]');
        if(this.data.type == 'boolean') this.data.value = /[tT](rue)?/.test(this.data.value);
        this.el.id = this.el.id || 'var_'+(Math.floor(Math.random()*1000)).toString(16);
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry',{primitive:'box',width:0.1,height:0.1,depth:0.1});
        if(this.data.type == 'integer'){
            this.el.setAttribute('material',{color:'pink'});
        }else if(this.data.type == 'boolean'){
            this.el.setAttribute('material',{color:'#cff0ec'});
        }
        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        this.iconEl = document.createElement('a-entity');
        this.iconEl.setAttribute('geometry',{primitive:'plane',height:0.075,width:0.075});
        this.iconEl.setAttribute('position',{x:0,y:0,z:0.051});
        this.el.appendChild(this.iconEl);

        this.selectorEl = document.createElement('a-entity');
        this.selectorEl.setAttribute('selector',{min:this.data.min,max:this.data.max,width:0.1,type:this.data.type});
        this.selectorEl.setAttribute('position',{x:0,y:0.14142,z:0});
        this.el.appendChild(this.selectorEl);
        
        
        this.el.addEventListener('grab-end',(evt)=>{
            this.currentPosition.copy(this.initialPosition);
            evt.stopPropagation();
        });
        this.el.addEventListener('valuechanged',(evt)=>{
            if(this.data.type == 'integer'){
                this.data.value = Math.round(this.clamp(evt.detail.value,this.data.min,this.data.max));
            }else{
                this.data.value = evt.detail.value;
            }
            evt.stopPropagation();
        });
    },
    update: function(){
        this.set(this.data.value);
        if(this.data.icon){
            this.iconEl.setAttribute('material',{src:this.data.icon, transparent:true});
            this.el.emit('iconSet');
        }else{
            this.iconEl.setAttribute('material',{color:randomUsableColor()});
        }
    },
    set: function(newVal){
        value = Number.parseFloat(newVal);
        if(!Number.isNaN(value) && this.data.type == 'integer'){
            value = Math.round(this.clamp(value,this.data.min,this.data.max));
            this.data.value = value;
            this.selectorEl.setAttribute('selector','value',value);
        }else if(this.data.type == 'boolean'){
            newVal = /[tT](rue)?/.test(newVal);
            this.data.value = newVal;
            this.selectorEl.setAttribute('selector','value',newVal);
        }
    },
    get: function(){
        let num = Number.parseInt(this.data.value);
        if(Number.isNaN(num)){
            return this.data.value;
        }else{
            return num;
        }
    },
    clamp: function(val,min,max){
        return Math.min(Math.max(val,min),max);
    },
    getIconSelector: function(){
        return new Promise((resolve,reject)=>{
            if(this.data.icon){
                resolve(this.data.icon);
            }else{
                this.el.addEventListener('iconSet',(evt)=>{
                    evt.stopPropagation();
                    resolve(this.data.icon || this.iconEl.components.material.color);
                })
            }
        });
    },
    tick: function(){
        if(this.initialPosition.distanceTo(this.currentPosition) > 0.4){
            reference = document.createElement('a-entity');
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition(new THREE.Vector3()));
            reference.setAttribute('reference',{variable:'#'+this.el.id});
            reference.setAttribute('position',position);
            setTimeout(()=>{this.program.appendChild(reference);},10);
            
            this.el.removeState('grabbed');
            this.el.components.grabbable.grabbed = false;
            this.el.components.grabbable.grabber = undefined;
            this.el.components.grabbable.grabbers = [];
            this.currentPosition.copy(this.initialPosition);
            this.el.setAttribute('position',this.initialPosition.clone());
        }
    }
});