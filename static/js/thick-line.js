AFRAME.registerComponent('thick-line', {
    schema: {
        start:{type:'vec3',default:{x:0,y:0,z:0}},
        end:{type:'vec3',default:{x:0,y:0,z:0}},
        thickness:{type:'number',default:0.01}
    },
    init: function(){
        this.start = new THREE.Vector3();
        this.end = new THREE.Vector3();                        
    },
    update:function(){
        this.start.set(this.data.start.x,this.data.start.y,this.data.start.z);
        this.end.set(this.data.end.x,this.data.end.y,this.data.end.z);
        this.direction = this.end.clone().sub(this.start);
        this.center = this.start.clone().add(this.direction.clone().divideScalar(2));
        this.rotation = new THREE.Vector3(Math.atan(this.direction.x),
                                          Math.atan(this.direction.y),
                                          Math.atan(this.direction.z));
        this.el.setAttribute('geometry',{primitive:'cylinder',
                                         height:this.direction.length(),
                                         radius:this.data.thickness/2,
                                         'segments-height':1, 
                                         'segments-radial':9});
        this.el.setAttribute('position',this.center);
        this.el.setAttribute('rotation',this.rotation.multiplyScalar(180/Math.PI));
    }
});