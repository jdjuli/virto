//Component inspired on https://githubmemory.com/repo/n5ro/aframe-physics-system/issues/192
AFRAME.registerComponent('gltf-physics',{
    schema: {
      src:{type:'string'},
      bodyType: {type: 'string', default: 'dynamic'},
      shape: {type: 'string', default: 'hull'}
    },
    init:function() {
        this.el.setAttribute('ammo-body',{type:this.data.bodyType});
        this.el.addEventListener('body-loaded',(e)=>{
            this.el.setAttribute('ammo-shape', {type: this.data.shapeType})
        })
    }
});