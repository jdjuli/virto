randomColor = ()=>{
    return'#'+(Math.round(Math.random()*0xffffff)).toString(16);
};

AFRAME.registerComponent('instruction',{
    schema: {
        function:{type:'string',default:'move'},
        parameter:{type:'string'},
        reference:{type:'string'}
    },
    init: function(){  
        this.preview = false;
        this.currentPosition = this.el.object3D.position;
        this.initialPosition = this.currentPosition.clone();
        this.program = this.el.closest('[program]');

        this.exec = (this.exec()).bind(this);
        this.startPreviewReference = this.startPreviewReference.bind(this);
        this.startPreviewParameter = this.startPreviewParameter.bind(this);
        this.startPreviewInstruction = this.startPreviewInstruction.bind(this);
        this.endPreview = this.endPreview.bind(this);
        this.addReference = this.addReference.bind(this);
        this.addParameter = this.addParameter.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.update = this.update.bind(this);
        this.grabEndHandler = this.grabEndHandler.bind(this);

        this.el.setAttribute('class','collidable');
        this.el.setAttribute('obj-model',{obj:'#instruction'});
        this.el.setAttribute('material',{src:'#instruction_'+this.data.function});
        this.el.setAttribute('droppable','');
        this.el.setAttribute('grabbable','');

        this.el.addEventListener('dragover-start',this.startPreviewReference);
        this.el.addEventListener('dragover-start',this.startPreviewParameter);
        this.el.addEventListener('drag-drop',this.addReference);
        this.el.addEventListener('drag-drop',this.addParameter);
        this.el.addEventListener('dragover-end',this.endPreview);
        if(this.program && this.program!=this.el.parentEl){
            this.el.addEventListener('grab-end',this.grabEndHandler);
            this.el.addEventListener('dragover-start',this.startPreviewInstruction);
            this.el.addEventListener('drag-drop',this.addInstruction);
        }else{
            this.el.setAttribute('draggable','');
        }
        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true});
    },
    update: function(){
        if(this.data.parameter && !this.parameter){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('parameter',{type:this.data.parameter,function:this.data.function});
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.13});
            this.el.appendChild(newEntity);
            this.parameter = true;
        }
        if(this.data.reference && !this.reference){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('reference',{variable:this.data.reference});
            newEntity.setAttribute('position',{x:0, y:0, z:0.13});
            this.el.appendChild(newEntity);
            this.reference = true;
        }
        let parameter = this.el.querySelector('[parameter]');
        let reference = this.el.querySelector('[reference]');
        if(parameter){
            if(parameter.components['parameter'].attrValue.function == this.data.function){
                this.data.parameter = parameter.components['parameter'].attrValue.type;
            }else{
                parameter.remove();
            }
        }else{
            this.data.parameter = '';
            this.parameter = false;
        }

        if(reference){
            this.data.reference = reference.components['reference'].attrValue.variable;
        }else{
            this.data.reference = '';
            this.reference = false;
        }
    },
    remove: function(){
        this.mutationObs.disconnect();
    },
    grabEndHandler: function(evt){
        this.el.getAttribute('position').copy(this.initialPosition);
    },
    startPreviewReference: function(evt){
        let carried = evt.detail.carried;
        if(carried.components['reference'] && !this.preview && !this.reference){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('obj-model',{obj:'#cylinderZ'});
            preview.setAttribute('position',{x:0, y:0, z:0.13});
            preview.setAttribute('material',{color:'#33ffff',opacity:0.7});
            this.el.appendChild(preview);
            this.preview = true;
        }
        evt.stopPropagation();
    },
    startPreviewParameter: function(evt){
        let carried = evt.detail.carried;
        let component = carried.components['parameter'];
        if(component && !this.preview && !this.parameter && component.data.function == this.data.function ){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('geometry',{primitive:'box',height:0.1,width:0.1,depth:0.1});
            preview.setAttribute('position',{x:0, y:0.155, z:0.13});
            preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.el.appendChild(preview);
            this.preview = true;
        }
        evt.stopPropagation();
    },
    startPreviewInstruction: function(evt){
        let carried = evt.detail.carried;
        let component = carried.components['instruction'];
        if(component && !this.program.components['program'].codeEl.components['code'].previewInstruction){
            let moveFollowing = false;
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('obj-model',{obj:'#instruction'});
            preview.setAttribute('position',{x:0.2, y:0, z:0});
            preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.el.appendChild(preview);
            for(let el of this.el.parentEl.children){
                if(moveFollowing){
                    el.components['instruction'].currentPosition.x+=0.2;
                    el.components['instruction'].initialPosition.x+=0.2;
                }
                if(el == this.el) moveFollowing = true;
            }
            this.preview = true;
            this.program.components['program'].codeEl.components['code'].previewInstruction = true;
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.preview){
            let els = Array.prototype.slice.apply(this.el.querySelectorAll('.preview'));
            for(el of els){
                el.remove();
            }
            this.preview = false;
            if(this.program.components['program'].codeEl.components['code'].previewInstruction){
                let moveFollowing = false;
                for(let el of this.el.parentEl.children){
                    if(moveFollowing && el.components['instruction'].initialized){
                        el.components['instruction'].currentPosition.x-=0.2;
                        el.components['instruction'].initialPosition.x-=0.2;
                    }
                    if(el == this.el) moveFollowing = true;
                }
                this.program.components['program'].codeEl.components['code'].previewInstruction = false;
            }
        }
        evt.stopPropagation();
    },
    addReference: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.reference) return;
        let component = target.components['reference'];
        if(component){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('reference',component.data);
            newEntity.setAttribute('position',{x:0, y:0, z:0.13});
            this.reference = newEntity;
            this.data.reference = component.data.variable;
            this.el.appendChild(newEntity);
            target.remove();
        }
        evt.stopPropagation();
    },
    addParameter: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.parameter) return;
        let component = target.components['parameter'];
        if(component && component.data.function == this.data.function){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('parameter',component.data);
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.13});
            this.parameter = newEntity;
            this.data.parameter = component.data.type;
            this.el.appendChild(newEntity);
            target.remove();
        }
        evt.stopPropagation();
    },
    addInstruction: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el) return;
        let component = target.components['instruction'];
        if(component){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('instruction',component.data);
            this.el.parentNode.insertBefore(newEntity, this.el.nextSibling);
            target.remove();
        }
        evt.stopPropagation();
    },
    exec: function(){
        drone = this.el.sceneEl.querySelector('[drone]').components.drone;
        return (program,findVariable)=>{
            amount = findVariable(this.data.reference).get();
            console.log('[drone] function: '+this.data.function+" , parameter: "+this.data.parameter+" , reference: "+this.data.reference);
            drone[this.data.function](this.data.parameter,amount)
        }
    },
    tick: function(){
        if(this.program && this.program!=this.el.parentEl && this.initialPosition.distanceTo(this.currentPosition) > 0.3){
            instruction = document.createElement('a-entity');
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition());
            instruction.setAttribute('instruction',this.data);
            instruction.setAttribute('position',position);
            setTimeout(()=>{this.program.appendChild(instruction);},10);
            this.el.remove();
        }
    }
});