---
title: "box-collider"
date: 2021-12-18T18:05:17+01:00
draft: false
---

# Purpose
Detect collisions precisely between a point and a box shaped entity

# Schema
  - attribute name: colliderSelector
    - description: CSS selector of entities to collide with.
    - type: string
  - attribute name: skipTicks
    - description: How many tick updates should be ignored before computing intersections again
    - type: Number
    - default: 0 (check for collisions on each tick call)

# Usage
Import the component with:
```html
<script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/box-collider.js"></script>
```
Attach the component to the entity that will represent the 'point' of the intersection (i.e. the tip of a finger), there's no need for that entity to have an associated geometry nor material unless you want to set it to see where the collision point is.

Differenciate the entities you want to detect collisions with and set the CSS selector accordingly, but try to keep the number of entities as low as possible as it impacts the performance. If you are aware of the performance, you can tune the `skipTicks` argument to avoid calculating the intersections on each tick, increasing this number is encouraged specialy when the objects are moving slowly and/or fluency is more important than precision.

Keep in mind that the entities pointed by the CSS selector are not updated if you remove or create a new entity and when this happens, a manual call to the update() function is needed to refresh the entities.

This component emits the events `collidestart` when the collision starts and `collideend` when it terminates to the colliding entity (not the one that has this component attached)

# Implementation

This components works thanks to geometric transformations provided by the [threejs](https://threejs.org/) math classes. During the initialization only a Set and two variables to keep track of the tick calls and which of them skip are initializated. On each update call(), the set is filled with the result of quering the scene with the provided `colliderSelector` and later, the set is mapped to transform each entity to a pair of the entity and it's semi-size (the size of it's bounding box divided by two).

On each tick call that computes positions, the set is iterated and for each element, the current position of the entity is translated to the coordinate space of the element so guessing if it's inside the volume is as simple as calculating if it's coordinates are inside (-halfDimension,+halfDimension).

Here I show a simpler example of the procedure applied on a 2D space:
![](/vr-programming/img/component_box-collider_example.png)
_Red elements are on the global coordinate system and the green ones on the black box's coordinate system, origins of both systems are noted by OG and OL respectively_

Imagine that we want to know if the points P and Q are inside the box, but as they are on the global coordinate system (red arrows, let's say they are children of a-scene), the math to check this is complicated, but if we express it's position on a local coordinate system (green arrows), the points would be inside the box only if `-H/2 < P_h < H/2` and `-W/2 < P_w < W/2`, being H and W the heigth and width of the box respectively. Extrapolate this to the third dimension requires us to consider also the depth of the box and the Z-coordinate of the point we want to check. 

# Examples

This scene demonstrate the drawbacks of using this component to detect collisions with rounded geometries, start it on a VR headset and make the 'pointing' gesture (☝) to enable the collider, which is located on the tip of the index finger. (play with it [here](/vr-programming/scenes/examples/box-collider.html))

![](/vr-programming/img/component_box-collider_demonstration.gif)
_the cyan sphere was added to keep track of the collider entity_

```
  <a-scene>
    <a-entity   geometry="primitive:sphere; radius:0.1"
                material="color:blue"
                position="-0.3 1.4 -0.5"
                event-set__collidestart="material.color:red"
                event-set__collideend="material.color:blue"
                class="collidable"></a-entity>
    <a-entity   geometry="primitive:box; height:0.2; width:0.2; depth:0.2"
                material="color:blue"
                position="0 1.4 -0.5"
                event-set__collidestart="material.color:red"
                event-set__collideend="material.color:blue"
                class="collidable"></a-entity>
    <a-entity   geometry="primitive:cone; height:0.2; radius-bottom:0.1; radius-top:0"
                material="color:blue"
                position="0.3 1.4 -0.5"
                event-set__collidestart="material.color:red"
                event-set__collideend="material.color:blue"
                class="collidable"></a-entity>
    <a-entity multidevice="colliderSelector:.collidable"></a-entity>
  </a-scene>
```