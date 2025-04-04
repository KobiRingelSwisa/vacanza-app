import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlanTrip from "./pages/PlanTrip";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FlightSearch from "./pages/FlightSearch";
import HotelSearch from "./pages/HotelSearch";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/trip/:id"
            element={
              <PrivateRoute>
                <TripDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-trip/:id"
            element={
              <PrivateRoute>
                <EditTrip />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/flights" element={<FlightSearch />} />
          <Route path="/hotels" element={<HotelSearch />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
