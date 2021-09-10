---
title: "Iteration 2"
date: 2021-06-22T19:36:30+02:00
draft: false
---

On this iteration the objectives are to improve the comunication between components and start making simple programming-oriented components. 

## Scenes developed
- Listening for entity collisions
    
    The scene represents a bunch of spheres bouncing and colliding, each time the spheres collide their color changes to red for a small time frame. To archieve this behaviour I created a component called "colorea_colision" that listens for "collide" events and changes the color of the attached entity for a short time.
		
    ![](/img/demo6_PC.gif)
		*You will see the spheres blink red when they collide*
		
    *=>* Checkout the [Demo](/vr-programming/demos/demo6) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo6/index.html) *<=*
		
- Improving inter-component communication
    
    As I mentioned on the scene "Acting over other entities" of the first iteration, the way I programmed that scene wasn't the best, and on this iteration I improved it splitting the responsabilities between two components called "hace_saltar" and "saltador".
		
    This time, through the parameter "target" of the component "hace_saltar" we specify the entity that will jump when the entity with the component "hace_saltar" receives a click, note that the entity that jumps need to have the component "saltador" to work properly. Once "hace saltar" receives a click event, it sends a event "salta" (jump) to the entity located by "target" and now, the component "saltador" replies to that event teleporting the associated entity up and down.
		
    ![](/img/demo7_PC.gif)
		*Each entity jumps a different height and you need to click the opposite one to make them jump*
		
    *=>* Checkout the [Demo](/vr-programming/demos/demo7) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo7/index.html) *<=*
		
- Firing recurrent events

    To introduce recurrent actions on scenes, I'll take the inter-component communication scene and add a new component to it, which will make use of the Javascript functions `setInterval()` and `clearInterval()` to send the event "salta" (jump) to the entity referenced on the value of the parameter "target" every fixed time (can be set in milliseconds through the parameter "cada_ms").
		
    ![](/img/demo8_PC.gif)
		*The yellow sphere will jump indefinitely  every second and the red and green spheres will jump different heights if you click on the opposite one*
		
    *=>* Checkout the [Demo](/vr-programming/demos/demo8) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo8/index.html) *<=*
		
- Static program

    This is the first scene that allows the users to run a sequence of actions, that couldn't be changed to mantain the scene as simple as possible.
		
    There are three main components, "drone", which is attached to the entity that should move when the actions are executed; "accion", which represents a certain action and instruct the "drone" component to execute it; and "program", which contains the set of actions that will be executed (entities with the "accion" component) and ensures that they are executed in order when the program execution is issued (by sending it a "run" event)
		
    ![](/img/demo9_PC.gif)
		*To execute the program over the green sphere, you need to click one of the cubes, no matter which*
		
    *=>* Checkout the [Demo](/vr-programming/demos/demo9) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo9/index.html) *<=*

- Dynamic program without physics

    This scene allows the user to compose a program using the four cubes colored cyan and red, the cyan ones represents the action "up" and the red ones, "down".
    The execution order is determined by the height of each cube, being the first the upper one, and to execute the program, a clic on the drone (green sphere) is needed.
		
    ![](/img/demo10_PC.gif)
		*Drag the blocks to change their vertical position and click the green sphere to execute the resulting program*
		
    *=>* Checkout the [Demo](/vr-programming/demos/demo10) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo10/index.html) *<=*

- Dynamic program with physics

    The scene is an evolution of the previous one, which didn't make use of a phisics engine to make the interaction with the building blocks of the program more realistic. The instruccion blocks have been resized but the core functionality of the scene remains the same.

    This scene is controlled with the gaze, meaning that to interact with the virtual world, you will need to stare at the elements you want to interact with before clicking or grabbing them. In the future, this method will be avoided as most VR headsets have controllers that allow a more natural way to interact with the virtual scene.
		
    ![](/img/demo11_PC.gif)
		*Use the gaze (the circle on the center of the screen) to arrange the blocks vertically and click the green sphere to execute the program (also using the gaze)*
		
    *=>* Checkout the [Demo](/vr-programming/demos/demo11) & [Code](https://github.com/jdjuli/aframe-vr-programming/blob/main/docs/demos/demo11/index.html) *<=*

## Problems encountered
I managed to modelize correctly the interactions between components through events, but I should consider also the option of calling the event handlers directly and avoid the overhead generated by the events. By now this doesn't seems to be a problem, but is something I'll consider on the mid-long term.

Also, I was expecting that I would be able to use the libraries without needing to know a lot of details of their implementation, but it couldn't, I had to debug and inspect the internal code of the aframe-physic-system and ammo.js while programming the 'dynamic program with physics' because I couldn't grab a `dynamic` entity. After inspecting the code, I ended up programming a component called `desplazable` that changes the type of body from `dynamic` to `kinematic` when the user grabs the associated entity and way back to `dynamic` when the grabbing ends.

Finally, I started using the gaze control, which seem acceptable on the PC, but after discussing about it with my mentor, he recommended me to avoid it as it's very unnatural way to interact with the VR when using a VR headset.