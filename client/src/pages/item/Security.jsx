import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

import axios from 'axios';
import audio1 from '../../assets/audio1.mp3';
import audio2 from '../../assets/audio2.mp3';
import audio3 from '../../assets/audio3.mp3';
import audio4 from '../../assets/audio4.mp3';
import audio5 from '../../assets/audio5.mp3';
import CCTVCamera from '../../assets/CCTVCamera.gif';

// Dynamically import all binary files matching the pattern
const binFiles = import.meta.glob('../model_tfjs/group1-shard*.bin');

const modelJson = '../model_tfjs/model.json'; // Adjust the path

// Convert the object of imports into an array of promises
const binFilePromises = Object.values(binFiles).map(async (file) => {
  // Await each import and return the result
  return await file();
});

const Security = () => {
  const canvasRef = useRef(null);
  const labelContainerRef = useRef(null);
  const outputRef = useRef(null);
  const webcamRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [cameraName, setCameraName] = useState('');

  const audio = new Audio();
  const audioFiles = [audio1, audio2, audio3, audio4, audio5];

  useEffect(() => {
    let model, webcam, ctx, labelContainer, maxPredictions;

    const init = async () => {
      model = await tf.loadLayersModel(
        tf.io.browserFiles([modelJson, ...binFilePromises])
      );
      maxPredictions = model.output.shape[1];

      const size = 400;
      const flip = true;

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      const selectedDevice = videoDevices[0];
      setCameraName(selectedDevice.label);

      webcam = await tf.data.webcam(document.getElementById('webcam'));
      webcamRef.current = webcam;

      const predict = async () => {
        const img = await webcam.capture();
        const input = tf.image.resizeBilinear(img, [size, size]);
        const prediction = model.predict(input);

        for (let i = 0; i < maxPredictions; i++) {
          const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;

          if (prediction[i].probability >= 0.98) {
            outputRef.current.innerHTML = "Suspicious activity = " + prediction[i].className;
            sendToDatabase();
              
            if (!audio.paused) {
              audio.pause();
              audio.currentTime = 0;
            }
            audio.src = audioFiles[i];
            try {
              audio.play();
            } catch (error) {
              console.error("Error playing audio:", error);
            }
          } else {
            outputRef.current.innerHTML = "Normal activity";
            if (!audio.paused) {
              audio.pause();
              audio.currentTime = 0;
            }
          }
        }

        tf.dispose(img);
        tf.dispose(input);
      };

      const loop = async () => {
        if (isStarted) {
          await predict();
          window.requestAnimationFrame(loop);
        }
      };

      await webcam.setup();
      window.requestAnimationFrame(loop);
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

    const screenshotDataUrl = await webcam.capture().data();

    const formData = new FormData();
    const blob = new Blob([screenshotDataUrl], { type: 'image/jpeg' });
    formData.append("screenshot", blob);

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

  return (
    <div className='w-full h-full bg-yellow-50 flex flex-col items-center ml-20 mt-4 mb-10 border-2 rounded-lg'>
      
      <div className="flex items-center">
      {cameraName && <p className='text-[14px]' style={{color: 'green'}}> <p style={{color: 'black'}}> Detected Camera: </p> {cameraName}</p>}
      <img src={CCTVCamera} alt="Movement Icon" className="ml-2 " style={{ width: '100px', height: '60px' }}/>
    </div>
    <p className='text-[18px] font-semibold'>Recognized Movement:</p>
      <p ref={outputRef} id="output"></p>
      {!isStarted && <button onClick={handleStartClick} 
        className='bg-red-600 hover:bg-red-800 w-40 h-10 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mt-5'>
        Start
      </button>}
      {isStarted && (
        <div>
          <video id="webcam" width={400} height={400} autoPlay playsInline muted></video>
          <div ref={labelContainerRef}></div>
        </div>
      )}
      {isStarted && screenshot && (
        <div>
          <h2>Screenshot</h2>
          <img src={screenshot} alt="Screenshot" />
        </div>
      )}
    </div>
  );
};

export default Security;
