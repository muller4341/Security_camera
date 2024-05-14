import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Item from '../item/item';

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
        <div className='w-1/2 h-full bg-yellow-50 flex flex-col  items-center  ml-4 mr-10  mt-4 mb-10 border-2 rounded-lg' >
        <h1 className="text-[20px] font-bold mt-10">The Latest Suspected Activities </h1>
        <div className='flex mt-10 flex-wrap justify-center bg-yellow-100 rounded-lg h-3/4 w-5/6 items-center'>
            <div className=" grid grid-cols-2 gap-4  mx-2">
                {data.map((item,i) => {
                    return<Item key={i} id= {item.id} image={item.url} />
                })} 
            </div>
            <button className='bg-red-500 text-white font-bold py-2 px-10 
            hover:bg-red-800 rounded-lg mt-2'
            onClick={() => {
                window.location.href = '/more';
            }
            }
            >More</button>
        </div>
    </div>
    );
}

export default ScreenShut;