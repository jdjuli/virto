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
        this.el.size = this.el.size=new THREE.Vector3(0.2,0.5,0.2);
        this.preview = null;
        this.reference = null;
        this.parameter = null;
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
        this.el.setAttribute('grabbable',{constraintComponentName:'ammo-constraint'});

        this.el.addEventListener('dragover-start',this.startPreviewReference);
        this.el.addEventListener('dragover-start',this.startPreviewParameter);
        this.el.addEventListener('drag-drop',this.addReference);
        this.el.addEventListener('drag-drop',this.addParameter);
        this.el.addEventListener('dragover-end',this.endPreview);
        if(this.el.parentElement.getDOMAttribute('code') != null){
            this.el.addEventListener('grab-end',this.grabEndHandler);
            this.el.addEventListener('dragover-start',this.startPreviewInstruction);
            this.el.addEventListener('drag-drop',this.addInstruction);
        }else{
            this.el.setAttribute('draggable','');
        }
        this.mutationObs = new MutationObserver(this.update);
        this.mutationObs.observe(this.el,{childList:true,attributes:true,subtree: true});

        this.el.clone = ()=>{
            let clone = document.createElement('a-entity');
            clone.setAttribute('instruction',this.data);
            clone.size = this.el.size;
            return clone;
        }
    },
    update: function(){
        if(this.data.parameter && !this.parameter){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('parameter',{type:this.data.parameter,function:this.data.function});
            newEntity.setAttribute('position',{x:0, y:0.155, z:0.13});
            this.el.appendChild(newEntity);
            this.parameter = newEntity;
        }else{
            this.parameter = this.el.querySelector('[parameter]');
        }
        if(this.data.reference && !this.reference){
            let newEntity = document.createElement('a-entity');
            newEntity.setAttribute('class','collidable');
            newEntity.setAttribute('reference',{variable:this.data.reference});
            newEntity.setAttribute('position',{x:0, y:0, z:0.13});
            this.el.appendChild(newEntity);
            this.reference = newEntity;
        }else{
            this.reference = this.el.querySelector('[reference]');
        }
        if(this.parameter){
            if(this.parameter.components['parameter'].attrValue.function == this.data.function){
                this.data.parameter = this.parameter.components['parameter'].attrValue.type;
            }else{
                this.parameter.remove();
                this.parameter = null;
            }
        }else{
            this.data.parameter = '';
            this.parameter = null;
        }

        if(this.reference){
            this.data.reference = this.reference.components['reference'].attrValue.variable;
        }else{
            this.data.reference = '';
            this.reference = null;
        }
    },
    remove: function(){
        this.mutationObs.disconnect();
        if(this.el.is('grabbed')){
            let grabber = this.el.components.grabbable.grabber;
            grabber.components['super-hands'].state.forEach((v,k)=>{
                if(!v.attached) grabber.components['super-hands'].state.delete(k);
            });
        }
    },
    grabEndHandler: function(evt){
        this.el.getAttribute('position').copy(this.initialPosition);
    },
    startPreviewReference: function(evt){
        let carried = evt.detail.carried;
        let component = carried.components['reference'];
        if(component && component.type=='integer' && !this.reference && !this.program.is('previewing')){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('obj-model',{obj:'#cylinderZ'});
            preview.setAttribute('position',{x:0, y:0, z:0.13});
            preview.setAttribute('material',{color:'#33ffff',opacity:0.7});
            this.el.appendChild(preview);
            this.program.addState('previewing');
            this.preview = preview;
        }
        evt.stopPropagation();
    },
    startPreviewParameter: function(evt){
        let carried = evt.detail.carried;
        let component = carried.components['parameter'];
        if(component && !this.program.is('previewing') && !this.parameter && component.data.function == this.data.function ){
            let preview = document.createElement('a-entity');
            preview.setAttribute('class','preview');
            preview.setAttribute('geometry',{primitive:'box',height:0.1,width:0.1,depth:0.1});
            preview.setAttribute('position',{x:0, y:0.155, z:0.13});
            preview.setAttribute('material',{color:'#44aa44',opacity:0.7});
            this.el.appendChild(preview);
            this.program.addState('previewing');
            this.preview = preview;
        }
        evt.stopPropagation();
    },
    startPreviewInstruction: function(evt){
        let carried = evt.detail.carried;
        if(!carried.attached) return;
        let instruction = carried.components['instruction'];
        let conditional = carried.components['instruction-conditional'];
        let loop = carried.components['instruction-loop'];
        let component = instruction || conditional || loop;
        if( component && !carried.parentEl.components['code'] && !this.program.is('previewing') && !this.isAncestor(carried)){
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
            
            this.el.parentEl.insertBefore(preview,this.el.nextSibling);
            this.program.addState('previewing');
        }
        evt.stopPropagation();
    },
    endPreview: function(evt){
        if(this.program.is('previewing')){
            if(this.el.parentEl.components['code']) this.el.parentEl.components['code'].endPreview();
            this.program.removeState('previewing');
        }
        if(this.preview){
            this.preview.remove();
            this.preview = null;
        }
        evt.stopPropagation();
    },
    addReference: function(evt){
        let target = evt.detail.dropped;
        if(target == this.el || this.reference) return;
        let component = target.components['reference'];
        if(component && component.type=='integer'){
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
        let dropped = evt.detail.dropped;
        if(!dropped.attached) return;
        let instruction = dropped.components['instruction'];
        let conditional = dropped.components['instruction-conditional'];
        let loop = dropped.components['instruction-loop'];
        let component = instruction || conditional || loop;
        if(component && !dropped.parentEl.components['code'] && !this.isAncestor(dropped)){
            this.el.parentEl.insertBefore(dropped.clone(), this.el.nextSibling);
            dropped.remove();
        }
        evt.stopPropagation();
    },
    tick: function(){
        if(this.el.parentEl.components['code'] && this.initialPosition.distanceTo(this.currentPosition) > 0.3){
            instruction = document.createElement('a-entity');
            position = this.program.object3D.worldToLocal(this.el.object3D.getWorldPosition(new THREE.Vector3()));
            instruction.setAttribute('instruction',this.data);
            instruction.setAttribute('position',position.clone());
            setTimeout(()=>{this.program.appendChild(instruction);},10);
            this.el.remove();
        }
    },
    isAncestor(entity){
        let isAncestor = this.el == entity;
        let ancestor = this.el.parentEl;
        while(!isAncestor && ancestor){
            isAncestor = ancestor==entity;
            ancestor = ancestor.parentEl;
        } 
        return isAncestor;
    },
    exec: function(){
        drone = this.el.sceneEl.querySelector('[drone]').components.drone;
        return ()=>{
            return new Promise((resolve,reject)=>{
                amount = this.reference.components['reference'].get();
                console.log(Date.now());
                console.log('[drone] function: '+this.data.function+" , parameter: "+this.data.parameter+" , reference: "+this.data.reference);
                drone[this.data.function](this.data.parameter,amount);
                setTimeout(()=>{
                    resolve();
                },512);
            });
            
        }
    },
});