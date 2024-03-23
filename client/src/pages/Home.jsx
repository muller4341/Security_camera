import Security from "./Security/Security";
import ScreenShut from "./ScreenShut/ScreenShut";


const Home = () => {
    return (
        <div className="flex flex-row w-screen h-screen bg-red-50">
            
            <Security />
            <ScreenShut />
        </div>
    );
}

export default Home;