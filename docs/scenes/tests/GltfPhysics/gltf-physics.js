//Component inspired on https://githubmemory.com/repo/n5ro/aframe-physics-system/issues/192
AFRAME.registerComponent('gltf-physics',{
    schema: {
      src:{type:'string'},
      bodyType: {type: 'string', default: 'dynamic'},
      shapeType: {type: 'string', default: 'hacd'}
    },
    init:function() {
        this.el.addEventListener('model-loaded',(e)=>{
            this.el.setAttribute('ammo-body',{type:this.data.bodyType});
            this.el.setAttribute('ammo-shape', {type: this.data.shapeType})
        });
        this.el.setAttribute('gltf-model',this.data.src);
    }
});