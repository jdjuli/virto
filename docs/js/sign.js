AFRAME.registerComponent('sign',{
    schema: {
        height:{type:'number', default:0.5},
        width:{type:'number', default:0.5},
        text:{type:'string'},
        wrapCount:{type:'number',default:20}
    },
    init: function(){
        this.el.setAttribute('material',{src:'#sign_background'});
    },
    update: function(){
        this.el.setAttribute('geometry',{primitive:'box',height:this.data.height,width:this.data.width,depth:0.05});
        if(this.data.text){
            this.el.setAttribute('text',{value:this.data.text,align:'center',zOffset:0.026,wrapCount:this.data.wrapCount});
        }
    }
});