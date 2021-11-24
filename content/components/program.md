---
title: "program"
date: 2021-11-24T09:33:24+01:00
draft: false
---

# Purpose
Represent a program, containing all the instructions and a reference to the target of execution

# Schema
  - attribute name: active
    - description: whether the program should display it's instructions or not
    - type: boolean
    - default: true

# Usage
This component should be placed inside an `ide` entity, and as the program grows on the positive X axis, keep that in mind when positioning it on the scene. 

## To-Do
This component is being developed right now, here are the thing I've planned for it but are not implemented yet:
 - Preview of instructions:
 - Execution of the program
   - Select the entity over which the program would execute
 - Close the program (minimize it)
 - Move the program on runtime

# Implementation

The _program_ component registers a listener for the 'drag-drop' event, and has attached the component 'droppable', so when an `instruction` entity is dragged over the program and dropped, it is added as the first program's instruction and the instructions that were already added are moved to fit the new one.

This component handles also the deletion of instructions, which is made by destroying the entity and moving back all the instructions that followed it so no empty space is left.

# Examples

On this example you'll see the program and two instructions that can be grabbed to be added to the program. To remove an instruction from the program, make the 'pointing' gesture with any of the hands and push the icon of the instruction (play with it [here](/vr-programming/scenes/examples/program.html))

```
  <a-scene physics="driver: ammo; debug: true;">
    <a-entity ide position="0 0.75 -0.5">
        <a-entity   position="-0.4 0.4 0"
                    program></a-entity>
        <a-entity   position="0.0 0.4 0"
                    instruction="function:move"></a-entity>
        <a-entity   position="0.4 0.4 0"
                    instruction="function:rotate"></a-entity>
    </a-entity>
    <a-entity multidevice></a-entity>
  </a-scene>
```
