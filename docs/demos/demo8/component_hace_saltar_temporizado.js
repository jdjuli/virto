AFRAME.registerComponent('hace_saltar_temporizado',{
    schema:{
        target:{type:"string"},
        cada_ms:{type:"int", default:1000}
    },
    init: function(){
        const _this = this;  
        if(this.data.target === undefined){
            this.target = this;
        }else{
            this.target = this.el.sceneEl.querySelector(this.data.target);
        }
        this.timer = window.setInterval(function(){
            _this.target.emit('salta');
        },this.data.cada_ms);
    },
    update: function(oldData){
        if(this.data.target !== oldData.target){
            if(this.data.target === undefined){
                this.target = this;
            }else{
                this.target = this.el.sceneEl.querySelector(this.data.target);
            }
        }
    },
    remove: function(){
        window.clearInterval(this.timer);
    }
});