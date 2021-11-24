---
title: "custom-hand"
date: 2021-11-24T09:33:24+01:00
draft: false
---

# Purpose
Join multiple components into one that provides a virtual hand with minimum configuration and adapts to the scene configuration (i.e. If the scene uses physics, the components attached to the hand would be different).

# Schema
  - attribute name: hand
    - type: string
    - oneOf: `left`, `right`
  - attribute name: colliderSelector
    - description: Selector of entities the user can interact with
    - type: string (valid CSS selector)

# Usage
Attach this component to the entity that you want to become a hand (you don't have to provide any kind of geometry for this) and make sure that you set the `hand` attribute to load the right model.

When the scene uses Ammo.js physics driver and the user makes the 'pointing' gesture, an invisible entity is created around the index finger, it has the class '.finger' and the ammo-body component attached in order to fire `collidestart` and `collideend` event on every other physics body it touches.

Note that the attribute `colliderSelector` must be specified in order to be able to interact with other entities. This attribute impacts performance, so try to use a selector as specific as possible (like classes for example)

Also, this component is prepared to handle an entity with the component `hand-menu` on it, this was thought to provide a screen-like menu attached to the left hand and which shows and hides when the user presses the joystick of that same hand controller. It's not mandatory to create this entity, as it's availability is checked on runtime and the corresponding event handlers are only set if it is present.

# Implementation

The _custom-hand_ component always attachs the components `sphere-collider`, `hand-controls` and `super-hands`. If the scene is using Ammo.js physics driver, it also attachs the components `ammo-body` and `ammo-hand` and registers handlers for the events 'pointingstart' and 'pointingend' (to create and destroy the index finger collider entity) and, in case the first child of the _custom-hand_ entity has the component `hand-menu`, event handler for 'thumbstickdown' is registered.

Finally, a function that updates the `sphere-collider` component is set to be executed every half second, to make sure that the user can interact with the entities created on runtime and match the 'colliderSelector'.

This flowchart sums up the states of this component:
![](/vr-programming/img/component_customhand_flowchart.png)

# Examples

This example shows two cubes and a sphere and only the cubes can be grabbed on VR due to the colliderSelector provided to the `custom-hand` component (play with it [here](/vr-programming/scenes/examples/instruction.html))

```
  <a-scene physics="driver:ammo">
    (...)
    <a-entity camera>
        <a-entity custom-hand="hand:left;colliderSelector:a-box"></a-entity>
        <a-entity custom-hand="hand:right;colliderSelector:a-box"></a-entity>
    </a-entity>
  </a-scene>
```
