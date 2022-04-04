AFRAME.registerComponent('chrono', {
    init: function () {
        this.lastWatch = new THREE.Vector3(0,0,0);
        this.watch = this.el.object3D.position;
        this.timeStart;
        this.timeEnd;
        this.wasMoving = false;
        this.moving = false;
    },
    tick: function(){
        if(this.lastWatch.sub(this.watch).length() < 0.001){
            this.moving = false;
        }else{
            this.moving = true;
        }
        if(!this.wasMoving && this.moving){
            this.timeStart = Date.now();
        }else if(this.wasMoving && !this.moving){
            this.timeEnd = Date.now();
            console.log('movement duration: '+ (this.timeEnd - this.timeStart))
        }
        this.lastWatch.copy(this.watch);
        this.wasMoving = this.moving;
    }
});