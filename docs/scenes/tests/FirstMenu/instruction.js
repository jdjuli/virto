AFRAME.registerComponent('instruction',{
    schema: {
        type:{type:'string',default:'init'},
        preview:{type:'boolean',default:false}
    },
    init: function(){       
        const el = this.el;

        
        el.setAttribute('material','color:green');
        el.setAttribute('class','collidable');

        if(this.data.preview){
            el.setAttribute('text',{value:this.data.type, zOffset:0.011, align:'center', width:0.5});
            //this.el.addEventListener('collidestart',this.oncollide.bind(this));
            this.el.addEventListener('hit',this.oncollide.bind(this));
        }else{
            el.setAttribute('geometry',{primitive:'box',height:0.1,width:0.1,depth:0.1});
            el.setAttribute('ammo-body',{type:'dynamic',linearDamping:0,emitCollisionEvents:true});
            el.setAttribute('ammo-shape',{type:'box'});
            el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});
            el.setAttribute('text',{value:this.data.type, zOffset:0.06, align:'center', width:0.5});
        }

        
    },
    oncollide: function(evt){
        if(!this.el.getAttribute('ammo-body').emitCollisionEvents){
            console.log(this.data.type+" => collision with emitCollisionEvents = false");
            return;
        }
        this.el.parentEl.emit('selectedItem',{type:this.data.type});
    }
  });