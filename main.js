import * as THREE from './node_modules/three'
import {OBJLoader} from './node_modules/three/examples/jsm/loaders/OBJLoader'

// create group
// add to scene

// create frameUpdater
// create Object4D
// add Object4D to frameUpdateArray

// animate calls frameUpdateFunction every frame

function createDumbbell() {
  const group = new THREE.Group();

  const weightGeometry = new THREE.CylinderGeometry( 0.4, 0.4, 0.3 );
  const weightMaterial = new THREE.MeshNormalMaterial();

  const weightRight = new THREE.Mesh( weightGeometry, weightMaterial );
  weightRight.position.set( 0.5, 0, 0 );
  weightRight.rotation.set( 0, 0, Math.PI / 2 );

  const weightLeft = new THREE.Mesh( weightGeometry, weightMaterial );
  weightLeft.position.set( -0.5, 0, 0 );
  weightLeft.rotation.set( 0, 0, Math.PI / 2 );

  const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 1.5 );
  const material = new THREE.MeshNormalMaterial();

  const bar = new THREE.Mesh( geometry, material );
  bar.position.set( 0, 0, 0 );
  bar.rotation.set( 0, 0, Math.PI / 2 );

  group.add(weightLeft);
  group.add(weightRight);
  group.add(bar);

  return group;
}

class BouncingObject {
  group
  frameUpdater
  limit = {
    x: 2,
    y: 2,
    z: 2,
  }
  direction = {
    x: 1,
    y: 1,
    z: 1,
  }
  rotationRate = 1000;

  constructor(group, frameUpdater, limit) {
    this.group = group;
    this.frameUpdater = frameUpdater
    this.limit = limit;
    
    this.rotationRate = 10000 * Math.random();
  } 

  updateFrame(time) {
    this.frameUpdater(
      this.group, 
      this.limit, 
      this.direction,
      this.rotationRate,
      time
    );
  }
}

const bouncingFrameUpdater = (group, limit, direction, rotationRate, time) => {
  group.rotation.x = time / rotationRate;
  group.rotation.y = time / rotationRate;

  const worldPosition = new THREE.Vector3();
  const position = group.getWorldPosition(worldPosition);

  if (position.x > limit.x) {
    direction.x = -1 * Math.random()
  } else if (position.x < -limit.x) {
    direction.x = 1 * Math.random()
  } 

  if (position.y > limit.y) {
    direction.y = -1 * Math.random()
  } else if (position.y < -limit.y) {
    direction.y = 1 * Math.random()
  } 

  if (position.z > limit.z) {
    direction.z = -1 * Math.random()
  } else if (position.z < -limit.z) {
    direction.z = 1 * Math.random()
  } 

  const newPositionX = position.x + (direction.x * 0.1);
  const newPositionY = position.y + (direction.y * 0.1);
  const newPositionZ = position.z + (direction.z * 0.1);

  group.position.x = newPositionX;
  group.position.y = newPositionY;
  group.position.z = newPositionZ;
}

// init
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100000 );
camera.position.z = 10;

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight)

const animationObjects = [];

const limit = {
  x: 4,
  y: 4,
  z: 10,
}

const loader = new OBJLoader();

for (let i = 0; i < 5; i++) {
  const hilux = await loader.loadAsync('models/hilux.obj')
  hilux.children.map(c => {
    c.material = new THREE.MeshNormalMaterial(); 
  })
  hilux.scale.set(0.05, 0.05, 0.05)
  scene.add(hilux)
  const bouncingHilux = new BouncingObject(hilux, bouncingFrameUpdater, limit)
  animationObjects.push(bouncingHilux);
}

for (let i = 0; i < 50; i++) {

  const treble = await loader.loadAsync('models/treble.obj')
  treble.children.map(c => {
    c.material = new THREE.MeshNormalMaterial(); 
  })
  treble.scale.set(0.001, 0.001, 0.001)
  scene.add(treble)
  const bouncingTreble = new BouncingObject(treble, bouncingFrameUpdater, limit)
  animationObjects.push(bouncingTreble);
  
  const dumbell = createDumbbell();
  scene.add(dumbell)
  const bouncingDumbell = new BouncingObject(dumbell, bouncingFrameUpdater, limit)
  animationObjects.push(bouncingDumbell);
}

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation
function animation( time ) {
  animationObjects.map(o => {
    o.updateFrame(time);
  })

  renderer.render( scene, camera );
}


// rebix

// const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
// camera.position.z = 10;

// const scene = new THREE.Scene();
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );

// const group1 = createXYslabWithMesh(0);
// scene.add(group1)
// const group2 = createXYslabWithMesh(1);
// scene.add(group2)
// const group3 = createXYslabWithMesh(2);
// scene.add(group3)


// const renderer = new THREE.WebGLRenderer( { antialias: true } );
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setAnimationLoop( animation );
// document.body.appendChild( renderer.domElement );

// function createXYslabWithMesh(z) {
//   const group = new THREE.Group();

//   for (var x = 0; x < 3; x++) {
//     for (var y = 0; y < 3; y++) {
//       const color = new THREE.Color( x * 0.1, y * 0.1, 0.5);
//       const material = new THREE.MeshBasicMaterial({ color: color});
//       var mesh = new THREE.Mesh(geometry, material);
//       mesh.position.x = x - 1;
//       mesh.position.y = y - 1;
//       mesh.position.z = z - 1;
//       group.add(mesh);  
//     }
//   }
//   return group;
// }

// // animation
// function animation( time ) {
//   group1.rotation.z = time / 500;
//   group2.rotation.z = time / 200;
//   group3.rotation.z = time / 1000;

//   group1.rotation.y = time / 500;
//   group2.rotation.y = time / 500;
//   group3.rotation.y = time / 500;

//   group1.rotation.x = time / 500;
//   group2.rotation.x = time / 500;
//   group3.rotation.x = time / 500;

//   renderer.render( scene, camera );
// }