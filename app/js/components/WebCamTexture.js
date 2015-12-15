

var video = document.getElementById( 'monitor' );
var videoImage = document.getElementById( 'videoImage' );
var ctx = videoImage.getContext( '2d' );

initWebCam();
ctx.fillStyle = '#FFDF40';
ctx.fillRect( 0, 0, videoImage.width, videoImage.height );

export var WebCamTexture = new THREE.Texture(videoImage);
export var IsCamAvailable = true;

WebCamTexture.minFilter = THREE.LinearFilter;
WebCamTexture.magFilter = THREE.LinearFilter;

function initWebCam() {
	navigator.getUserMedia = ( navigator.getUserMedia ||
								navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia ||
								navigator.msGetUserMedia);
	
	if (!navigator.mediaDevices) {
		console.log("getUserMedia() not supported.");
		return;
	}
	
	// Prefer camera resolution nearest to 1280x720.
	
	var constraints = { audio: true, video: { width: 1280, height: 720 } };
	
	navigator.mediaDevices.getUserMedia(constraints)
		.then(gotStream)
		.catch(noStream);
}

function gotStream(stream) {
	let camvideo = document.getElementById( 'monitor' );
	if (window.URL) {   
		camvideo.src = window.URL.createObjectURL(stream);  
	} 
	else {  
		 camvideo.src = stream;
	}
	IsCamAvailable = true;
	video.onloadedmetadata = function(e) {
		video.play();
	};
	camvideo.onerror = function(e) {
		stream.stop();   
	};
	
	stream.onended = noStream;
}

function noStream(e) {
	var msg = 'No camera available.';
	if (e.code == 1) 	{   
		msg = 'User denied access to use camera.';   
	}
	
	IsCamAvailable = false;
	console.warn(msg);
}

export function UpdateCamCallback() {
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
		ctx.drawImage( video, 0, 0, videoImage.width, videoImage.height );
	}
	WebCamTexture.needsUpdate = true;
}
	