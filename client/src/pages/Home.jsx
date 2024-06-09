import Security from "./Security/Security";
import ScreenShoot from "./ScreenShut/ScreenShut";
import photo1 from '../assets/photo1.jpg';
import './App.css';


const Home = () => {
    return (
      <div className="flex flex-col w-screen h-[80vh] bg-red-50 justify-start ">
        <div className="flex flex-row mt-2 justify-center mx-60 items-center space-x-4">
          <img src={photo1} alt="photo1" className="w-[120px] h-[40px]" />
          <div className="moving-text-container">
            <h1 className='text-[32px] font-bold text-red-900'>
              Intelligent Video Monitoring System for Secure Exam
            </h1>
          </div>
        </div>
      
        <div className="flex flex-row">
          <Security />
          <ScreenShoot />
        </div>
      </div>
      
      
      
    );
}

export default Home;