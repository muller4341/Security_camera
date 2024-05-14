import Security from "./Security/Security";
import ScreenShoot from "./ScreenShut/ScreenShut";
import photo1 from '../assets/photo1.jpg';
//import './Home.css';


const Home = () => {
    return (
        <div className="flex flex-col  w-screen h-screen bg-red-50 justify-start ">
           <div className="flex  flex-row mt-2 justify-center mx-60 items-center space-x-4">
                <img src={photo1} alt="photo1" className="w-[80px] h-[50px]" />
    <h1 className='text-[32px] font-bold text-red-900 moving-text'>
        Intelligent Video Monitoring System for Secure Exam
    </h1>
</div>
                
           <div className="flex flex-row">
            <Security />
            <ScreenShoot />
            </div>
            
        </div>
    );
}

export default Home;