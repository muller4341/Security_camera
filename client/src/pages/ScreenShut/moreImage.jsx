import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Item from '../item/item';

const MoreImage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/camera/allImages')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    return (
        <div className='w-full h-full bg-yellow-50 flex flex-col items-center ml-4 mr-10 mt-10 mb-10 border-2 rounded-lg'>
            <h1 className="text-[32px] font-bold mt-10 text-red-900">Suspected Activities</h1>
            <div className='flex justify-end w-5/6'>
                <button className='bg-red-500 text-white font-bold py-2 px-10 target="_blank"
                    hover:bg-red-800 rounded-lg mt-2 flex justify-center'
                    onClick={() => {
                        window.location.href = '/';
                    }}
                >Back to Home</button>
            </div>
            
            <div className='flex flex-col-reverse mt-10 flex-wrap justify-center bg-yellow-100 rounded-lg h-3/4 w-5/6 items-center'>
                <div className="grid grid-cols-4 gap-4 mx-2">
                    {data.slice().reverse().map((item, i) => (
                        <Item 
                            key={i} 
                            id={item.id} 
                            image={item.url} 
                            cameraName={item.cameraName} 
                            createdAt={item.createdAt}  // Pass createdAt to the Item component
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MoreImage;
