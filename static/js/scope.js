AFRAME.registerComponent('scope',{
    init: function(){ 
        this.variables = new Map();
        this.size = new THREE.Vector3(0.1,0.2,0.3);
        this.currentPosition = this.el.getAttribute('position')
        this.initialPosition = this.currentPosition.clone();
        this.icons=['#icon_bird','#icon_cat','#icon_dog','#icon_flower','#icon_moon','#icon_rat','#icon_spider','#icon_sun','#icon_tree'];
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry',{primitive:'box',height:this.size.x,width:this.size.y,depth:this.size.z});
        this.el.setAttribute('material',{color:'cyan'});
        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
        this.el.addEventListener('grab-end',(evt)=>{
            evt.stopPropagation();
            this.currentPosition.copy(this.initialPosition);
        });
    },
    update: function(){
        (new THREE.Box3().setFromObject(this.el.object3D)).getSize(this.size);
        //ToDo: provide a way to create new variables dynamically
        for(i = 0 ; i < 3 ; i++) this.createNewVariable();
    },
    createNewVariable: function(){
        let name = 'var_'+this.variables.size;
        let element = document.createElement('a-entity');
        element.setAttribute('variable',{value:0,icon:this.icons[this.variables.size%this.icons.length]});
        element.setAttribute('position',{x:0,y:0.1*(this.variables.size+1),z:0});
        element.setAttribute('id',name);
        this.variables.set(name,element);
        setTimeout(()=>{this.el.appendChild(element);},10);
    }
});