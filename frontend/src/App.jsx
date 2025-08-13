import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Login from "./pages/Login"
import NewRoom from "./pages/NewRoom"


function App() {
  
  return (
   <div className="text-blue-800">
      <Routes>  
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/new-room/:userId" element={<NewRoom />}></Route>
      </Routes>
   </div>
  )
}

export default App
