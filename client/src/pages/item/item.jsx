
const item = ({ id, image, cameraName }) => {
    return (
        <div className="flex w-full flex-col bg-red-50 
        h-[100px] justify-center items-center  
        transition-transform transform hover:scale-110 bg-gray-200 border-2 rounded-lg"  >
            <p className="text-red-400 text-[18px] font-semibold">{cameraName}</p>
            <img src={image} alt={`Screenshot ${id}`}  className="h-[50px] w-[280px]"/>
            
        </div>
    );
};

export default item;


