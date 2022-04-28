AFRAME.registerComponent('hint', {
    schema:{
        start:{type:'vec3',default:{x:0,y:0,z:0}},
        end:{type:'vec3',default:{x:0,y:0,z:0}},
        text:{type:'string',default:'[Your text here]'},
        signHeight:{type:'number',default:0.5},
        signWidth:{type:'number',default:0.5},
        lineColor:{type:'color',default:'#00ffff'},
        lookAt:{type:'selector',default:'[camera]'}
    },
    init:function(){
        this.line = document.createElement('a-entity');
        this.sign = document.createElement('a-entity');
        this.el.appendChild(this.line);
        this.el.appendChild(this.sign);
        this.tick = this.tick().bind(this);
    },
    update:function(){
        let signPos = Object.assign({},this.data.end);
        signPos.y += this.data.signHeight/2;
        let start = this.data.start.x+' '+this.data.start.y+' '+this.data.start.z;
        let end = this.data.end.x+' '+this.data.end.y+' '+this.data.end.z;
        this.line.setAttribute('tube',{path:[start,end],radius:0.02});
        this.line.setAttribute('material',{color:this.data.lineColor,side:'double'});
        this.sign.setAttribute('sign',{height:this.data.signHeight,width:this.data.signWidth,text:this.data.text});
        this.sign.setAttribute('position',signPos);
    },
    tick: function(){
        let lookAtPos = new THREE.Vector3();
        return ()=>{
            lookAtPos.setFromMatrixPosition(this.data.lookAt.object3D.matrixWorld);
            this.sign.object3D.lookAt(lookAtPos);
        }
    }
});