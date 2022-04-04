---
title: "Version 0.1"
date: 2022-04-04T11:08:50+02:00
draft: false
---

This is the first fully usable version of the proyect (more about it [here](/vr-programming/about-vr-programming)). 

It allows the creation of sequential programs with variables that can be modified manually on runtime and is completely compatible with VR headsets and partialy with PCs.

## Things that can be done:
- [Write your own programs on HTML](#write-your-own-programs-on-html)
- [Run the program](#run-the-program)
- [Modify the program](#modify-the-program)
- [Work with variables](#work-with-variables)
- [Build your own program from scratch](#build-your-own-program-from-scratch)


### Scenes available to play with
 - [Sample program](/vr-programming/scenes/demos/demo20)
 - [Sample program & build-your-own](/vr-programming/scenes/demos/demo21)

---

# Write your own programs on HTML
Even though you only need to know the basics of HTML to write programs with this proyect, I would recommend to get used to work with A-Frame so you can get the most of it.

I'll start showing a simple (yet valid and runnable) program before explaining each component

 - **Simplified schema of the components hierarchy**
```txt
ide -> program "moveForward"
          |
          +-> scope
          |     |
          |     +-> variable "amount"
          |
          +-> code
                |
                +-> instruction "move"
                        |
                        +-> parameter "forward"
                        +-> reference "amount"
```
 - **Actual HTML code**
```HTML
<a-scene>
    <a-entity drone position="0 2 -2"></a-entity>
    <a-entity ide>
        <a-entity program="name:amount">
            <a-entity scope>
                <!-- Variable declaration goes here -->
                <a-entity variable="name:amount;icon:icon_sun;value:5;min:0;max:10"></a-entity>
            </a-entity>
            <a-entity code>
                <!-- Instructions go here -->
                <a-entity instruction="function:move">
                    <!-- Every instruction must have a reference and a parameter -->
                    <a-entity parameter="type:forward"></a-entity>
                    <a-entity reference="variable:#amount"></a-entity>
                </a-entity>
            </a-entity>
        </a-entity>
    </a-entity>
</a-scene>
```
As you can see on the code snippet, inside the <a-scene> tag we'll only use <a-entity> tags and the behaviour is defined by the attributes we have on the oppening tag, which are called `components` and, apart from the ones I'll describe, we can add more to modify several aspects like the rotation, position or scale.
- __drone__

  Combined with `position`, places a 3D model of a drone on the scene that will be controlled by the program we write.

- __ide__

  Keeps track of the programs created on it, every program has to be placed as a child of this entity.

- __program__

  It's possible to assign them a name to clarify what it does. Inside it's tag we'll place the scope and the block of code (data and behaviour) of our program.

- __scope__

  contains variable definitions that will be used inside the code entity

- __variable__

  must have a name (will become the ID of the entity) and an icon to be able to recognize it and the references to it. All the variables are integer and have a configurable range (arguments 'min' and 'max'). We can set an initial value though the argument 'value'.

- __code__

  Coordinates the execution of the instructions placed inside it.

- __instruction__

  It can move or rotate the drone, this is set through the argument 'function', which takes the values 'move' or 'rotate'. It's parameter and reference can be set using the arguments 'parameter' and 'reference', but it's clearer to put them as separate entities inside the instruction.

- __reference__

  Tells the instruction how strong has to perform the action indicated by the parameter, the attribute 'variable' must contain a selector that points to the entity with the 'variable' component (the best option is to locate it by ID, i.e. '#varName')

- __parameter__

  Gives qualitative information to the instruction it belongs, the possible values depend on the function of the instruction:
  - __move__ : '_up_', '_down_', '_left_', '_right_', '_backward_', '_forward_'
  - __rotate__ : '_xaxis_', '_yaxis_', '_zaxis_'


[_↑ go back up ↑_](#top)

---

# Run the program

To run the program, we have to put on the VR headset, go to our scene and with any of the hands, make the 'pointing' gesture and press the 'RUN' button.
If the drone ends up very far from us, we can make it return to it's original position by pressing the button 'RESET'.

{{< youtube zao8LDIXaiA >}}


[_↑ go back up ↑_](#top)

---

# Modify the program

We can interact with the elements of the program by grabbing them and moving them apart if we want to remove it from the program or bringing it near the desired location to preview it in place and placing it there by just releasing it.

This interaction works for instructions (gray tall blocks), parameters (green boxes) and references (cyan cylinders)

{{< youtube 0aR6S85Mtdo >}}


[_↑ go back up ↑_](#top)

## Create new elements on it

Also you might find the programs limited to whatever was written on the HTML, fortunately, you can add more elements to the program. To do this, press the joystick of any of the controllers and a handheld menu will show up (press again to make it dissapear) on which you'll be able to navigate moving the joystick up-down to change the category and left-right to see all the items of that category in case there are more than three.

To create a new instance of those elements, just make the pointing gesture with the opposite hand and press the corresponding button with the index finger. 

I consider important to know that all the changes made to the HTML written program won't be saved, which means that closing the browser or refreshing the page will revert all of them.

{{< youtube zqnAsZH67KE >}}


[_↑ go back up ↑_](#top)

---

# Work with variables

The variables can be created by the same procedure explained in the [previous section](#create-new-elements-on-it), but it's a bit diferent from the other elements in the sense that we have three buttons to create a new variable, named __S__, __M__ and __L__, standing for _**S**mall_ (range [-9, 9]), _**M**edium_ (range [-99, 99]) and _**L**arge_ (range [-999, 999]). Most of the time an small or medium variable will be enough, but for completeness you can try to use also a large one.

Once created they don't differ in apperance, the only way to know the range of an existing variable is to drag the slider on top of it and check what are the minimum and maximum value we can assign to it.

The program is executed as if we were debugging it, in the sense that if we modify the value of a variable while the program is running, that change will affect to the instructions that haven't been executed yet.

{{< youtube u7pj1snSvSw >}}


[_↑ go back up ↑_](#top)

---

# Build your own program from scratch

If you want to create your own program from scratch without any help, you can use [this scene](/vr-programming/scenes/demos/demo21) to do so, it has two programs, one prebuilt to serve as an example as how a valid program looks like and another one completely empty and prepared to start building your own sequence of instructions.

{{< youtube VzPBErIsWwk >}}


[_↑ go back up ↑_](#top)