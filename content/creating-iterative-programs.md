---
title: "Creating iterative programs"
date: 2021-10-28T12:36:07+02:00
draft: false
---

I've been working on making a fully usable demo that allows the users to create sequential programs. Also, I'm exploring two different ways of creating instruction blocks, both of them implemented on the demo 16.

## How to use the demo 16:

This demo implements two different ways of creating new instructions blocks, I'll explain how to use each one:

+ Use a static 'panel' to select the desired instruction:
  
  Clicking on the `<` and `>` buttons navigate through the different instructions available and clicking on the name of the instruction generates a instruction block on top of the menu.  
  ![](/vr-programming/img/demo16_static-menu.jpg)
  *Change the instructions with the arrows and select one with the center button*
+ Select the instructions with a 'menu' attached to the left hand:

  To show the menu, you have to press the joystick of the left controller and press it again to hide it. It's difference with the previous method is that two instructions are displayed at the same time instead on one and when selected, the instruction doesn't appears on top of the menu but on the right side of the program.
  ![](/vr-programming/img/demo16_hand-menu.jpg)
  *Navigate through the instructions using the arrows and when you select one, it will appear on the right side of the program.*

On both cases, to insert a new instruction to the program you have to grab it (it will shrink) and make it collide with another instruction of the program or the base of it, the new instruction will be inserted on top of the colliding instruction. To remove them, simply grab one of the instructions and pull it out it's place on the program, it will disappear (in the future you will be able to insert it again, but for now they will just be destroyed).

![](/vr-programming/img/demo16_VR.gif)
*You can add and remove instructions everywhere on the program*

*=>* Checkout the [Demo](/vr-programming/scenes/demos/demo16) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/scenes/demos/demo16/index.html) *<=*

## Internal changes
I've reestructured the components I'm using to make possible that multiple programs coexist on the same scene and also could be run over the same drone, this diagram reflects the dependencies between the entities and their multiplicities.
![](/vr-programming/img/demo16_diagram.png)

Also, I would like to implement at some point that the programs could be 'closed', so I started by keeping track of the instructions added to them updating the attribute each time an instruction is added or deleted.
![](/vr-programming/img/demo16_dom-changing.gif)

## Problems found
I tried to implement the joints between the instruction blocks of the program using physics constrains, but I could only add/remove instructions from the top of the column and it became more and more unstable as I were adding more blocks, so I gave up on implementing the program this way and I decided not to use physics at all on the program and keep it static as can be seen on the demo #16.

I kept the problematic demo just to illustrate the problem I faced, if you try it, **no not insert blocks inbetween others or make a loop with them**, doing so might result on an endless loop that freezes the tab. By now, I won't spend more time on trying to fix this problem, but if you want to play with it and try fixing the instruction insertion in the middle of the program, this [StackOverflow question about moving dynamic bodies](https://stackoverflow.com/questions/66423513/how-to-move-a-dynamic-body-with-a-frame-physics-system-when-using-ammo-driver) might be helpful, as well as [this test scene I created](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/scenes/tests/TeleportDynamicBody/index.html) to check it.

![](/vr-programming/img/demo15_VR.gif)
*You can only add and remove instructions to/from the top of the program*

*=>* Checkout the [Demo](/vr-programming/scenes/demos/demo15) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/scenes/demos/demo15/index.html) *<=*

In parallel to the demo 15, I was making a menu like the one that can be seen on the demo 16 but with the hands 'improved' adding them a physic body on the index finger that detects collisions with the buttons when the pointing gesture is made. This is more precise than the current menu that uses the super-hands-component event `clicked`, but is more difficult to implement. Maybe in the future I'll return to this type of interaction with the menu for the sake of it's precission, in the meantime, here are the links to the [scene](/vr-programming/scenes/tests/FirstMenu) and the [code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/scenes/tests/FirstMenu/index.html) as well as the 

## Other tests

When I decided to change how the instructions would be added and deleted to/from the program, I created two test scenes with the bare minimum code to check the interactions I was going to use, I leave here the links and a brief description of them just in case you want to implement something similar and want to see an example.

+ #### Hand events ([demo](/vr-programming/scenes/tests/HandEvents) & [code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/scenes/tests/HandEvents/index.html))
  This scene illustrates the events of hovering and grabbing over three blocks. When no interaction is detected, the blocks are blue, but they turn green when they are being hovered and red when grabbed, you can play with it to get an idea of how the super-hands-component works.
  ![](/vr-programming/img/testHandEvents_VR.gif)

+ #### Drag blocks horizontally ([demo](/vr-programming/scenes/tests/DragBlocksHorizontally) & [code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/scenes/tests/DragBlocksHorizontally/index.html))
  This scene consist of three blocks that can be grabbed and then moved horizontally without physics, they just float arround without changing their height. The color scheme is the same I've used on the `Hand events` test
  ![](/vr-programming/img/testDragBlocksHorizontally_VR.gif)