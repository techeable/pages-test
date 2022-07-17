import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function vec3(x,y,z){ return new THREE.Vector3(x,y,z); }
function quat(axis, angle){ return new THREE.Quaternion().setFromAxisAngle(axis, angle); }

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.copy(vec3(3,1,6));
// camera.lookAt(vec3(3,0,0));
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(cube);

/**
 * Textured Cube
 */
const texture = new THREE.TextureLoader().load( 'assets/tex1.png' );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

const materialTex = new THREE.MeshBasicMaterial( { map: texture } )
const cubeTex = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ).translate(2,0,0), materialTex );
scene.add( cubeTex );

function quad(position, rotation, texture){
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0,
        1.0,  1.0,  0.0,

        1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0
    ] );

    const uvs = new Float32Array( [
        0.0, 0.0,
        1.0, 0.0,
        1.0,  1.0,

        1.0,  1.0,
        0.0,  1.0,
        0.0, 0.0
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    
    const tex = new THREE.TextureLoader().load( 'assets/tex1.png' );
    const materialTex = new THREE.MeshBasicMaterial( { map: tex } )

    // const material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
    const mesh = new THREE.Mesh( geometry, materialTex );
    mesh.position.copy(position);
    mesh.rotation.setFromQuaternion(rotation);
    // cam.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI/8 ));
    
    scene.add(mesh);
}

quad(vec3(4,0,1), quat(vec3(0,1,0), 0), 'assets/tex1.png');

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

console.log(renderer.capabilities.maxTextureSize);

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()