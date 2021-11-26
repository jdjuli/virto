AFRAME.registerComponent('multidevice',{
    init: function(){
        var camera = document.createElement('a-entity');
        camera.setAttribute('camera','');
        if(AFRAME.utils.device.isMobileVR()){          
            this.el.appendChild(this.createController('right'));
            this.el.appendChild(this.createController('left'));
        }else{
            this.applyAttributesPC(this.el);
        }       
        this.el.appendChild(camera);
    },
    createController: function(hand){
        var controller = document.createElement('a-entity');
        controller.setAttribute('custom-hand',{hand:hand});
        return controller;
    },
    applyAttributesPC: function(entity){
        entity.setAttribute('look-controls','');
        entity.setAttribute('capture-mouse','');
        entity.setAttribute('wasd-controls','acceleration:20');
        entity.setAttribute('capture-mouse','');
        entity.getAttribute('position').y=1.6;
        entity.setAttribute('cursor','rayOrigin:mouse');
        entity.setAttribute('raycaster','showLine: true; far: 20; lineOpacity: 0.5; objects: .collidable');
        entity.setAttribute('super-hands','colliderEvent: raycaster-intersection;'+
                                         'colliderEventProperty: els;'+
                                         'colliderEndEvent:raycaster-intersection-cleared;'+
                                         'colliderEndEventProperty: clearedEls');
    }
});