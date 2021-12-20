---
title: "assets-manager"
date: 2021-12-14T16:56:47+01:00
draft: false
---

# Purpose
System that allows the programmer to load assets easily at runtime and handles the loading failures

# Usage
Import the JavaScript file on the `<head>` of the html with the following tag:
```html
<script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/assets-manager.js"></script>
```
To access the system in your code, you'll need a reference to the scene element, which can be obtained inside your component by doing this:
```javascript
let assetsManager = this.el.sceneEl.systems['assets-manager'];
```
Once you have a reference to the system, it exposes two functions:
+ add(`id`,`path`)
  This function creates a new asset tag inside `<a-assets>` which would be `<audio>`, `<img>`, `<video>` or `<a-asset-item>` depending on the extension of the file referred in **path**. Note that the `id` must be unique (to point the asset, you'll need to add an # before this `id`) and an error will be thrown if it's not.
  If the resource pointed by `path` can't be accessed or fails to load, it's corresponding asset tag will be removed and that `id` will become available again (It's programmed this way to keep a-assets populated only with the assets that loaded correctly and are ready to use)
+ remove(`id`)
  This function removes the asset tag with the id `id` and marks it as available, it's faster than using querySelector() because it relies on the [A-Frame's Asset Management System](https://aframe.io/docs/1.2.0/core/asset-management-system.html)
  
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
As soon as the system is initialized, it creates internally a Set() to store the used IDs and a reference to the `<a-assets>` element inside the scene. If the a-assets element can't be found, it's created and in case it already exists (because it is on the HTML and not generated with JavaScript), the system loops through it's children storing their IDs to avoid duplicates when adding more assets at runtime.

Finally, an error handler is set to the fileLoader to catch the asset loading errors and remove the corresponding element inside `<a-assets>`
```javascript
this.assetsTag.fileLoader.manager.onError = this.errorHandler;

function errorHandler(evt) {
  let failedAsset = this.assetsTag.querySelector('[src=\''+evt+'\']');
  this.delete(failedAsset.id);
  console.info('Asset tag for resource \''+evt+'\' has been removed due a problem loading it');
}
```

# Examples

This example shows how to display an .OBJ model loading it's resources at runtime (play with it [here](/vr-programming/scenes/examples/assets-manager.html))

```html
  <html>
    <head>
      <script src="https://aframe.io/releases/1.2.0/aframe.js"></script>
      <script src="https://raw.githubusercontent.com/jdjuli/vr-programming/main/static/js/assets-manager.js"></script>
    </head>
    <body>
      <a-scene>
      </a-scene>
      <script>
            let scene = document.querySelector('a-scene');
            let assetsMgr = scene.systems['assets-manager'];
            assetsMgr.add('model','/models/box.obj');
            assetsMgr.add('texture','/textures/blue_wall.png');
            let entity = document.createElement('a-entity');
            entity.setAttribute('position',{x:0, y:1, z:-1});
            entity.setAttribute('scale',{x:10,y:10,z:10});
            entity.setAttribute('obj-model',{obj:'#model'});
            entity.setAttribute('material',{src:'#texture'});
            scene.appendChild(entity);
      </script>
    </body>
  </html>
```

As soon as our script is executed, we can see the changes on the scene (a lot of code has been removed here for clarity):
```html
<a-scene (...)>
  <a-assets>
    <a-asset-item id="model" src="/models/box.obj"></a-asset-item>
    <img id="texture" src="/textures/blue_wall.png">
  </a-assets>
  (...)
  <a-entity position="" scale="" obj-model="" material=""></a-entity>
  (...)
</a-scene>
```
