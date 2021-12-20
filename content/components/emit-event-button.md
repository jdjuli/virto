---
title: "emit-event-button"
date: 2021-12-16T12:20:25+01:00
draft: false
---

# Purpose
Provide a generic button that can notify other entities through events when it has been touched

# Schema
  - attribute name: event
    - description: The name of the event that will be send
    - type: string
  - attribute name: emitTo
    - description: The entity to be notified. By default, the event will be sent to the scene
    - type: selector
  - attribute name: text
    - description: Text to be displayed on the button
    - type: string

# Usage
Import the component with:
```html
<script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/emit-event-button.js"></script>
```
When creating VR scenes, make sure that you set up another component that emits `collidestart` events when the button is touched, this can be done in two ways:
 + Using the [custom-hand](/vr-programming/components/custom-hand) component to create the hands (internally it uses `box-collider`, which emits this event)
 + Using [aframe-physics-system](https://github.com/n5ro/aframe-physics-system) with Ammo.js driver ([how-to](https://github.com/n5ro/aframe-physics-system/blob/master/AmmoDriver.md)).

 If the scene is going to be used on PC, this component requires [super-hands](https://github.com/wmurphyrd/aframe-super-hands-component) to work properly, as the 'touching the button' gesture is replaced by the `click` event that super-hands emits to the button entity when clicked.

To use the component, just attach it to any entity on the scene and configure it to match your needs.

# Implementation

On the initialization, a box primitive is set to the entity with the following dimensions: width=0.2, height=0.1, depth=0.05 (In the future this will be parametrized) and color `#7d0222`.

The component checks if the scene is being used on PC or VR device and sets the handler responsible of emitting the events to either the 'click' or the 'collidestart' event.

# Examples

Simplest scene for VR headset featuring three instructions an a free parameter meant to be placed on any of the two instructions that doesn't have it placed (play with it [here](/vr-programming/scenes/examples/emit-event-button.html))

```
  <a-scene>
      <!-- Entity that will receive the events -->
      <a-entity id="sphere" 
                geometry="primitive:sphere; radius:0.1" material="color:blue" 
                position="0 1.6 -1"
                event-set__moveup="position:0 1.7 -1" 
                event-set__movedown="position:0 1.5 -1"></a-entity>
      <!-- Button to move the sphere up -->
      <a-entity emit-event-button="event:moveup; emitTo:#sphere; text:up"
                position="-0.3 1.4 -0.5"></a-entity>
      <!-- Button to move the sphere down -->
      <a-entity emit-event-button="event:movedown; emitTo:#sphere; text:down"
                position="0.3 1.4 -0.5"></a-entity>
      <!-- Make the scene work in both PC and VR headsets -->
      <a-entity multidevice="colliderSelector:.collidable"></a-entity>
  </a-scene>
```