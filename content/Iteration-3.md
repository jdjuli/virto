---
title: "Iteration 3"
date: 2021-08-19T16:56:21+02:00
draft: false
---

On this iteration, the main objectives are:
+ Ensure that the scenes can be used on PC and Oculus Quest.
+ Create an element specifically intended for executing the program (a "run" button)
+ Modify the program component so it creates a platform on which, by dropping the blocks, the user can create the program.

## Scenes created
- Demonstration of component "multidevice"
On this scene, the component `multidevice` takes care of detecting if the device is a VR headset or not and on each case, initializes the corresponding controllers. The figures in front of the camera can be grabbed making use of the cursor if we access the page on a PC and with the VR controllers if we are using the Oculus Quest headset.
This component depends on the [super-hands](https://github.com/wmurphyrd/aframe-super-hands-component) component to work and we can use it as follows:
```html 
<a-entity   multidevice position="0 0 0.8">     
    <a-entity camera></a-entity> 
</a-entity>
```

![](/img/demo12_PC.gif)
*On PC, you can grab the entities and move them by clicking on them.*

![](/img/demo12_VR.gif)
*On Oculus Quest, you'll need to point to the entities and push any of the buttons of the controller to grab them.*

*=>* Checkout the [Demo](/vr-programming/demos/demo12) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo12/index.html) *<=*

- Cloneable entities
Throught the component `clonable` we specify that an entity must be clonated when it past a certain distance from it's original position, this distance is by default 3 meters, but can be overwritten with the parameter `distance`.
The scene is very similar to the previous one, but this time we have the objects on the right side of the table and each time we grab one and move it further than 0.3 meters from it's original position, a new entity with the same properties is created on that position.

![](/img/demo13_PC.gif)
*As soon as you click over an entity and move it far from it's initial position, it will be cloned.*

![](/img/demo13_VR.gif)
*The way of grabbing an entity changes, but the behaviour remains the same in VR.*

*=>* Checkout the [Demo](/vr-programming/demos/demo13) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo13/index.html) *<=*

- Component 'program'
By it's dimensions, this scene is meant to be used on the PC, further iterations will be more confortable to use with an VR headset. It makes use of a component called `programa` to modelize the sequence of instructions and provide a way to execute them.
The blue blocks represent the action 'down' and the red ones, 'up' and they are added to the program by letting them fall on to the blue platform. To execute the program, we have to click the green box with the text 'ejecutar'.

![](/img/demo14_PC.gif)
*To create a program you'll need to grab the blue and red boxes and make them touch the blue platform. To execute the program, simply click the green box and to remove an instruction, grab it and move it outside the blue platform.*

![](/img/demo14_VR.gif)
*This scene requires a big space to be test on VR, but if you don't have it, try to move the boxes up and let them fall to bring them closer to you*

*=>* [Demo](/vr-programming/demos/demo14) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo14/index.html) *<=*

## Problems encountered
When I was testing the `multidevice` component I faced up an issue related to the Y coordinate of the camera position, that on PC matches the one of the entity that contains the `camera` component, but when using the Oculus Quest, A-Frame takes the height of the headset and adds it to the position of the entity, which results on a very unnatural perspective and many difficulties to interact with the rest of the entities of the scene. The solution was to ignore the height of the camera when initializing the `multidevice` component on an VR headset, so the height of the camera is only determined by the height of the headset.

Reparenting them wasn't also trivial, because simply reparenting them on the DOM causes many problems related with the reinitialization of the components, like crashing the physics engine, to mention one. After some days thinking ways to reparent entities (I wasn't considering cloning them on the new parent and deleting the old copy because I thought that it would impact heavily on the performance), the solution came from a [gitmemory written by my mentor](https://www.gitmemory.com/issue/aframevr/aframe/2425/753673035) and on which he recommends the strategy of clone & delete that I was avoiding, but after implementing it, the results were awensome and it proved me wrong about the performance drop.

While developing the `program` component I had again problems with the physics engine, this time the problem was that once an instruction block is on the program and the user wants to remove it (by simply grabbing it out the stack of blocks), it becomes `kinematic` instead of `dynamic`, ignoring the `type: dynamic` parameter of the `ammo-body` component attached to that entity. This is still visible on the [Demo 14](/demos/demo14) as I havent found a solution yet, but probably I'll take another aproach and instead of allowing the user to recycle the instruction blocks, I'll remove them so the next time the user wants to use that instruction, they will have to pick it from it`s source.