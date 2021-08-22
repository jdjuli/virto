AFRAME.registerComponent('esfera_parametrica',{
    schema:{
        radio: {type:'float',default:1.0},
        color: {type:'string',default:'black'}
    },
    init: function(){
        var data = this.data;
        var el = this.el;

        this.geometry = new THREE.SphereBufferGeometry(data.radio, 10, 10);
        this.material = new THREE.MeshBasicMaterial({color:data.color});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        el.setObject3D('mesh', this.mesh);
    },
    update: function(oldData){
        var el = this.el;
        var data = this.data;

        if(Object.keys(oldData).length === 0) { return; }

        if(oldData.color !== data.color){
            el.getObject3D('mesh').material.color = new THREE.Color(data.color);
        }
        if(oldData.radio !== data.radio){
            el.getObject3D('mesh').geometry = new THREE.SphereBufferGeometry(data.radio, 10, 10)
        }
    }

});