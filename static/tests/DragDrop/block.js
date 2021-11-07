AFRAME.registerComponent('block',{
    schema: {},
    init: function(){
        this.el.setAttribute('class','collidable');
        this.el.setAttribute('draggable','');
        this.el.setAttribute('grabbable','');
        this.el.setAttribute('droppable','');
        this.el.setAttribute('material',{color:'blue'});
        this.el.addEventListener("dragover-start",this.startPreview.bind(this));
        this.el.addEventListener("dragover-end",this.endPreview.bind(this));
        this.el.addEventListener("drag-drop",(e)=>{console.log("drag-drop: "+e);});
    },
    startPreview: function(evt){
        this.previewEl = document.createElement('a-entity');
        this.previewEl.setAttribute('geometry',evt.detail.carried.getAttribute('geometry'));
        this.previewEl.setAttribute('material',{color:'cyan',opacity:0.5});
        let position = this.el.getAttribute('position').clone();
        position.y += 0.1;
        this.previewEl.setAttribute('position',position);
        this.el.parentEl.appendChild(this.previewEl);
    },
    endPreview: function(evt){
        if(this.previewEl){
            this.previewEl.remove();
            this.previewEl = null;
        }
    }
});