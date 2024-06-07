import React, { useRef } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';

const MultiView = ({ cameras, onSelectCamera }) => {
  const videoRefs = useRef([]);
  const fullScreenRefs = useRef([]);

  const toggleFullScreen = (index) => {
    const elem = fullScreenRefs.current[index];
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {cameras.map((camera, index) => (
        <div key={index} ref={(el) => (fullScreenRefs.current[index] = el)} className="relative">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={camera.src}
            autoPlay
            muted
            className="w-full h-auto cursor-pointer"
            onClick={() => onSelectCamera(camera)}
          />
          <button
            onClick={() => toggleFullScreen(index)}
            className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded"
          >
            {document.fullscreenElement ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MultiView;
