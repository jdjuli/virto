---
title: "multidevice"
date: 2021-11-22T20:06:19+01:00
draft: false
---

# Purpose
This component adapts the user controls to the inputs of the device that is using, making easier to develop scenes compatibles with both VR headsets and PC.

# Schema
  - attribute name: colliderSelector
    - description: Selector of entities the user can interact with
    - type: string (valid CSS selector)
  - attribute name: acceleration
    - description: How fast can the user navigate the scene with the arrow keys
    - type: number
    - default: 20.0
  - attribute name: raycasterFar
    - description: How long will the raycaster search for colliding entities
    - type: number
    - default: 20.0
  - attribute name: pcHeight
    - description: Height of the camera when the scene is used on PC
    - type: number
    - default: 1.6

# Usage
The `custom-hand` component is required to be imported on the HTML in order to make the component work properly on VR headsets as it's responsible of creating the virtual hands and defining their behaviour.

To use the component, simply create an `<a-entity>` tag where the user should be on the scene and attach the `multidevice` attribute to it, specifying the selector of the entities that they will be able to interact with. You don't need to create anything else, as `multidevice` will detect the type of the device accesing the page and create the required entities and components.

# Implementation

In order to detect if the user has a VR-compatible device, the function `AFRAME.utils.device.isMobileVR()` is called and if it returns:
  - true:
    A VR-compatible device is being used, the component will instanciate two 'a-entity' and set the `custom-hand` attribute on both to create the hands. The position of the camera will not be modified in height as this information is provided by the headset.
  - false: 
    A PC (or equivalent) is being used and hence, the camera height is incremented in `pcHeight` meters and the components `raycaster`, `look-controls`, `capture-mouse`, `wasd-controls`, `cursor` and `super-hands` are attached to the entity to ensure the user can move through the scene with the arrow keys of the keyboard and interact with the entities using the mouse.

On both cases, the `camera` attribute is attached and only the y-coordinate of the position is modified, making possible to place the `multidevice` entity wherever we want.


This flowchart sums up the states of this component:
![](/vr-programming/img/component_multidevice_flowchart.png)

# Examples

On this scene, apart from moving around, you will be able only to grab the blue and green boxes on VR and only the green one on PC as the selector specified on the `multidevice` component only matches that (play with it [here](/vr-programming/scenes/examples/multidevice.html))

```
  <a-scene physics="driver:ammo">
    <a-entity position="0 0.75 -0.5"
              geometry="primitive:box; height:0.05; depth:1; width:1.5"
              material="color:gray"
              ammo-body="type:static"
              ammo-shape="type:box">
      <a-box    height="0.1" depth="0.1" width="0.1"
                material="color:blue"
                grabbable="constraintComponentName:ammo-constraint"
                ammo-body="type:dynamic"
                ammo-shape="type:box"
                position="-0.15 0.4 0"></a-box>
      <a-box    height="0.1" depth="0.1" width="0.1"
                material="color:green"
                grabbable
                position="0 0.4 0"></a-box>
      <a-sphere radius="0.05"
                material="color:red"
                grabbable
                position="0.15 0.4 0"></a-sphere>
    </a-entity>
    <a-entity multidevice="colliderSelector:a-box"></a-entity>
  </a-scene>
```