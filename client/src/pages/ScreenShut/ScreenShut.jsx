import Item from '../item/item'
import data from '../../assets/data'



const ScreenShut = () => {
    return (
        
    <div className='w-1/2 h-full bg-yellow-50 flex flex-col  items-center  ml-4 mr-10  mt-10 mb-10 border-2 rounded-lg' >
        <h1 className="text-[20px] font-bold mt-10">ScreenShut </h1>
        <div className='flex mt-10 flex-wrap justify-center bg-yellow-100 rounded-lg h-3/4 w-5/6 items-center'>
        <div className=" grid grid-cols-2 gap-4  mx-2">
            {data.map((item,i) => {
                return<Item key={i} id= {item.id} image={item.image} />
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