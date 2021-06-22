AFRAME.registerComponent('hace_saltar',{
    schema:{
        target:{type:"string"}
    },
    init: function(){
        const _this = this;  
        if(this.data.target === undefined){
            this.target = this;
        }else{
            this.target = this.el.sceneEl.querySelector(this.data.target);
        }
        //Creo el click listener
        this.clickListener = function(){
            _this.target.emit('salta')
        };
        //Establezco el click listener
        this.el.addEventListener("click",this.clickListener);
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
        this.el.removeEventListener(this.clickListener);
    }
});