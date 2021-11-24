---
title: "Interaction improvements"
date: 2021-11-11T21:30:21+01:00
draft: false
---

My thesis mentor gave me the idea of improving the interaction by implementing a previewing dynamic that allows the user to view how would the program look like if a certain instruction is added. I've took the previous demo 16 as the base to implement this preview and instead of overwriting the scene, I decided to create a new one to avoid anyone interested on following my progress having to navigate through the repository commits and start a webserver on their own to test it.

## How is instruction previewing implemented:

I tried to keep the process as simple and powerfull as possible and I ended up modifying the `instruction` component to have another parameter on it's schema that will tell if the instruction should behave as a preview or not, and with that in mind, I've added to the program and every instruction the component `droppable`, which let me react to the events of hovering the instruction while grabbing an entity with the component `draggable` attached. The following event listeners were implemented:

+ `drag-drop`: When this event is detected, it means that an instruction has been ungrabed while hovering the entity that receives the event (the user has dropped it there). As a response to this event, the dropped entity is attached on top of the entity it has been dropped over.
+ `dragover-start`: This event fires when the user hovers an entity while grabbing a `draggable` entity and as a response to this, the grabbed entity is previewed in the place it would take if dropped in that position.
+ `dragover-end`: This event is the opposite of `dragover-start`, because `dragover` is not like the `hit` event, that is fired every tick while the super-hand is colliding with something and hence, the appropiate reaction to `dragover-end` is to end the preview of the instruction (removing the entity with the preview attribute from the scene).

The end of the preview maybe is not the best approach, as it could be improved by just updating the `instruction` component disabling it's 'preview mode', but as I wanted to keep it as simple as possible, I add a new entity with the `instruction` component cloned from the grabbed entity and the 'preview mode' enabled through the `preview` node of the `instruction` schema, and the removal is even simplier, I just need to keep a variable pointing to the entity that holds the preview to remove it, and this way, limiting the previewing entities to only one at a time is as simple as checking if I'm already storing a reference to a preview and if so, discard the new preview until the previous one ends.

## Minor changes

At the same time I've implemented the preview of instructions, I'd retaken the idea of interacting with the hand menu using physics as it makes it more precise. On the demo you can use it by following this steps:
1. Open the hand menu pressing the left joystick
2. Make a 'pointing' gesture with the right hand (a white wireframe box will appear on the index finger)
3. Push the buttons of the left hand menu with the index finger of the right hand. Use the arrows `<` and `>` to navigate through the different instructions available and press one of them to create it on the right of the program.
4. Now you can close the menu by pressing the left joystick again or change the selected instruction by pressing another one.

As usual, I'll provide the links to the demo and the code as well as some images demonstrating the changes.

*=>* Checkout the [Demo](/vr-programming/demos/scenes/demo17) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/scenes/demo17/index.html) *<=*

![](/vr-programming/img/demo17_VR.jpg)
*Before adding the instructions, a preview is made*

![](/vr-programming/img/demo17_VR.gif)
*The preview remains there until the entity is dropped or the hand is moved away*

## Known issues

+ #### Unresponsive hand menu
  I've found that after pressing the buttons of the hand menu, sometimes they become unresponsive. I haven't discovered yet why does this happens because it seems to be a problem within the physics system as no `collidestart` event is received and hence, the collision cannot be detected. Temporarily, this issue can be mitigated by opening and closing the menu (that destroys and creates again the buttons).
+ #### Apparently random crashes or disappearing blocks
  This could happen if the hand is shaked over the program while grabbing an instruction and the explanation is that as the `dragover` and `drag-drop` events are handled asyncronously, it could happen that the entity they have to be notified or refer to, existed at the time of firing the event but doesn't exist by the time it is handled. I have to investigate more about how to solve this, but for now, the best 'solution' I found so far is to avoid pushing the scene to it's limits and try to preview the instructions at one place at a time.
+ #### Entities blink when they are added or removed to/from the program
  This happens because the entities are reparented by creating a clone and modifying it's position, some flickering might occur sometimes if the entities are rendered before being removed or having it's position updated. As far as I have test, this side-effect of cloning entities is harmless, but I'll keep an eye on it just in case it becomes problematic in the future.