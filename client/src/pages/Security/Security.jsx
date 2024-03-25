import  { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmPose from '@teachablemachine/pose';
import axios from 'axios';

const Security= () => {
  const canvasRef = useRef(null);
  const labelContainerRef = useRef(null);
  const outputRef = useRef(null);
  const webcamRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    let model, webcam, ctx, labelContainer, maxPredictions;

    const init = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/zlnlBPeEO/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      model = await tmPose.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      const size = 400;
      const flip = true;
      webcam = new tmPose.Webcam(size, size, flip);
      webcamRef.current = webcam;

      const loop = async () => {
        if (isStarted) {
          webcam.update();
          await predict();
        }
        window.requestAnimationFrame(loop);
      };

      const predict = async () => {
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
          const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;

          if (
            prediction[3].probability.toFixed(2) >= 0.98 ||
            prediction[4].probability.toFixed(2) >= 0.98 ||
            prediction[5].probability.toFixed(2) >= 0.98 ||
            prediction[6].probability.toFixed(2) >= 0.98 ||
            prediction[7].probability.toFixed(2) >= 0.98
          ) {
            outputRef.current.innerHTML = "Suspicious activity";
            sendToDatabase();
          } else {
            outputRef.current.innerHTML = "Normal activity";
          }
        }

        drawPose(pose);
      };

      const drawPose = (pose) => {
        if (isStarted && webcam.canvas) {
          ctx.drawImage(webcam.canvas, 0, 0);
          if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
          }
        }
      };

      const startCamera = async () => {
        await webcam.setup();
        await webcam.play();
        const canvasElement = canvasRef.current;
        if (canvasElement) {
          canvasElement.width = size;
          canvasElement.height = size;
          ctx = canvasElement.getContext("2d");
          labelContainer = labelContainerRef.current;
          for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
          }
          window.requestAnimationFrame(loop);
        }
      };

      startCamera();
    };

    init();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
    };
  }, [isStarted]);

  const sendToDatabase = async () => {
    const canvasElement = canvasRef.current;
    const videoStream = webcamRef.current.stream;

    // Convert canvas image to base64 data URL
    const screenshotDataUrl = canvasElement.toDataURL();

    // Create a blob from the video stream
    const videoBlob = new Blob([videoStream], { type: 'video/webm' });

    // Send the video and screenshot data to the backend server for storage
    const formData = new FormData();
    formData.append("video", videoBlob);
    formData.append("screenshot", screenshotDataUrl);

    axios
      .post("http://localhost:5000/camera/upload", formData)
      .then((response) => {
        console.log("Video and screenshot uploaded successfully.");
      })
      .catch((error) => {
        console.error("Error uploading video and screenshot:", error);
      });
  };
  const handleStartClick = () => {
    setIsStarted(true);
  };
  

const loop = async (timestamp) => {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
};


  return (
    <div className='w-1/2 h-full bg-yellow-50 flex flex-col items-center ml-20  mt-10 mb-10 border-2 rounded-lg' >
      <h1 className='text-[20px] font-bold text-red-900 mt-20 '>Suspicious Activity Detector Camera</h1>
      <p className='text-[18px] font-semibold'>Recognize Movement</p>
      <p ref={outputRef} id="output"></p>
      {!isStarted && <button onClick={handleStartClick} 
      className='bg-red-600 hover:bg-red-800 w-40 h-10 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mt-5'
      >Start</button>}
      {isStarted && (
        <div>
          <canvas ref={canvasRef}></canvas>
          <div ref={labelContainerRef}></div>
        </div>
      )}
      {isStarted && screenshot && (
        <div>
          <h2>Screenshot</h2>
          <img src={screenshot.src} alt="Screenshot" />
        </div>
      )}
    </div>
  );
};

export default Security;