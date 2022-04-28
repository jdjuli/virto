AFRAME.registerComponent("code",{init:function(){this.instructions=[],this.previewInstruction=!1,
this.exec=this.exec.bind(this),this.update=this.update().bind(this),this.endPreview=this.endPreview.bind(this),this.
programEl=this.el.closest("[program]"),this.parentUpdatable=this.el.parentEl.components["instruction-conditional"],
this.el.size=new THREE.Vector3(0,0,0),this.mutationObs=new MutationObserver(this.update),this.mutationObs.observe(this.el,
{childList:!0,attributes:!0}),this.el.clone=()=>{let a=document.createElement("a-entity");a.setAttribute("code",{}),
a.size=this.el.size;for(instruction of this.el.getChildEntities())a.appendChild(instruction.clone());return a}},
update:function(){let a,b=new THREE.Vector3(0,0,0);return()=>{let c=this.el.getChildEntities();this.instructions=
[],b.set(0,0,0),this.el.size.set(0,0,0);for(let d=0;d<c.length;d++){let f=c[d],g=f.components.instruction,h=
f.components["instruction-conditional"],i=g||h;i&&!i.initialized&&i.initComponent(),0==d?(b.x=f.size.x/2,a=!1):
b.x+=f.size.x/2+c[d-1].size.x/2,this.el.size.x+=f.size.x,this.el.size.y=Math.max(this.el.size.y,f.size.y),this.el.size.z=
Math.max(this.el.size.z,f.size.z),f.object3D.position.copy(b),i&&(h&&(f.object3D.position.x-=(f.size.x-.6)/2),
i.initialPosition=f.object3D.position.clone(),this.instructions.push(i))}this.parentUpdatable&&this.parentUpdatable.initialized
&&this.parentUpdatable.update()}},remove:function(){this.mutationObs.disconnect()},endPreview:function(){let a=
this.el.getChildEntities();a=a.filter(a=>a.classList.contains("preview"));for(e of a)e.remove();this.programEl.removeState("previewing")},
exec:async function(){return new Promise(async a=>{try{for(instruction of this.instructions)await instruction.exec()}catch(a){console.warn(a)}a()})}});