AFRAME.registerComponent('go-to-page', {
    schema: {type:'string'},
    init: function () {
        this.redirect = this.redirect.bind(this);

        this.el.setAttribute('class','collidable');
        if(AFRAME.utils.device.isMobileVR()){
            this.el.addEventListener('collidestart',this.redirect); 
            this.el.addEventListener('hitend',this.redirect); 
        }else{
            this.el.setAttribute('clickable','');
            this.el.addEventListener('click',this.redirect); 
        }
    },
    redirect: function() {
        this.el.sceneEl.exitVR();
        const url = this.data;
        window.location.href = this.data + '/#enterVR'
        history.replaceState(null,null,url);
    }
});
