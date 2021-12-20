---
title: "value"
date: 2021-12-16T10:16:54+01:00
draft: false
---

# Purpose
This component manages an entity that represent a numeric value inside the program, it can be a variable registered on [variables-state](/vr-programming/components/variables-state) or a constant.

# Schema
  - attribute name: variable
    - description: variable name to get value from, if it doesn't exist, it will be created with the value provided. Don't set it to represent a constant
    - type: string
  - attribute name: value
    - description: numeric value, if variable name is set but doesn't exist, the variable will take this value, but if it exist, this value will be ignored
    - type: number
  - attribute name: display
    - description: what to show on the entity, either the numeric value or the variable name (if no variable name is set, it'll display '#')
    - type: string
    - default: `VALUE`
    - oneOf: `VALUE`, `NAME`

# Usage
Import the component with:
```html
<script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/value.js"></script>
<!-- To have the variable behaviour, you'll need to import also this scripts -->
<script src="https://unpkg.com/aframe-state-component@7.1.0/dist/aframe-state-component.js"></script>
<script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/variables-system.js"></script>
```
Add the following asset inside your `<a-scene>`
```html
<a-assets>
  <a-asset-item id="cylinderZ" src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/models/cylinderZ.obj"></a-asset-item>
</a-assets>
```
This component should be placed on entities under another entity with the component `ide` attached, as it's reference is needed to detach it from [instructions](/vr-programming/components/variables-state). The usage of the attributes might be confusing, but here's a summary of what do you have to set depending on your use case:
| use case | variable | value | display |
|---|---|---|---|---|
| new variable | ✓ | ✓ | up to you |
| existing variable | ✓ | ✗ | up to you |
| constant | ✗ | ✓ | up to you |

# Implementation

During the initialization of the component, horizontal z-axis cylinder geometry is set to the entity and the interaction components are set (if the entity is inside a program, it will only react to collidestart events, but if it's outside, it won't react to them and will be _grabbable_ and _draggable_). A text component is attached to the entity to display either the name of the variable or a numeric value.

Later, if a variable name is set, the component checks if it exist, to create it if not and, in either case subscribe to variable updates to keep the value updated.

On component update, an unsubscription to variable updates is made to avoid multiple subscription and, if variable name is now set, the component subscribe to updates again and forces the first to ensure the variable is read and well represented. If variable name is not set, the component update the text component of it's entity to show `#` if display is set to `NAME` or the value (with one decimal digit) if display is set to `VALUE`.

The collision handler behaviour varies depending on if the component is configured as a variable or as a constant. On the first case, the entity is removed from the [instruction](/vr-programming/components/instruction) and reparented to the `ide` component's entity moving it a bit forward (+Z axis), and on the second case, the entity is also removed but not reparented.

# Examples

Simplest scene for VR headset featuring three instructions an a free parameter meant to be placed on any of the two instructions that doesn't have it placed (play with it [here](/vr-programming/scenes/examples/value.html))

```
  <a-scene>
    <a-assets>
      <!--Assets for the value component-->
      <a-asset-item id="cylinderZ" src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/models/cylinderZ.obj"></a-asset-item>
      <!--Assets to display the instruction-->
      <a-asset-item id='instruction' src='https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/models/instruction.obj'></a-asset-item>
      <img id='instruction_move' src='https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/textures/instruction_move.png'></img>
    </a-assets>
    <!--Value with inititialization of PI=3.14-->
    <a-entity value="variable:PI;value:3.14;display:VALUE" position="-0.6 1.6 -1"></a-entity>
    <!--Display only the name of the variable (it`s value is internally stored)-->
    <a-entity value="variable:PI;display:NAME" position="-0.4 1.6 -1"></a-entity>
    <!--Display the value of a variable set previously-->
    <a-entity value="variable:PI;display:VALUE" position="-0.2 1.6 -1"></a-entity>
    <!--Display a constant-->
    <a-entity value="value:2.71;display:VALUE" position="0 1.6 -1"></a-entity>
    <!--Instruction with a variable attached-->
    <a-entity instruction="function:move;amount:PI" position="0.2 1.6 -1"></a-entity>
    <!--Instruction with a constant attached-->
    <a-entity instruction="function:move;amount:98.7" position="0.5 1.6 -1"></a-entity>
  </a-scene>
```