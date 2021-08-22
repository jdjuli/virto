---
title: "Iteration 1"
date: 2021-06-10T19:36:30+02:00
draft: false
---

I don't have a lot of experience programming on Javascript before and also, as A-Frame is a component-based framework, the objectives of this first iteration are becoming familiar with Javascript and A-Frame.

This first scenes are very basic and not so interactive, because I used them as "prototypes" for the next ones, I decided to keep them to ilustrate my progress.

## Scenes developed
- Non parametric component

    This scene shows one brown sphere, it's entity element on the DOM has the attribute "esfera_marron" set, which maps to the component with the same name. When this component initializes, it adds the attributes geometry and material to the entity to which it has been attached and makes it look brown and spheric.
		
    *=>* [Demo](/vr-programming/demos/demo1) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo1/index.html) *<=*

- Parametric component

    Visually, this scene is very similar to the previous one, it shows two spheres, red and green. If we dive into the HTML code, we can see that now, the attribute has been renamed to "esfera_parametrica" and on it's associated value, we specify two properties "radio" (radius of the sphere) and "color" (color of the material that will be applied).
    
    *=>* [Demo](/vr-programming/demos/demo2) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo2/index.html) *<=*

- Responding to click events

    The first interacting scene consist on two boxes that will "jump" (just teleport themselves up and down) when the user clicks on them. To implement this behaviour I created the component "salta", which during it's initialization sets the event listener responsible of the jump effect when the user clicks on the entity.
		
    *=>* [Demo](/vr-programming/demos/demo3) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo3/index.html) *<=*
		
- Acting over other entities

    This scene shows a cube and a sphere, that when clicked, make "jump" the opposite entity. This has been done by creating a component ("salta_otro") that receives through its parameter "target" the id of the target over which it has to act when a click event is received.
		
    The implementation of this scene is not the best because the behaviour should be decoupled on two components, one responsible of making a entity jump (let's say "jump") and another that listen for a click event on the entity ("makes_jump" for example) and when received, tells the jump component to make it's associated entity jump.
		
    *=>* [Demo](/vr-programming/demos/demo4) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo4/index.html) *<=*
		
- Adding some physics
    
    On this scene I started playing with a the JS physics engine [ammo.js](https://github.com/kripken/ammo.js/). The scene is visually the same that the previous one, but the entities now really jump and not just teleport themselves and can move arround the scene.
		
    *=>* [Demo](/vr-programming/demos/demo5) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo5/index.html) *<=*

## Problems encountered
The first problems I faced up were about how to modelize correctly the components, because I'm more used to the object-oriented paradigm and the entity-component paradigm is something new for me. I decided to program them in an iterative manner, so the first versions will lack many details that I'll be adding as I need them, also refactoring everything to make it more usable.