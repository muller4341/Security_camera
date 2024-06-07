// Item.jsx

import React from 'react';
import '../App.css'; // Import CSS file

const Item = ({ id, image, cameraName, createdAt }) => {
    return (
        <div className="relative p-2 bg-white rounded-lg shadow item"> {/* Apply 'item' class */}
            <p className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-1 w-full text-center">{cameraName}</p>
            <img src={image} alt={`Screenshot ${id}`} className="w-full h-25 mt-6" />
            <p className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-1 w-full text-center">{new Date(createdAt).toLocaleString()}</p>
        </div>
    );
};

export default Item;
