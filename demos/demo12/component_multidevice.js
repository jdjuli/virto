AFRAME.registerComponent('multidevice',{
    init: function(){
        if(AFRAME.utils.device.isMobileVR()){          
            this.el.appendChild(this.createController("right"));
            this.el.appendChild(this.createController("left"));
        }else{
            this.applyAttributesPC(this.el);
        }        
    },
    createController: function(hand){
        var controller = document.createElement("a-entity");
        controller.setAttribute("id","hand-"+hand);
        controller.setAttribute("raycaster","showLine: true; far: 20; lineOpacity: 0.5; lineColor: cyan; objects: .cube");
        controller.setAttribute("super-hands","colliderEvent: raycaster-intersection;"+
                                         "colliderEventProperty: els;"+
                                         "colliderEndEvent:raycaster-intersection-cleared;"+
                                         "colliderEndEventProperty: clearedEls;"+
                                         "usePhysics: never;");
        controller.setAttribute("oculus-touch-controls","hand: "+hand);
        return controller;
    },
    applyAttributesPC: function(entity){
        entity.setAttribute("look-controls","");
        entity.setAttribute("capture-mouse","");
        entity.setAttribute("wasd-controls","");
        entity.setAttribute("capture-mouse","");
        entity.setAttribute("cursor","rayOrigin:mouse");
        entity.setAttribute("raycaster","showLine: true; far: 20; lineOpacity: 0.5; lineColor: cyan; objects: .cube");
        entity.setAttribute("super-hands","colliderEvent: raycaster-intersection;"+
                                         "colliderEventProperty: els;"+
                                         "colliderEndEvent:raycaster-intersection-cleared;"+
                                         "colliderEndEventProperty: clearedEls;"+
                                         "usePhysics: never;");
    }
});