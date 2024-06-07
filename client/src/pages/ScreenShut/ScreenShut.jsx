import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Item from '../item/item';
import NotificationBadge from '../item/NotificationBadge';
import '../App.css'

const ScreenShut = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            axios.get('http://localhost:3000/camera/allImages')
                .then(response => {
                    const sortedData = response.data.sort((a, b) => b.id - a.id);
                    const latestImages = sortedData.slice(0, 4);
                    setData(latestImages);
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        }

        fetchData(); // Fetch data immediately

        const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, []);

    return (
        <div className='w-1/2 h-full bg-yellow-50 flex flex-col items-center ml-4 mr-10 mt-4 mb-10 border-2 rounded-lg'>
            <h1 className="text-[20px] font-bold mt-1 ">
                The Latest Suspected Activities -------------------------------- <NotificationBadge style={{ marginLeft: '100px' }} />
            </h1>
            <div className='flex mt-2 flex-wrap justify-center bg-yellow-100 rounded-lg h-3/4 w-5/6 items-center bg-red-900'>
                <div className="grid grid-cols-2 gap-4 bg-gray-400 p-4">
                    {data.map((item, i) => (
                        <div key={i} className={`relative p-2 bg-white rounded-lg shadow ${i === 0 ? 'animate-zoom-in-out' : ''}`}>
                        <p className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-1 w-full text-center">{item.cameraName}</p>
                        <img src={item.url} alt={`Screenshot ${item.id}`} className="w-full h-25 mt-6" />
                        <p className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-1 w-full text-center">{new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                      
                    ))}
                </div>
            </div>
            <button className='bg-red-500 text-white font-bold py-2 px-10 
                hover:bg-red-800 rounded-lg mt-12 '
                onClick={() => {
                    window.open('/more', '_blank');
                }}>
                More
            </button>
        </div>
    );
}

export default ScreenShut;
