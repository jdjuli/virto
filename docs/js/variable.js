AFRAME.registerComponent('variable',{
    schema:{
        value:{type:'float',default:0.0},
        icon:{type:'string'}
    },
    init: function(){ 
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();
        this.program = this.el.closest('[program]');
        this.ide = this.el.closest('[ide]');
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry',{primitive:'box',width:0.2,height:0.1,depth:0.2});
        this.el.setAttribute('material',{color:'pink'});
        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        this.iconEl = document.createElement('a-entity');
        this.iconEl.setAttribute('geometry',{primitive:'plane',height:0.075,width:0.075});
        this.iconEl.setAttribute('material',{src:this.data.icon, transparent:true});
        this.iconEl.setAttribute('position',{x:-0.05,y:0,z:0.101});
        this.textEl = document.createElement('a-entity');
        this.textEl.setAttribute('text',{value:'= '+this.data.value.toFixed(1),align:'left',anchor:'left',width:0.7});
        this.textEl.setAttribute('position',{x:-0.015,y:0,z:0.101});
        this.el.appendChild(this.iconEl);
        this.el.appendChild(this.textEl);
        
        this.el.addEventListener('grab-end',(evt)=>{
            this.currentPosition.copy(this.initialPosition);
            evt.stopPropagation();
        });
    },
    set: function(newVal){
        value = Number.parseFloat(newVal);
        if(!Number.isNaN(value)){
            value = this.clamp(value,-999.9,999.9);
            this.data.value = value;
            this.textEl.setAttribute('text','value','= '+value.toFixed(1));
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
            position = this.ide.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            reference.setAttribute('reference',{variable:'#'+this.el.id});
            reference.setAttribute('position',position);
            setTimeout(()=>{this.ide.appendChild(reference);},10);
            
            this.el.removeState('grabbed');
            this.el.components.grabbable.grabbed = false;
            this.el.components.grabbable.grabber = undefined;
            this.el.components.grabbable.grabbers = [];
            this.currentPosition.copy(this.initialPosition);
            this.el.setAttribute('position',this.initialPosition.clone());
        }
    }
});