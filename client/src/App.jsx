
import Home from './pages/Home'
import MoreImage from './pages/ScreenShut/moreImage'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
function App() {

  return (
    <>
    <div >
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/more' element={<MoreImage />} />
        </Routes>
      </Router>
  
      </div>
      
    </>
  )
}

export default App
