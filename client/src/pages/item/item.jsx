
const item = (props) => {
    return (
        <div className="flex w-full 
        h-60 justify-center items-center  
        transition-transform transform hover:scale-110 bg-gray-200 border-2 rounded-lg"  >
            <img src={props.image} alt="item" 
            className="h-full w-full"/>
        </div>
    );
};

export default item;