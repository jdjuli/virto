---
title: "super-hands-component issue"
date: 2021-09-22T17:36:07+02:00
draft: false
---

The library [aframe-physics-system](https://github.com/n5ro/aframe-physics-system) which I'm using to add physics to my scenes supports 2 physics engines, `cannon.js` and `ammo.js`, but recently I started using the library [super-hands-component](https://github.com/wmurphyrd/aframe-super-hands-component) and it's component `super-hands` attached to the A-Frame component `hand-controls` in order to provide a more natural way to interact with the elements of the scene, but `super-hands-component` is only compatible with the `cannon.js` engine. The problem arises with the latest version of A-Frame, which breaks the support of `cannon.js` and i'ts uncertain if they'll fix it in the future or `ammo.js` will become the only supported physics engine.

Keeping that in mind, the problem I faced is that when the user tries to grab a virtual object, it doesn't work if I use A-Frame 1.2.0 and the `super-hand` component. After some days of testing and debugging, I realized that the problem is that the `super-hand` component creates a `constraint` component on the entity grabbed and that component isn't defined on `ammo.js`, instead, if that engine is used, the component that represents the constraints is called `ammo-constraint`, so the solution in this case is to create an `ammo-constraint` instead of a `constraint`.

I've forked the [super-hands-component](https://github.com/wmurphyrd/aframe-super-hands-component) repository to introduce this changes ( [link](https://github.com/jdjuli/aframe-super-hands-component) ), but by the time I was going to open a pull request, I found an issue where the github user [diarmidmackenzie](https://github.com/diarmidmackenzie) purposed a more complete [solution](https://github.com/wmurphyrd/aframe-super-hands-component/compare/master...diarmidmackenzie:master). 

Here I show 4 scenes I created to illustrate the problem. Note that in the first two we can only grab the entities on the one which uses `cannon.js`, but on the last two I replaced the [super-hands-component](https://github.com/wmurphyrd/aframe-super-hands-component) script mine, on which I've introduced the modifications required to be able to grab the entities with both `cannon.js` and `ammo.js` engines.

+ [Scene with cannon before the changes](/virto/scenes/tests/CannonBefore) ( [Code](https://github.com/jdjuli/virto/blob/main/docs/scenes/tests/CannonBefore/index.html) )
  ![](/virto/img/testCannonBefore_VR.gif)
+ [Scene with ammo before the changes](/virto/scenes/tests/AmmoBefore) ( [Code](https://github.com/jdjuli/virto/blob/main/docs/scenes/tests/AmmoBefore/index.html) )
  ![](/virto/img/testAmmoBefore_VR.gif)
+ [Scene with cannon after the changes](/virto/scenes/tests/CannonAfter) ( [Code](https://github.com/jdjuli/virto/blob/main/docs/scenes/tests/CannonAfter/index.html) )
  ![](/virto/img/testCannonAfter_VR.gif)
+ [Scene with ammo after the changes](/virto/scenes/tests/AmmoAfter) ( [Code](https://github.com/jdjuli/virto/blob/main/docs/scenes/tests/AmmoAfter/index.html) )
  ![](/virto/img/testAmmoAfter_VR.gif) 

## Solution adopted
After making my own modifications over the [super-hands-component](https://github.com/wmurphyrd/aframe-super-hands-component) code, I finally decided to use the fork made by [diarmidmackenzie](https://github.com/diarmidmackenzie/aframe-super-hands-component) as he considered more things when making the code compatible with `ammo.js` than I did (I changed the bare minimum to make the component work on my use case)