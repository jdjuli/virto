AFRAME.registerComponent('box-collider',{
    schema: {
      colliderSelector:{type:'string'},
      skipTicks:{type:'number',default:0}
    },
    init: function(){
      this.collidingEls = new Set();
      this.tickCount = 0;
      this.tickModulus = this.data.skipTicks+1;
    },
    update: function(){
      this.objects = Array.from(document.querySelectorAll(this.data.colliderSelector))
      .map((e)=>{return {el:e,semiSize:(new THREE.Box3().setFromObject(e.object3D)).getSize(new THREE.Vector3()).divideScalar(2)};});
    },
    tick: function(){
      if(this.tickCount++ % this.tickModulus != 0) return;
      for(let object of this.objects){
          let worldPos = this.el.object3D.getWorldPosition(this.el.object3D.position.clone());
          let localPos = object.el.object3D.worldToLocal(worldPos);
          let absLocalPos = new THREE.Vector3(Math.abs(localPos.x), Math.abs(localPos.y), Math.abs(localPos.z));
          let distanceVector = (new THREE.Vector3()).subVectors(absLocalPos,object.semiSize);
          if(distanceVector.x < 0 && distanceVector.y < 0 && distanceVector.z < 0){
              if(!this.collidingEls.has(object.el)){
                object.el.emit('collidestart',{targetEl:this.el});
                this.collidingEls.add(object.el);
              }
          }else{
              if(this.collidingEls.has(object.el)){
                object.el.emit('collideend',{targetEl:this.el});
                this.collidingEls.delete(object.el);
              }
          }
      }
    }
});