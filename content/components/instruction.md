---
title: "instruction"
date: 2021-11-22T10:42:11+01:00
draft: false
---

# Purpose
This component represents an action inside the program, which can be parametrized by attaching a `parameter` and a `amount` (not implemented yet)

# Schema
  - attribute name: function
    - type: string
    - default: `move`
    - oneOf: `move`, `rotate`
  - attribute name: parameter
    - type: string
    - oneOf: `up`, `down`, `left`, `right`, `forward`, `backward` (more to be added)
  - attribute name: amount
    - type: number
    - default: 1.0

# Usage
The entity that has this component attached must be placed inside another with the component _ide_ attached to it, but is not needed to put the _instruction_ inside a program (and not recommended right now as it's under development). Keeping both things in mind, the best way to use it is to put it inside the _ide_ as a sibling of a _program_, as the user will be able to attach this _instruction_ to the _program_ manually.

To add the instruction to a program, the user only has to drop it near it and it will attach it and move the instructions that already are part of it accordingly to fit the new instruction. On the other hand, to remove the instruction, the user has to collide a .finger entity with the instruction icon (on that part of the geometry there is a box listening to this kind of collision), and the instruction will pop out the program, moving the other instructions to fill the place.

# Implementation

The _instruction_ component has primarly two states:
  - Attached to a _program_:
    On this case the entity has the component `ammo-body` (static, emit collision events) and the `collideend` event listener set to the function _collisionHandler(evt)_.
  - Attached to the _ide_: 
    The entity will have the components `ammo-body` (dynamic, zero-gravity), `grababble` and `draggable` attached.

On both cases, the components `ammo-shape` and `droppable` are always attached, as well as handlers to the events `drag-drop` (meant to attach a parameter to the instruction), `dragover-start` (to start the preview of a parameter) and `dragover-end` (to end the parameter preview).

Also, by the end of the initialization of the component, I check if the attribute `parameter` is defined, to create a child `parameter` entity with the appropiate value.

This flowchart sums up the states of this component:
![](/vr-programming/img/component_instruction_flowchart.png)

# Examples

Simplest scene for VR headset featuring three instructions an a free parameter meant to be placed on any of the two instructions that doesn't have it placed (play with it [here](/vr-programming/scenes/examples/instruction.html))

```
  <a-scene physics="driver: ammo">
    <a-entity ide="" position="0 0.75 -0.5">
      <a-entity position="-0.4 0.4 0" instruction="function:move;parameter:up"></a-entity>
      <a-entity position="  0 0.4 0" instruction="function:move"></a-entity>
      <a-entity position="0.4 0.4 0" instruction="function:rotate"></a-entity>
      <a-entity position="0.8 0.4 0" parameter="right"></a-entity>
    </a-entity>
    <a-entity>
      <a-entity camera=""></a-entity>
      <a-entity sphere-collider="objects:.collidable" hand-controls="hand:left" super-hands ammo-body="type:kinematic" ammo-shape="type:sphere;fit:manual;sphereRadius:0.01">
      <a-entity sphere-collider="objects:.collidable" hand-controls="hand:right" super-hands ammo-body="type:kinematic" ammo-shape="type:sphere;fit:manual;sphereRadius:0.01">
    </a-entity>
  </a-scene>
```