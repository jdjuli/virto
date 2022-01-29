---
title: "More colliders"
date: 2022-01-28T14:24:17+01:00
draft: false
---

This few past weeks I remembered a small issue I had from the begining related to the 'realism' of the grab and touch. I've already developed the component [box-collider](/vr-programming/components/box-collider), which implements an OBB collider (i'll explain this later) but it's performance was worse than what I thought when I designed it.

I decided to invest some time doing some research about how colliders work and creating components to use them on A-Frame, I came out with 4 types of colliders:
 1) `sphere collider`: This are the simplest, they simply encapsullate the objects into spheres and detect if they intersect by comparing the sum of the radious and the distance between the centre of the spheres.
 2) `AABB collider`: AABB stands for _Axis Aligned Bounding Box_, it works by creating the box that fits bether the geometry of the entity enforcing the edges of the box to be parallel to any of the tree axis of the world (X, Y, Z) and checking if the edges of two of this boxes overlap on the three axes simultaneosly.
 3) `OBB collider`: OBB stands for _Oriented Bounding Box_, and it's very similar to the AABB collider but in this case, the edges of the bounding box have an arbitrary orientation. This collider is kind of a mid-point between the AABB collider and the mesh collider in terms of precission and performance.
 4) `mesh collider`: As the name suggests, this collider uses the mesh of the object to test for collisions, mo matter it's orientation. It's the most precise of this four colliders, but the most important drawback is that is very computationally expensive and most of the times this can be avoiding by using a combination of the three previous colliders.

 # Tests
 Now that we know some of the most common colliders, let's see them in action, I've prepared four scenes with a different collider on each, the entities displayed are cyan and become red when a collision is detected. VR headset is required as the scenes make use of the controllers to move the collider, which is located on the center of the hands (marked with a small golden sphere)

 ## Sphere collider
 This collider is part of the [aframe-extras repository](https://wmurphyrd.github.io/aframe-super-hands-component/) of _donmccurdy_ and can be used by including that proyect, see the readme of his repo to have updated instructions on how to add it to your proyect.

 [__Test it__](/vr-programming/scenes/examples/sphereCollider.html)

 ## AABB collider
 I've modified the sphere-collider of donmccurdy to detect collisions between an AABB and an sphere, it's usage is exactly the same and the best part is that they are interchangeable, you'll only need to include this JavaScript file to your HTML:
 ```html
    <script src="https://cdn.rawgit.com/donmccurdy/aframe-extras/v4.1.2/dist/aframe-extras.min.js"></script>
 ```

 [__Test it__](/vr-programming/scenes/examples/aabbCollider.html)

 ## OBB collider
 As I did to create the AABB collider, this time I've also modified the sphere-collider component of donmccurdy to detect collisions between an OBB and an sphere, to use it, include this JavaScript file to your HTML:
 ```html
    <script src="https://cdn.rawgit.com/donmccurdy/aframe-extras/v4.1.2/dist/aframe-extras.min.js"></script>
 ```

 [__Test it__](/vr-programming/scenes/examples/obbCollider.html)

## Mesh collider
This time, we can use a physics engine to simplify the process, I suggest to use [aframe-physics-system](https://github.com/n5ro/aframe-physics-system) and [configure it to use the Ammo.js driver](https://github.com/n5ro/aframe-physics-system/blob/master/AmmoDriver.md). You'll have to assign an `ammo-body` and `ammo-shape` component to the interacting entities, make sure to set the parameter 'type' of `ammo-shape` to `mesh`.

[__Test it__](/vr-programming/scenes/examples/meshCollider.html)
