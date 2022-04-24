AFRAME.registerComponent('program-controls', {
    schema: {btnHeight:{type:'number',default:0.075},
             btnWidth:{type:'number',default:0.175}},
    init: function () {
        this.previewInstruction = this.previewInstruction.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.programEl = this.el.parentEl;
        this.codeEl = this.programEl.components['program'].codeEl;

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('geometry',{primitive:'box',height:0.6,width:0.3,depth:0.3});
        this.el.setAttribute('material','color','cyan');
        this.el.setAttribute('droppable','');
        this.el.addEventListener('dragover-start',this.previewInstruction);
        this.el.addEventListener('dragover-end',this.endPreview);
        this.el.addEventListener('drag-drop',this.addInstruction);

        this.btnRunEl = document.createElement('a-entity');
        this.btnRunEl.setAttribute('emit-event-button',{event:'run',emitTo:this.el.parentEl,text:'RUN',height:this.data.btnHeight,width:this.data.btnWidth});
        this.btnRunEl.setAttribute('position',{x:0,y:0.2,z:0.15});
        this.btnResetEl = document.createElement('a-entity');
        this.btnResetEl.setAttribute('emit-event-button',{event:'reset',emitTo:this.el.parentEl,text:'RESET',height:this.data.btnHeight,width:this.data.btnWidth});
        this.btnResetEl.setAttribute('position',{x:0,y:0.05,z:0.15});

        this.el.appendChild(this.btnRunEl);
        this.el.appendChild(this.btnResetEl);
    },
    previewInstruction: function(evt){
        let carried = evt.detail.carried;
        let instruction = carried.components['instruction'];
        let conditional = carried.components['instruction-conditional'];
        let loop = carried.components['instruction-loop'];
        let component = instruction || conditional || loop;
        if(component && !this.programEl.is('previewing')){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            if(instruction){
                preview.setAttribute('obj-model',{obj:'#instruction'});
                preview.size=carried.size;
            }else if(conditional){
                preview.setAttribute('obj-model',{obj:'#condition_preview'});
                preview.size=carried.minSize;
            }else if(loop){
                preview.setAttribute('obj-model',{obj:'#loop_preview'});
                preview.size=carried.minSize;
            }
            preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.codeEl.prepend(preview);
            this.programEl.addState('previewing');
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.programEl.is('previewing')){
            this.codeEl.components['code'].endPreview();
        }
        evt.stopPropagation();
    },
    addInstruction: function(evt){
        let dropped = evt.detail.dropped;
        if(!dropped.attached) return;
        let instruction = dropped.components['instruction'];
        let conditional = dropped.components['instruction-conditional'];
        let loop = dropped.components['instruction-loop'];
        let component = instruction || conditional || loop;
        if(component && !dropped.parentEl.components['code'] && !this.isAncestor(dropped)){
            this.codeEl.prepend(dropped.clone());
            dropped.remove();
        }
        evt.stopPropagation();
    },
    isAncestor(entity){
        let isAncestor = this.el == entity;
        let ancestor = this.el.parentEl;
        while(!isAncestor && ancestor){
            isAncestor = ancestor==entity;
            ancestor = ancestor.parentEl;
        } 
        return isAncestor;
    }
});