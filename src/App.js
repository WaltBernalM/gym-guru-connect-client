import Navbar from "./components/Navbar";
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Signup from './pages/Signup.jsx'
import Login from "./pages/Login";
import TrainersList from "./pages/TrainersList";
import TrainerProfile from "./pages/TrainerProfile";
import TraineeProfile from './pages/TraineeProfile'
import IsAnonymous from "./components/isAnonymous";
import IsPrivate from "./components/isPrivate";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <IsAnonymous>
              <Signup />
            </IsAnonymous>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnonymous>
              <Login />
            </IsAnonymous>
          }
        />

        <Route
          path="/trainers"
          element={
            <IsPrivate>
              <TrainersList />
            </IsPrivate>
          }
        />
        <Route
          path="/trainers/:trainerId"
          element={
            <IsPrivate>
              <TrainerProfile />
            </IsPrivate>
          }
        />

        <Route
          path="/trainee/:traineeId"
          element={
            <IsPrivate>
              <TraineeProfile />
            </IsPrivate>
          }
        />

        <Route
          path="/*"
          element={
            <NotFound/>
          }
        />

      </Routes>
    </div>
  )
}

export default App;
