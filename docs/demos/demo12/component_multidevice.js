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
        controller.setAttribute("raycaster","showLine: true; far: 20; lineOpacity: 0.5; objects: .raycastable");
        controller.setAttribute("sphere-collider","objects: .raycastable");
        controller.setAttribute("static-body","shape: sphere; sphereRadius: 0.02");
        controller.setAttribute("super-hands","colliderEvent: raycaster-intersection;"+
                                              "colliderEventProperty: els;"+
                                              "colliderEndEvent:raycaster-intersection-cleared;"+
                                              "colliderEndEventProperty: clearedEls");
        controller.setAttribute("oculus-touch-controls","hand: "+hand);
        return controller;
    },
    applyAttributesPC: function(entity){
        entity.setAttribute("look-controls","");
        entity.setAttribute("capture-mouse","");
        entity.setAttribute("wasd-controls","acceleration:10");
        entity.setAttribute("capture-mouse","");
        entity.getAttribute("position").y=1.6;
        entity.setAttribute("cursor","rayOrigin:mouse");
        entity.setAttribute("raycaster","showLine: true; far: 20; lineOpacity: 0.5; objects: .raycastable");
        entity.setAttribute("super-hands","colliderEvent: raycaster-intersection;"+
                                         "colliderEventProperty: els;"+
                                         "colliderEndEvent:raycaster-intersection-cleared;"+
                                         "colliderEndEventProperty: clearedEls");
    }
});