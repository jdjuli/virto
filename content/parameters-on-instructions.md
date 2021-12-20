---
title: "Including parameters to instructions"
date: 2021-12-18T20:16:07+01:00
draft: false
---

I decided to put aside the conditional execution until I had a solid variable and condition evaluation system, and I put an intermediate milestone between a non-parametric execution and that objective of a fully functional variable manipulation and logical operators evaluation system on the execution of programs that allow 'static' variable and constant assignements (meaning they don't vary with time but are intended to do so as the developments continues).

## Changes in components:

To make the new demo 19, I had to redesign many components and the key differences introduced are:
- `Instruction`: Instructions now have a different geometry and allow other entities to be put inside them ([value](/vr-programming/components/value) & [parameters](/vr-programming/components/parameter))
- `Program`: The instructions are now displayed horizontally, so the program needs to have a different shape ([documentation](/vr-programming/components/program))
- `Value`: This new components has been made to represent numeric values, which can be static (constants) or variables (see [value](/vr-programming/components/value) & [variables-state](/vr-programming/components/variables-state) for more information about how this works)
- `Parameter`: This new component represents qualitative information about instructions, such as axis of rotation for the instruction 'rotate' or directions in the case of the 'move' instruction.
- `Box-collider`: I made this component because I couldn't figure out how to tune the [Ammo driver](https://github.com/n5ro/aframe-physics-system/blob/master/AmmoDriver.md) of [aframe-physics-system](https://github.com/n5ro/aframe-physics-system) to detect accurately the collisions and I decided to program my own collision detector to detect collisions between a point and the bounding box of the entities I want to check for collisions. Read the [documentation](/vr-programming/components/box-collider) for more details on this component.
- `hand-menu`: This component has been completely redesign and now is able to load the contents from a JSON argument which allow to organize the options on many categories and the way to navigate it also has changed, now you have to move the joystick of the controller up and down to navigate through categories and right or left to move through the items of a certain category.
- `custom-hand`: I updated it to make it work without [aframe-physics-system](https://github.com/n5ro/aframe-physics-system) (making use of my `box-collider` component) and to display the menu on any of the hands (previously I wasn't considering that some users might be more confortable with the menu on their right hand instead of the left).
- `recyclebin`: This component aims to reduce the number of wandering entities on the scene, as it provides the user an easy mechanism to destroy them by just dropping them inside.
- `aframe-teleport-controls`: This is a modified version of the [original component](https://github.com/fernandojsg/aframe-teleport-controls) that I made to get rid of the warnings and deprecations that appear when it's used on the 1.2.0 version of A-Frame.
- `assets-manager`: Even though I'm not using this component right now, I'd programmed it with the intention of make it easier to manage assets on runtime, my idea was 'packing' the components with their required assets, but I couldn't accomplish my objective. I mention this system just in case someone finds JIT assets loading useful and want to give it a try.

Not all the components are docummented but I'm working on it and I'll be updating the [components section](/vr-programming/components) to provide documentation and examples of all of them.

## demo 19
All the changes can be seen on the demo19, on which apart from the changes on the components that I described before, I added a forest environment with the component [environment](https://github.com/supermedium/aframe-environment-component) and I changed the gestures, now to grab something, you'll have to press the lateral trigger and to teleport, you'll need to press the index trigger (note that you can teleport yourself while grabbing an entity).

![](/vr-programming/img/demo19_VR_1.gif)
_To open the menu, press the joystick of any of the controllers_

![](/vr-programming/img/demo19_VR_2.gif)
_Move the joystick up/down to change the category and right/left to move through the items of it_

![](/vr-programming/img/demo19_VR_3.gif)
_Touch an item to make it appear in front of you_

![](/vr-programming/img/demo19_VR_4.gif)
_You can teleport yourself with the index trigger_

![](/vr-programming/img/demo19_VR_5.gif)
_Teleport is also possible while grabbing objects_

![](/vr-programming/img/demo19_VR_6.gif)
_Bring instructions near the program or another entity to preview them and release the trigger to add them_

![](/vr-programming/img/demo19_VR_7.gif)
_Attributes can only be placed on a compatible instruction_

![](/vr-programming/img/demo19_VR_8.gif)
_Touch an argument/value/instruction to extract it (only constants will dissapear)_

![](/vr-programming/img/demo19_VR_9.gif)
_Touch the 'run' button to execute the program_

![](/vr-programming/img/demo19_VR_10.gif)
_Drag an entity to the recycle bin to destroy it_

## Problems found
When using ammojs driver on Aframe-physics-system to detect collisions between objects and the tip of the index finger, I found that even when the two entities collide, sometimes the event 'collidestart' wasn't fired, so I decided to change the view and instead of using a full physics engine to detect collisions, in my case it could be enough to have a simple component that performs this check using geometry, and that's why I programmed the component [box collider](/vr-programming/components/box-collider).

While testing my `box-collider`, I thought that the performance of the scene was reduced a bit, barely perceptible unless you make fast movements, but that made me add a new argument to the component to provide a way to say 'don't check for collisions every frame, instead do it each X frames', and try to increase the performance at cost of reducing the precission of the collider, what is unperceptible when doing slow movements.

I also found difficult to manage the components as I'm making changes constantly on them, so I decided to keep the scenes under '/vr-programming/scenes/demos' as a kind of snapshots of the progress and put the components used inside them once finished, but to ease the development, the latest version of the components will be now on '/vr-programming/js'