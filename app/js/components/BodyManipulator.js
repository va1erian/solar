import { CelestialBody, makeOrbitCircle } from 'js/components/CelestialBody';

export var AnimationSpeed = 1;

export class BodyManipulator {
	constructor(scene, camera) {
		this.scene  = scene;
		this.camera = camera;
		this.raycaster = new THREE.Raycaster();
		this.mouse     = new THREE.Vector2();
		this.oldMouse  = this.mouse.clone();
		
		this.moveListener =  this.onMouseMove.bind(this);
		
		window.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
		window.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
		window.addEventListener( 'keydown', this.onKeyDown.bind(this), false);
		
	}
	
	onMouseDown(event) {
		if(event.ctrlKey && !this.down) {
			this.down = true;
			this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
			window.addEventListener( 'mousemove', this.moveListener, false );
		}
	}
	
	onMouseMove(event) {
		if(!this.down) return;
		this.oldMouse = this.mouse.clone();
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
		
		if(this.lockedPlanet == undefined) {
			this.raycaster.setFromCamera(this.mouse, this.camera);
			const intersects = this.raycaster.intersectObjects(this.scene.children);
			const planetIndex = intersects.findIndex(el => el.object instanceof CelestialBody);
			if(planetIndex != -1) this.lockedPlanet = intersects[planetIndex].object;
		} else {
			this.lockedPlanet.isDragged = true;
			const diff = this.mouse.x - this.oldMouse.x; 
			this.lockedPlanet.distance -= diff * window.innerWidth / 2;
		}
	}
	
	onMouseUp(event) {
		this.down = false;
		if(this.lockedPlanet != undefined) {
			this.lockedPlanet.isDragged = false;
			this.scene.remove(this.lockedPlanet.orbitCircle);
			this.scene.add(makeOrbitCircle(this.lockedPlanet));
			this.lockedPlanet = undefined;
		}
		window.removeEventListener( 'mousemove', this.moveListener, false );
	}
	
	onKeyDown(event) {
		switch(event.key) {
			case 'p' : AnimationSpeed += 0.5; return;
			case 'o' : AnimationSpeed -= 0.5; return;
		}
	}
}

