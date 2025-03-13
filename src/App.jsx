import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Itinerary from "./pages/Itinerary";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
