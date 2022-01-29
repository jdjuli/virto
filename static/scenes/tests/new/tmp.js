AFRAME.registerComponent('tmp',{
    schema: {
    },
    init: function(){
        this.el.addEventListener('grab-start',()=>{
            this.el.setAttribute('material','color','blue');
            this.el.setAttribute('ammo-body','activationState','active');
        });
        this.el.addEventListener('grab-end',()=>{
            this.el.setAttribute('material','color','red');
            this.el.setAttribute('ammo-body','activationState','disableSimulation');
        });
    }
});

function extractPointsFromGeometry(geometry){
    let points = [];
    let position = geometry.attributes.position.array;
    for(i = 0 ; i < position.length ; i+=3){
        points.push(new THREE.Vector3(position[i],position[i+1],position[i+2]));
    }

    points = points.reduce((acc,curr)=>{
        if(!acc.some((v)=>v.equals(curr))){
            acc.push(curr);
        }
        return acc;
    },[]);

    return points;
}