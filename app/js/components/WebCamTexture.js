

var video = document.getElementById( 'monitor' );
var videoImage = document.getElementById( 'videoImage' );
var ctx = videoImage.getContext( '2d' );

initWebCam();
ctx.fillStyle = '#000000';
ctx.fillRect( 0, 0, videoImage.width, videoImage.height );

export var WebCamTexture = new THREE.Texture(videoImage);

WebCamTexture.minFilter = THREE.LinearFilter;
WebCamTexture.magFilter = THREE.LinearFilter;

function initWebCam() {
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.URL = window.URL || window.webkitURL;
	
	if (!navigator.getUserMedia) {
		console.log('No web cam available');
	} else {
		navigator.getUserMedia({video: true}, gotStream, noStream);
	}
}

function gotStream(stream) {
	let camvideo = document.getElementById( 'monitor' );
	if (window.URL) 
	{   camvideo.src = window.URL.createObjectURL(stream);   } 
	else // Opera
	{   camvideo.src = stream;   }

	camvideo.onerror = function(e) 
	{   stream.stop();   };

	stream.onended = noStream;
}

function noStream(e) {
	var msg = 'No camera available.';
	if (e.code == 1) 	{   
		msg = 'User denied access to use camera.';   
	}
	console.warn(msg);
}

export function UpdateCamCallback() {
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
		ctx.drawImage( video, 0, 0, videoImage.width, videoImage.height );
	}
	WebCamTexture.needsUpdate = true;
}
	