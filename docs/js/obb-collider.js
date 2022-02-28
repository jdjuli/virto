/**
 * Original code taken from https://github.com/n5ro/aframe-extras/blob/master/src/misc/sphere-collider.js
 * 
 * Modifications have been made to detect collisions between a sphere (collider) and oriented bounding boxes (OBB's)
 */

AFRAME.registerComponent('obb-collider', {
  schema: {
    objects: { default: '' },
    state: { default: 'collided' },
    radius: { default: 0.05 },
    watch: { default: true }
  },

  init: function init() {
    /** @type {MutationObserver} */
    this.observer = null;
    /** @type {Array<Element>} Elements to watch for collisions. */
    this.els = [];
    /** @type {Array<Element>} Elements currently in collision state. */
    this.collisions = [];

    this.handleHit = this.handleHit.bind(this);
    this.handleHitEnd = this.handleHitEnd.bind(this);
  },

  remove: function remove() {
    this.pause();
  },

  play: function play() {
    var sceneEl = this.el.sceneEl;

    if (this.data.watch) {
      this.observer = new MutationObserver(this.update.bind(this, null));
      this.observer.observe(sceneEl, { childList: true, subtree: true });
    }
  },

  pause: function pause() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  /**
   * Update list of entities to test for collision.
   */
  update: function update() {
    var data = this.data;
    var objectEls = void 0;

    // Push entities into list of els to intersect.
    if (data.objects) {
      objectEls = this.el.sceneEl.querySelectorAll(data.objects);
    } else {
      // If objects not defined, intersect with everything.
      objectEls = this.el.sceneEl.children;
    }
    // Convert from NodeList to Array
    this.els = Array.prototype.slice.call(objectEls);
    this.els.map((e)=>{
      let mesh = e.getObject3D('mesh');

      if(!e.hasLoaded || !mesh){
        e.addEventListener('model-loaded',()=>{
          e.halfExtents = (new THREE.Box3().setFromObject(e.object3D)).getSize(new THREE.Vector3()).divideScalar(2);
        });
        return;
      }

      if(mesh.isGroup){
        e.halfExtents = (new THREE.Box3().setFromObject(e.object3D)).getSize(new THREE.Vector3()).divideScalar(2);
      }else{
        let geometry = mesh.geometry;
        let parameters = geometry.parameters;
        switch (geometry.type){
          case 'BoxGeometry':
            e.halfExtents = new THREE.Vector3(parameters.width/2,parameters.height/2,parameters.depth/2);
            break;
          default:
            e.halfExtents = (new THREE.Box3().setFromObject(e.object3D)).getSize(new THREE.Vector3()).divideScalar(2);
            break;
        }
      }
    })
  },

  tick: function () {
    var position = new THREE.Vector3(), //Posicion del colisionador en el mundo
        localPosition = new THREE.Vector3(),
        absLocalPosition = new THREE.Vector3(),
        colliderScale = new THREE.Vector3(),
        distance = new THREE.Vector3(),
        distanceMap = new Map();
    return function () {
      var el = this.el,
          data = this.data,
          mesh = el.getObject3D('mesh'),
          collisions = [];
      var colliderRadius = void 0;

      if (!mesh) {
        return;
      }

      distanceMap.clear();
      // Calculate collider radius
      el.object3D.localToWorld(position.set(0,0,0));
      el.object3D.getWorldScale(colliderScale);
      colliderRadius = data.radius * scaleFactor(colliderScale);

      // Update collision list.
      this.els.forEach(intersect);

      // Emit events and add collision states, in order of distance.
      collisions.sort(function (a, b) {
        return distanceMap.get(a) > distanceMap.get(b) ? 1 : -1;
      }).forEach(this.handleHit);

      // Remove collision state from current element.
      if (collisions.length === 0) {
        el.emit('hit', { el: null });
      }

      // Remove collision state from other elements.
      this.collisions.filter(function (el) {
        return !distanceMap.has(el);
      }).forEach(this.handleHitEnd);

      // Store new collisions
      this.collisions = collisions;

      // Bounding sphere collision detection
      function intersect(el) {
        var mesh = void 0;

        if (!el.isEntity) {
          return;
        }

        mesh = el.getObject3D('mesh');

        if (!mesh) {
          return;
        }

        if(!el.halfExtents){
          el.halfExtents = (new THREE.Box3().setFromObject(el.object3D)).getSize(new THREE.Vector3()).divideScalar(2);
        }
        
        localPosition = el.object3D.worldToLocal(position.clone());
        absLocalPosition.set(Math.abs(localPosition.x),Math.abs(localPosition.y),Math.abs(localPosition.z));
        distance.subVectors(absLocalPosition,el.halfExtents);

        if (distance.x < colliderRadius && distance.y < colliderRadius && distance.z < colliderRadius) {
          collisions.push(el);
          distanceMap.set(el, distance.length());
        }
      }
      // use max of scale factors to maintain bounding sphere collision
      function scaleFactor(scaleVec) {
        return Math.max.apply(null, scaleVec.toArray());
      }
    };
  }(),

  handleHit: function handleHit(targetEl) {
    targetEl.emit('hit');
    targetEl.addState(this.data.state);
    this.el.emit('hit', { el: targetEl });
  },
  handleHitEnd: function handleHitEnd(targetEl) {
    targetEl.emit('hitend');
    targetEl.removeState(this.data.state);
    this.el.emit('hitend', { el: targetEl });
  }
});