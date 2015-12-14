/* global THREE */
import WebGLContext from 'js/core/Webgl';
import loop from 'js/core/Loop';
import { UpdateCamCallback } from 'js/components/WebCamTexture';
import { CelestialBody, makeOrbitCircle } from 'js/components/CelestialBody';
import BodyManipulator from 'js/components/BodyManipulator';
import OrbitControlsFactory from 'js/vendors/OrbitControls';


let system = {
	'sun' : {
		radius: 20,
		distance: 0,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'mercury' : {
		radius: 0.382,
		distance: 53.9,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'venus' : {
		radius: 0.948,
		distance: 57.2,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'earth' : {
		radius: 1,
		distance: 60,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'mars' : {
		radius: 0.532,
		distance: 75.2,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'jupiter' : {
		radius: 11.2,
		distance: 102,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'saturn' : {
		radius: 9.44,
		distance: 195.5,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'uranus' : {
		radius: 4,
		distance: 310.2,
		orbitalSpeed : 1,
		rotationSpeed: 1
	},
	'neptune' : {
		radius: 3.88,
		distance: 360.1,
		orbitalSpeed : 1,
		rotationSpeed: 1
	}
}


let webgl = new WebGLContext();

webgl.init();
document.body.appendChild( webgl.dom );
loop.add(webgl._binds.onUpdate);

/*let gui = new dat.GUI();
gui.add(props, 'rotation', 0.01, 1);
gui.close();*/

let light = new THREE.PointLight( 0xffffff, 2, 500);
light.position.set(0, 0, 0);
webgl.add(light);

for(var planet in system) addBody(planet, system[planet]);

let sky = makeSkySphere();
webgl.add(sky);

const OrbitControls = OrbitControlsFactory(THREE);
const controls = new OrbitControls(webgl.camera);

const manipulator = new BodyManipulator(webgl.scene, webgl.camera);
loop.add(UpdateCamCallback);
loop.start();

// ##
// ON RESIZE
window.addEventListener( "resize", () => {
	webgl._binds.onResize();
}, false );

function addBody (name, props) {
	let body = new CelestialBody(name, props);
	if(props.distance != 0) {
		body.primary = 'sun';
		webgl.add(makeOrbitCircle(body));
	}
	webgl.add(body);
	loop.add(body._binds.onUpdate);
}

function makeSkySphere() {
	
	let texture = THREE.ImageUtils.loadTexture('img/' + 'space' + '.jpg');
	texture.wrapS = THREE.RepeatWrapping; // You do not need to set `.wrapT` in this case

	texture.offset.x = 4 * Math.PI ;
	let material = new THREE.MeshBasicMaterial({ 
		map : texture
	});		
	
	let geometry = new THREE.SphereGeometry( 4000, 60, 40 );
	
	let skyMesh = new THREE.Mesh(geometry, material);
	skyMesh.scale.set(-1, 1, 1);  
	skyMesh.eulerOrder = 'XZY';  
	skyMesh.renderDepth = 5000;  
	
	return skyMesh;
}