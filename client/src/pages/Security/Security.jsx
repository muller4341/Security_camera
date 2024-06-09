import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmPose from '@teachablemachine/pose';
import axios from 'axios';
import audio1 from '../../assets/audio1.mp3';
import CCTVCamera from '../../assets/CCTVCamera.gif';
import { FaCamera, FaExpand, FaCompress, FaCircle } from "react-icons/fa";
import { FiMinimize } from "react-icons/fi";

const Security = () => {
  const canvasRef = useRef(null);
  const labelContainerRef = useRef(null);
  const outputRef = useRef(null);
  const webcamRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [canvasSize, setCanvasSize] = useState(50); // Initial canvas size as percentage
  const [screenshot, setScreenshot] = useState(null);
  const [cameraName, setCameraName] = useState('');

  const audio = new Audio();

  const audioFiles = [audio1];

  const handleCameraNameChange = (event) => {
    setCameraName(event.target.value);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInputDevice = devices.find(device => device.kind === 'videoinput');
      if (videoInputDevice) {
        setCameraName(videoInputDevice.label);
      }
    });
  }, []);

  useEffect(() => {
    let model, webcam, ctx, labelContainer, maxPredictions;

    const init = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/UrIMXKhyV/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      model = await tmPose.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      const size = 550;
      const flip = true;
      webcam = new tmPose.Webcam(size, size, flip);
      webcamRef.current = webcam;

      const predict = async () => {
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
          const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;

          if (
            prediction[1].probability.toFixed(2) >= 0.98 ||
            prediction[2].probability.toFixed(2) >= 0.98 ||
            prediction[3].probability.toFixed(2) >= 0.98
          ) {
            outputRef.current.innerHTML = "Suspicious activity =  " + prediction[i].className;
            sendToDatabase();

            if (!audio.paused) {
              audio.pause();
              audio.currentTime = 0;
            }
            audio.src = audio1;
            try {
              audio.play()
            }
            catch (error) {
              console.error("Error playing audio:", error)
            };
          } else {
            outputRef.current.innerHTML = "Normal activity";
            if (!audio.paused) {
              audio.pause();
              audio.currentTime = 0;
            }
          }
        }

        drawPose(pose);
      };

      const loop = async () => {
        if (isStarted) {
          webcam.update();
          await predict();
          window.requestAnimationFrame(loop);
        }
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

  let lastScreenshotTime = 0;

  const sendToDatabase = async () => {
    const now = Date.now();
    if (now - lastScreenshotTime < 20000) {
      return;
    }
    lastScreenshotTime = now;

    const canvasElement = canvasRef.current;
    const screenshotDataUrl = canvasElement.toDataURL();

    const formData = new FormData();
    const blob = await (await fetch(screenshotDataUrl)).blob();
    formData.append("screenshot", blob);
    formData.append("cameraName", cameraName);

    axios
      .post("http://localhost:3000/camera/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Screenshot uploaded successfully.");
        setScreenshot(response.data.url);
      })
      .catch((error) => {
        console.error("Error uploading screenshot:", error);
      });
  };

  const handleStartClick = () => {
    setIsStarted(true);
  };

  const handleMaximize = () => {
    if (canvasSize < 100) {
      setCanvasSize(canvasSize + 10);
    }
  };

  const handleMinimize = () => {
    if (canvasSize > 10) {
      setCanvasSize(canvasSize - 10);
    }
  };

  return (
    <div className="w-1/2 h-full bg-yellow-50 flex flex-col items-center ml-20 mt-4 mb-10 border-2 rounded-lg relative">
      {isStarted && (
        <div className="absolute top-2 right-2 text-red-500 flex items-center">
          <FaCircle />
          <span className="ml-1">Live</span>
        </div>
      )}
      {isStarted && (
        <div className="absolute top-2 left-2 flex flex-col space-y-2">
          <button 
            onClick={handleMaximize} 
            className='bg-gray-600 hover:bg-blue-800 flex items-center justify-center w-40 h-10 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mt-5'
          >
           <FaExpand style={{marginRight: '5px'}}/>Maximize 
          </button>

          <button
          onClick={handleMinimize}
          className='bg-gray-600 hover:bg-blue-800 flex items-center justify-center w-40 h-10 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mt-5'
        >
          <FiMinimize  style={{marginRight: '5px'}} /> Minimize
        </button>
         
        </div>
      )}
      {isStarted && (
        <div className="flex items-center">
          {cameraName && (
            <p className='text-[22px]' style={{color: 'green'}}>
              <p style={{color: 'black'}}>Detected Camera:</p> {cameraName}
            </p>
          )}
          <img src={CCTVCamera} alt="Movement Icon" className="ml-2" style={{ width: '100px', height: '60px' }}/>
        </div>
      )}
      {isStarted && <p className='text-[18px] font-semibold'>Recognized Movement:</p>}
      <p ref={outputRef} id="output"></p>
      {!isStarted && (
        <button
          onClick={handleStartClick}
          className='bg-red-600 hover:bg-red-800 flex items-center justify-center w-40 h-10 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mt-5'
        >
          <FaCamera className="mr-2" style={{marginRight: '20px'}} /> Start
        </button>
      )}
      {isStarted && (
        <div className="relative" style={{ width: `${canvasSize}%`, height: `${canvasSize}%` }}>
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
          <div ref={labelContainerRef}></div>
        </div>
      )}
    </div>
  );
};

export default Security;
