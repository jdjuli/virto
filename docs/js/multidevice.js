AFRAME.registerComponent('multidevice',{
    schema:{
        colliderSelector:{type:'string'},
        acceleration:{type:'number',default:20},
        raycasterFar:{type:'number',default:20},
        pcHeight:{type:'number',default:1.6}
    },
    init: function(){
        var camera = document.createElement('a-entity');
        camera.setAttribute('camera',{});
        if(AFRAME.utils.device.isMobileVR()){          
            this.el.appendChild(this.createController('right'));
            //this.el.appendChild(this.createController('left'));
        }else{
            this.applyAttributesPC(this.el);
        }       
        this.el.appendChild(camera);
    },
    createController: function(hand){
        var controller = document.createElement('a-entity');
        controller.setAttribute('custom-hand',{hand:hand,colliderSelector:this.data.colliderSelector});
        return controller;
    },
    applyAttributesPC: function(entity){
        entity.setAttribute('raycaster',{far: this.data.raycasterFar, objects: this.data.colliderSelector});
        entity.setAttribute('look-controls',{});
        entity.setAttribute('capture-mouse',{});
        entity.setAttribute('wasd-controls',{acceleration:this.data.acceleration});
        entity.getAttribute('position').y+=this.data.pcHeight;
        entity.setAttribute('cursor',{rayOrigin:'mouse'});
        entity.setAttribute('super-hands',{colliderEvent:'raycaster-intersection',
                                           colliderEventProperty: 'els',
                                           colliderEndEvent:'raycaster-intersection-cleared',
                                           colliderEndEventProperty: 'clearedEls'});
    }
});