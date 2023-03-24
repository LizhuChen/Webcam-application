const video = document.querySelector('#webcam');
const canvas = document.querySelector('#outputCanvas');

const Case1_Button = document.querySelector('#Case1_Button');
const Case2_Button = document.querySelector('#Case2_Button');

const enableWebcamButton = document.querySelector('#enableWebcamButton');
const disableWebcamButton = document.querySelector('#disableWebcamButton');

const enableWebcamButton2 = document.querySelector('#enableWebcamButton2');
const disableWebcamButton2 = document.querySelector('#disableWebcamButton2');

const disableT_H = document.querySelector('#TH');
const disableT_L = document.querySelector('#TL');

const video2 = document.querySelector('#webcam2');
const canvas2 = document.querySelector('#outputCanvas2');

var TH_value = 100 ;
var TL_value = 200 ;

function processFormData() {
	TH_value = parseInt(document.getElementById("TH").value);
	TL_value = parseInt(document.getElementById("TL").value);
}


function onOpenCvReady() {
  document.querySelector('#status').innerHTML = 'opencv.js is ready.';
  /* enable the button */
  Case1_Button.disabled = false;
  Case2_Button.disabled = false;
}


function getUserMediaSupported() {

  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);

}
  
   
Case1_Button.addEventListener("click", (e) => {
	enableWebcamButton.disabled = false;

	Case2_Button.disabled = true ;
	enableWebcamButton2.disabled = true ;
	disableWebcamButton2.disabled = true ;
	
});

Case2_Button.addEventListener("click", (e) => {
	enableWebcamButton2.disabled = false;
	Case1_Button.disabled = true ;

	enableWebcamButton.disabled = true ;
	disableWebcamButton.disabled = true ;
	
});


if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
  disableWebcamButton.addEventListener('click', disableCam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

if (getUserMediaSupported()) {
  enableWebcamButton2.addEventListener('click', enableCam2);
  disableWebcamButton2.addEventListener('click', disableCam2);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

function enableCam(event) {
  /* disable this button once clicked.*/
  event.target.disabled = true;
    
  /* show the disable webcam button once clicked.*/
  disableWebcamButton.disabled = false;
  disableT_H.disabled = false;
  disableT_L.disabled = false;

  /* show the video and canvas elements */
  document.querySelector("#liveView").style.display = "block";


  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true
  };
  
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
    video.addEventListener('loadeddata', processVid);

  })
  .catch(function(err){
    console.error('Error accessing media devices.', error);
  });
  

};

function enableCam2(event) {
  /* disable this button once clicked.*/
  event.target.disabled = true;
    
  /* show the disable webcam button once clicked.*/
  disableWebcamButton2.disabled = false;

  /* show the video and canvas elements */
  document.querySelector("#liveView2").style.display = "block";

  // getUsermedia parameters to force video but not audio.
  
  const constraints = {
    video: true
  };
  

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
	video2.srcObject = stream;
    video2.addEventListener('loadeddata', processVid2);
  })
  .catch(function(err){
    console.error('Error accessing media devices.', error);
  });
  
  
};

function disableCam(event) {
    event.target.disabled = true;
    Case1_Button.disabled = false;
	Case2_Button.disabled = false;
	disableT_H.disabled = true;
	disableT_L.disabled = true;

    /* stop streaming */
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    })
  
    /* clean up. some of these statements should be placed in processVid() */
    video.srcObject = null;
    video.removeEventListener('loadeddata', processVid);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#liveView").style.display = "none";
}

function disableCam2(event) {
    event.target.disabled = true;
    Case1_Button.disabled = false;
	Case2_Button.disabled = false;

    video2.srcObject.getTracks().forEach(track => {
      track.stop();
    })
  
    /* clean up. some of these statements should be placed in processVid() */
    video2.srcObject = null;
    video2.removeEventListener('loadeddata', processVid2);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#liveView2").style.display = "none";

}

function processVid() {

    if (video.srcObject == null) {
      return;
    }

    let cap = new cv.VideoCapture(video);
    /* 8UC4 means 8-bit unsigned int, 4 channels */
    let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    cap.read(frame);
    processFrame(frame);
	
}

function processVid2() {

    if (video2.srcObject == null) {
      return;
    }

    let cap = new cv.VideoCapture(video2);
    /* 8UC4 means 8-bit unsigned int, 4 channels */
    let frame = new cv.Mat(video2.height, video2.width, cv.CV_8UC4);
    cap.read(frame);
    processFrame2(frame);
	
}


function processFrame(src) {
	processFormData();
    let dst = new cv.Mat();
	let dst2 = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.Canny(dst, dst2, TH_value, TL_value);
    cv.imshow('outputCanvas', dst2);
    src.delete();
    dst.delete();
	dst2.delete();

    /* Call this function again to keep processing when the browser is ready. */
    window.requestAnimationFrame(processVid);
}

function processFrame2(src) {

    let dst = new cv.Mat();
	let img_gray = new cv.Mat();
	let img_invert = new cv.Mat();
	let img_smoothing = new cv.Mat();
    cv.cvtColor(src, img_gray, cv.COLOR_RGBA2GRAY);
	cv.bitwise_not(img_gray, img_invert);
	
	let ksize = new cv.Size(21, 21);
	cv.GaussianBlur(img_invert,img_smoothing,ksize,0,borderType = cv.BORDER_DEFAULT );
	
	cv.bitwise_not(img_smoothing, img_smoothing);


	cv.divide(img_gray, img_smoothing, dst, scale=256, dtype = -1);
	
    cv.imshow('outputCanvas2', dst);
    src.delete();
    dst.delete();
	img_gray.delete();
	img_invert.delete();
	img_smoothing.delete();
	
    /* Call this function again to keep processing when the browser is ready. */
    window.requestAnimationFrame(processVid2);
}




