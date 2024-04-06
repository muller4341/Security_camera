import Security from "./Security/Security";
import ScreenShoot from "./ScreenShut/ScreenShut";


const Home = () => {
    return (
        <div className="flex flex-row w-screen h-screen bg-red-50">
            
            <Security />
            <ScreenShoot />
            
        </div>
    );
}

export default Home;