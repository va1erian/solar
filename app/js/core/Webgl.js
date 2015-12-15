import {Detector} from 'js/core/Detector';

export default class WebGLContext {
	constructor( ){
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(70, 0, 1, 5000);
		this.camera.position.z = 150;
		this.camera.position.y = 150;
		this.camera.position.x = 150;
		this.renderer = Detector.webgl? new THREE.WebGLRenderer({antialias :true}): new THREE.CanvasRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setClearColor(0x0c171a);
		this.dom = this.renderer.domElement;


		this._binds = {};
		this._binds.onUpdate = this._onUpdate.bind( this );
		this._binds.onResize = this._onResize.bind( this );
	}

	init() {
		window.addEventListener( "orientationchange", this._binds.onResize, false );
		this._onResize();
	}

	add(mesh) {
		this.scene.add(mesh);
	}
	
	_onUpdate() {
		this.renderer.autoClear = false;
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
	}

	_onResize() {
		let width = window.innerWidth;
		let height = window.innerHeight;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}
}
