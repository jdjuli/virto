AFRAME.registerComponent('recyclebin',{
    init: function(){       
        this.el.setAttribute('gltf-model','/vr-programming/models/recyclebin.gltf');     
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
        this.el.setAttribute('droppable','');
        this.el.addEventListener('drag-drop',(evt)=>{evt.detail.dropped.remove();});
        this.el.addEventListener('dragover-start',(this.previewRemoval.bind(this)));
        this.el.addEventListener('dragover-end',this.endPreviewRemoval.bind(this));
    },
    previewRemoval: function(evt){
        let entity = evt.detail.carried;
        entity.setAttribute('model-opacity',0.5);
    },
    endPreviewRemoval: function(evt){
        let entity = evt.detail.carried;
        entity.removeAttribute('model-opacity');
    }
});