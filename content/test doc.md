---
title: "test doc"
date: 2022-03-10T12:41:28+01:00
draft: true
---

# aabb-collider

Aligned Bounding Box Collider.

> based on [aframe-extras](https://github.com/n5ro/aframe-extras) sphere-collider

### API

|Property|Description|Default value|
| :---: | :--- | ---: |
| objects | Selector of the objects over which an intersection test will be performed | '' |
| state | State that will be added to the collided entity during the intersection | 'collided' |
| radius | Radius of the collider (in meters) | 0.05 |
| watch | Whether to update the `objects` when the scene changes or not | true |

# assets-manager

A-Frame system that allows the programmer to load assets easily on runtime, it also removes the 
asset if it can't be downloaded and display an error message through the console.

### API

|Property|Description|Default value|
| :---: | :--- |
| add(id, path) | Adds the resource pointed by the URL `path` and assigns `id` as it's HTML id |
| delete(id) | Removes the resource  |