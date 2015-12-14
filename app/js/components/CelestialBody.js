import { WebCamTexture, IsCamAvailable } from 'js/components/WebCamTexture';

export class CelestialBody extends THREE.Mesh {
	constructor(name, props) {
		
		let material;
		if(name == 'sun') {
			material = new THREE.MeshBasicMaterial({ 
				map : IsCamAvailable ? WebCamTexture : THREE.ImageUtils.loadTexture('img/' + name + '.jpg')
			});	
		} else {
			material = new THREE.MeshPhongMaterial({ 
				map : THREE.ImageUtils.loadTexture('img/' + name + '.jpg')
			});	
		}
			
		let geometry = new THREE.SphereGeometry( props.radius, 16, 16 );
		
		super(geometry, material);
		
		this.name = name;
		this.radius = props.radius;
		this.distance = props.distance;
		this.orbitalSpeed  = props.orbitalSpeed;
		this.rotationSpeed = props.rotationSpeed;
		
		this.revolution = 0;
		this.day = 0;
		this.isDragged = false;

		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind(this);
	}

	_onUpdate(delta) {
		if(this.primary != undefined ) {
			this.position.x = this.distance * Math.cos(this.revolution);
			this.position.z = this.distance * Math.sin(this.revolution);
			
			if(!this.isDragged) this.revolution += this.orbitalSpeed * 0.5 / delta;
			this.rotateY(this.rotationSpeed / delta);
			
		}
	}
}


export function makeOrbitCircle(body) {
		//add orbit circle
		let material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
		let geometry = new THREE.CircleGeometry( Math.abs(body.distance), 64 );
		
		// Remove center vertex
		geometry.vertices.shift();
		
		var orbitCircle = new THREE.Line( geometry, material );
		orbitCircle.rotateX(Math.PI / 2);
		
		body.orbitCircle = orbitCircle;
		
		return orbitCircle;
}