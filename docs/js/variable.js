AFRAME.registerComponent('variable',{
    schema:{
        value:{type:'float',default:0.0},
        icon:{type:'string',default:'#icon_spider'},
        min:{type:'number',default:-9},
        max:{type:'number',default:9}
    },
    init: function(){ 
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();
        this.program = this.el.closest('[program]');
        this.el.id = this.el.id || (Math.floor(Math.random()*1000)).toString(16);
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry',{primitive:'box',width:0.1,height:0.1,depth:0.1});
        this.el.setAttribute('material',{color:'pink'});
        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        this.iconEl = document.createElement('a-entity');
        this.iconEl.setAttribute('geometry',{primitive:'plane',height:0.075,width:0.075});
        this.iconEl.setAttribute('material',{src:this.data.icon, transparent:true});
        this.iconEl.setAttribute('position',{x:0,y:0,z:0.051});
        this.el.appendChild(this.iconEl);
        /*
        this.textEl = document.createElement('a-entity');
        this.textEl.setAttribute('text',{value:this.data.value,align:'center',anchor:'center',side:'double',width:1});
        this.textEl.setAttribute('position',{x:0,y:0.1,z:0});
        this.el.appendChild(this.textEl);
        */

        this.selectorEl = document.createElement('a-entity');
        this.selectorEl.setAttribute('selector',{min:this.data.min,max:this.data.max,width:0.1});
        this.selectorEl.setAttribute('position',{x:0,y:0.14142,z:0});
        this.el.appendChild(this.selectorEl);
        
        
        this.el.addEventListener('grab-end',(evt)=>{
            this.currentPosition.copy(this.initialPosition);
            evt.stopPropagation();
        });
        this.el.addEventListener('valuechanged',(evt)=>{
            this.data.value = Math.round(this.clamp(evt.detail.value,this.data.min,this.data.max))
            evt.stopPropagation();
        });
    },
    update: function(){
        this.set(this.data.value);
    },
    set: function(newVal){
        value = Number.parseFloat(newVal);
        if(!Number.isNaN(value)){
            value = Math.round(this.clamp(value,this.data.min,this.data.max));
            this.data.value = value;
            this.selectorEl.setAttribute('selector','value',value);
        }else{
            console.log('New variable value: \''+newVal+'\' is not recognized as a valid number');
        }
    },
    get: function(){
        return this.data.value;
    },
    clamp: function(val,min,max){
        return Math.min(Math.max(val,min),max);
    },
    getIconSelector: function(){
        return this.data.icon;
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