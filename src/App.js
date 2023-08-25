import Navbar from "./components/Navbar";
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Signup from './pages/Signup.jsx'
import Login from "./pages/Login";
import TrainersList from "./pages/TrainersList";
import TrainerProfile from "./pages/TrainerProfile";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/trainers" element={ <TrainersList/> } />
        <Route path="/trainers/:trainerId" element={<TrainerProfile/>} />
      </Routes>
    </div>
  )
}

export default App;
