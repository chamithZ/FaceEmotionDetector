const videoElement = document.getElementById('videoElement');

async function startVideo() {
    console.log("startVideo");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoElement.srcObject = stream;
    } catch (err) {
        console.error(err);
    }
}

videoElement.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(videoElement);
    document.body.append(canvas);

    const displaySize = { width: videoElement.width, height: videoElement.height };
    faceapi.matchDimensions(canvas, displaySize);


    setInterval(async () => {
       
        const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        
       // this is where the error is thrown
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
       
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        console.log(detections)
    }, 100);
});

// videoElement.addEventListner( 'play', ()=>{
//     console.log("first")
//     const canvas = faceapi.createCanvasFromMedia(videoElement);
//     const displaySize = { width: videoElement.width, height: videoElement.height };
//     document.body.append(canvas);

//     setInterval(async () => {
//         const canvas = faceapi.createCanvasFromMedia(videoElement);
//         document.body.append(canvas);
//         const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

//         console.log(detections); // this is where the error is thrown
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);

//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//     }, 100);
// }
// );

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);
