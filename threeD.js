
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


let mixer;

const clock = new THREE.Clock();
const container = document.getElementById( 'container' );

// const stats = new Stats();
// container.appendChild( stats.dom );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

const pmremGenerator = new THREE.PMREMGenerator( renderer );

const scene = new THREE.Scene();
//couleur background xD
scene.background = new THREE.Color( 0xffffff);
scene.environment = pmremGenerator.fromScene( new RoomEnvironment( renderer ), 0.04 ).texture;

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Couleur blanche, intensité 2
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( 5, 2, 8 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/libs/draco/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );
//manova an ilay modele xD... ilay lien soloina rehefa hanolo modele .glb noraisina eto xD
loader.load( 'assets/medieval_fantasy_book.glb', function ( gltf ) {

    const model = gltf.scene;
    model.position.set( 1, 1, 0 );
    model.scale.set( 0.08, 0.08, 0.08 );
    scene.add( model );
//ito mampandeha an io animation efa ao anatin le 3d ito ... nalaina tamin sketchfab 
    mixer = new THREE.AnimationMixer( model );
    mixer.clipAction( gltf.animations[ 0 ] ).play();
//

    renderer.setAnimationLoop( animate );

}, undefined, function ( e ) {

    console.error( e );

} );


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};


function animate() {

    const delta = clock.getDelta();

    mixer.update( delta );

    controls.update();

    // stats.update();

    renderer.render( scene, camera );

}
