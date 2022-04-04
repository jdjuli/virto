AFRAME.registerComponent('events',{
    init: function(){  
        this.el.addEventListener('pinchstarted',(()=>{
            el = this.el;
            return (evt)=>{
            console.log('[pinchstarted] '+evt);
            }
        })());
        this.el.addEventListener('pinchended',((evt)=>{
            console.log('[pinchended] '+evt);
        }).bind(this));
    }
});