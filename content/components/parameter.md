---
title: "parameter"
date: 2021-11-20T13:33:43+01:00
draft: false
---

# Purpose
This component is intended to store and represent qualitative parameters for the instructions, like the direction of displacements or axis of rotations among others.

# Schema
  - attribute name: n/a
    - description: qualitative property such as direction of movement or axis of rotation
    - type: string
    - default: `up`
    - oneOf: `up`, `down`, `left`, `right`, `forward`, `backward` (more to be added)

# Usage
The entity this component is attached to must be children of another entity with the component _ide_ as this one is aware of if it's a child of an _instruction_ and needs to have a reference to the _ide_ entity to reparent to it when extracted from the _instruction_.

If you want to attach an _argument_ to an _instruction_ on your scene, don't nest the _argument_ inside the _instruction_ but set the proper attribute of the _instruction_ component and it will create the _argument_ during it's initialization.

# Implementation

The _argument_ component has primarly two states:
  - Attached to an _instruction_:
    On this case, during the initialization, the entity will have the components `ammo-body` (static, emit collision events) and `ammo-shape` attached to it, as well as a 'collidestart' event handler that reparents the entity to the _ide_ in case that it collides with another entity with the class _finger_, which is intended to be used on the index fingers of the hands.
  - Attached to the _ide_: 
    The entity will have the components `ammo-body` (dynamic, zero-gravity), `ammo-shape`, `grababble` and `draggable` attached to it, and if it's dropped near an instruction, it will be attached to it (this behaviour is implemented on the `instruction` component).

This flowchart sums up the states of this component:
![](/vr-programming/img/component_parameter_flowchart.png)

# Examples

Simplest scene for VR headset featuring three parameters (play with it [here](/vr-programming/scenes/examples/parameter.html))

```
  <a-scene physics="driver: ammo">
    <a-entity ide="" position="0 0.75 -0.5">
      <a-entity position="-0.4 0.4 0" argument="left" class="collidable"></a-entity>
       <a-entity position="  0 0.4 0" argument="up" class="collidable"></a-entity>
       <a-entity position="0.4 0.4 0" argument="right" class="collidable"></a-entity>
    </a-entity>
    <a-entity>
      <a-entity camera=""></a-entity>
      <a-entity sphere-collider="objects:.collidable" hand-controls="hand:left" super-hands ammo-body="type:kinematic" ammo-shape="type:sphere;fit:manual;sphereRadius:0.01">
      <a-entity sphere-collider="objects:.collidable" hand-controls="hand:right" super-hands ammo-body="type:kinematic" ammo-shape="type:sphere;fit:manual;sphereRadius:0.01">
    </a-entity>
  </a-scene>
```