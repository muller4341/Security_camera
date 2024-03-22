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
      const URL = "https://teachablemachine.withgoogle.com/models/jLeJTw1rQ/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      model = await tmPose.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      const size = 300;
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
      .post("/api/upload-data", formData)
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

  return (
    <div>
      <h1>AI Suspicious Activity Detector Camera</h1>
      <p>Recognize Movement</p>
      <p ref={outputRef} id="output"></p>
      {!isStarted && <button onClick={handleStartClick}>Start</button>}
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