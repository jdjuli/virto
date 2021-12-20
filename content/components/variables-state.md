---
title: "variables-state"
date: 2021-12-15T10:17:22+01:00
draft: false
---

# Purpose
This file registers a state using the [aframe-state-component](https://github.com/supermedium/superframe/tree/master/components/state/) to provide a mechanism to have global numeric variables on the scene.

# Usage
Import the JavaScript files on the `<head>` of the html with the following tags:
```html
<script src="https://unpkg.com/aframe-state-component@7.1.0/dist/aframe-state-component.js"></script>
<script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/variables-system.js"></script>
```
To access the variables in your code, you'll need a reference to the state system, which can be obtained inside your component by doing this:
```javascript
let scene = this.el.sceneEl 
//Or document.querySelector('a-scene') if your code isn't inside a component
let state = this.el.sceneEl.systems['state'];
```
Once you have a reference to the system, you can do the following
 + #### Declare a variable:
  ```javascript
  scene.emit('createVariable',{name:'nameOfTheVariable',value:123.45});
  ```
  The value is optional and if not defined, it will be 0.0.
 
  If there's already a variable with the specified name, it won't be overwritten and the console will display a warning like this:
  `Variable with name: 'nameOfTheVariable' already exists, use 'setVariable' event to change it's value`
 + #### Read a variable's value:
  ```javascript
  let value = scene.systems['state'].state.variables['nameOfTheVariable'];
  ```
  It's recommended to check first if the variable accessed exists, as if it doesn't exist, an exception will be thrown.
 + #### Change a variable's value:
  ```javascript
  scene.emit('setVariable',{name:'nameOfTheVariable',value:123.45});
  ```
  If the variable doesn't exists, it won't be created and the console will display a warning message like this:
  `Variable with name: 'nameOfTheVariable' doesn't exist, use 'createVariable' event first to create it`
 + #### Delete a variable:
  ```javascript
  scene.emit('deleteVariable',{name:'nameOfTheVariable'});
  ```
  This operation doesn't fail nor shows anything through the console, even if the variable didn't exist previously.
 + #### Check if a variable exists:
  ```javascript
  let value = scene.systems['state'].state.variables.hasOwnProperty('nameOfTheVariable');
  ```
  Don't try to access the variable directly, as they are stored as object properties and accessing an undefined property will lead to an exception
### Idea: how to create unique ID's
  To create unique ID's you can use the following code snippets among others:
  ```javascript
  //Ideal if you need to generate ID's fast. 
  //Math.round() is used to get rid of the decimal separator
  Math.round(Math.random()*Number.MAX_SAFE_INTEGER)).toString(36)
  ```
  ```javascript
  //Ideal to create ID's on user demand.
  //uniqueness not guaranteed if called very frequently (don't use it on loops)
  Date.now().toString(36)
  ```

# Implementation
The initial state is defined as a single empty object called `variables` that will be used as a dictionary.
The actions described on the previous section are implemented as state handlers (just those that doesn't return anything), and the actions that need to return a value, should be performed by the programmer on their code.
Adding a variable is done by creating a new property on the `variables` object

# Examples

This example shows a text whose value can be modified by pressing the keys `+` and `-` on the keyboard (play with it [here](/vr-programming/scenes/examples/variables-state.html))

```html
  <html>
    <head>
        <script src="https://aframe.io/releases/1.2.0/aframe.js"></script>
        <script src="https://unpkg.com/aframe-state-component@7.1.0/dist/aframe-state-component.js"></script>
        <script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/variables-system.js"></script>
    </head>
    <body>
        <a-scene>
            <!-- With the component 'bind', we can map a property to a variable -->
            <a-text position="0 1.6 -1" color="black" side="double" bind="value:variables.textValue"></a-text>
        </a-scene>
        <script>
            let scene = document.querySelector('a-scene');
            //Create the variable
            scene.emit('createVariable',{name:'textValue'});
            //Define a handler to change it's value
            document.addEventListener('keypress',(evt)=>{
                let currentValue = scene.systems['state'].state.variables['textValue'];
                switch(evt.key){
                    case '+':
                        scene.emit('setVariable',{name:'textValue',value:currentValue+1.0});
                        break;
                    case '-':
                        scene.emit('setVariable',{name:'textValue',value:currentValue-1.0});
                        break;
                }
            });
        </script>
    </body>
  </html>
```

Using this state doesn't create or delete elements on the DOM, only changes their attributes