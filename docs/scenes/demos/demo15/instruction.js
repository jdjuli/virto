AFRAME.registerComponent('instruction',{
    schema: {
        type:{type:'string',default:'init'}
    },
    init: function(){       
        const el = this.el;
        this.constainedTo = null;

        el.setAttribute('class','collidable');
        el.setAttribute('material','color:green');
        el.setAttribute('geometry',{primitive:'box',height:0.1,width:0.1,depth:0.1});
        el.setAttribute('ammo-body',{type:'dynamic',linearDamping:0,emitCollisionEvents:true});
        el.setAttribute('ammo-shape',{type:'box'});
        el.setAttribute('text',{value:this.data.type, zOffset:0.06, align:'center', width:0.5});
        if(this.data.type != 'init'){
            el.setAttribute('grabbable','constraintComponentName:ammo-constraint');
            el.addEventListener('grab-start',function(evt){this.setAttribute('scale','0.5 0.5 0.5');});
            el.addEventListener('grab-end',function(evt){this.setAttribute('scale','1 1 1');});
        }
        
        el.addEventListener('collidestart',this.collisionHandler.bind(this));
    },
    collisionHandler: function(evt){
        let target = evt.detail.targetEl;
        if(!target.components['instruction']) return;
        
        if(this.el.parentEl.components.program && target.components.instruction.constainedTo !== this.el && this.constainedTo != target){
            console.log('añadir:  '+this.data.type+' ==> '+target.components.instruction.data.type);
            if(!target.parentEl.components.program){
                let _target = document.createElement('a-entity');
                _target.setAttribute('instruction',target.getAttribute('instruction'));
                target.remove();
                target = _target
                this.el.parentEl.insertBefore(target,this.el.nextSibling);
            }
            if(this.constainedTo && this.constainedTo != target){
                let oldConstrainedTo = this.constainedTo;
                let lastNode = target;
                while(lastNode.components.instruction.constainedTo && lastNode.components.instruction.constainedTo != target){
                    lastNode = lastNode.components.instruction.constainedTo;
                };
                this.el.removeAttribute('ammo-constraint');
                lastNode.setAttribute('ammo-constraint',{type:'fixed',target:oldConstrainedTo});
                lastNode.components.instruction.constainedTo=oldConstrainedTo;
            }
            this.el.setAttribute('ammo-constraint',{type:'fixed',target:target});
            this.constainedTo = target;
            this.moveInstructions(target);
        }
    },
    tick: function(){
        if(this.constainedTo != null && this.constainedTo.parentEl != null){
            p0 = new THREE.Vector3();
            p1 = new THREE.Vector3();
            this.el.object3D.getWorldPosition(p0);
            this.constainedTo.object3D.getWorldPosition(p1);
            if(p0.distanceTo(p1) >= 0.25){
                //break the constraint
                this.el.removeAttribute('ammo-constraint');
                //create a new entity to change the parent of the current one
                let newEntity = document.createElement('a-entity');
                let oldEntity = this.constainedTo;
                newEntity.setAttribute('position',oldEntity.getAttribute('position'));
                newEntity.setAttribute('instruction',oldEntity.getAttribute('instruction'));
                //I need to initialize the 'instruction' component before accessing the grabbable component.
                newEntity.components.instruction.initComponent();
                //grabbable must be initialized to trick the super-hands component
                newEntity.components.grabbable.initComponent(); 
                //If the 'old entity' had constraints to another entity, the new one must preserve them
                if(oldEntity.components.instruction.constainedTo){
                    oldEntity.removeAttribute('ammo-constraint');
                    newEntity.setAttribute('ammo-constraint',{type:'fixed',target:oldEntity.components.instruction.constainedTo});
                    newEntity.components.instruction.constainedTo = oldEntity.components.instruction.constainedTo;
                }
                /* To trick super-hands:
                 *  · transfer the constraint component
                 *  · add the state 'grabbed' to the new entity
                 *  · add the state {superHand.GRAB_EVENT, newEntity} to the grabbing hand
                 *  · add the entry {grabbingHand, constraint_id} to the dictionary 'constraints' of the 'grabbable' component
                 */
                let constraint = oldEntity.components[oldEntity.getAttributeNames().find(function(a){return a.startsWith('ammo-constraint')})];
                let superHand = constraint.data.target.components['super-hands'];
                newEntity.setAttribute(constraint.attrName, constraint.data);
                newEntity.addState('grabbed');
                superHand.state.set(superHand.GRAB_EVENT,newEntity);
                newEntity.components.grabbable.constraints.set(superHand.el,constraint.id);
                //attach the new entity
                oldEntity.parentEl.parentEl.append(newEntity);
                //remove the old one
                oldEntity.remove();
                //now this entity isn't constrained to anything
                this.constainedTo = null;
            }
        }
    },
    moveInstructions: function(new_instruction){
        position = this.el.getAttribute('position').clone();
        let movingInstruction = new_instruction;
        do{
            position.y += 0.1;
            movingInstruction.setAttribute('ammo-body','type','kinematic');
            movingInstruction.components['ammo-body'].updateComponent()
            movingInstruction.setAttribute('position',position.clone());
            movingInstruction.setAttribute('ammo-body','type','dynamic');
            movingInstruction = movingInstruction.components.instruction.constainedTo;
        }while(movingInstruction && movingInstruction != new_instruction);
    }
  });