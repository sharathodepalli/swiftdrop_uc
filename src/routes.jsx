// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Profile from './pages/Profile'; 
// import ProtectedRoute from "./components/ProtectedRoute";
// import AvailableDeliveries from "./pages/AvailableDeliveries";
// import CreateDelivery from "./pages/CreateDelivery";
// import UserDashboard from "./pages/UserDashboard";

// import OrderTracking from "./pages/Dashboard/OrderTracking";



// function AppRoutes() {
//   return (
    
//     <Router>
//        <LoadScript googleMapsApiKey={mapApiKey}>
//       <OrderTracking isOpen={true} onClose={() => {}} pickup={{ lat: 37.7749, lng: -122.4194 }} dropoff={{ lat: 34.0522, lng: -118.2437 }} />
//     </LoadScript>
//       <Navbar />
//       <div className="p-6">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/available-deliveries" element={<AvailableDeliveries />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* Secure Routes */}
//           <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          
//           <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//           <Route path="/create-delivery" element={<ProtectedRoute><CreateDelivery /></ProtectedRoute>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default AppRoutes;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadScript } from "@react-google-maps/api";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile'; 
import ProtectedRoute from "./components/ProtectedRoute";
import AvailableDeliveries from "./pages/AvailableDeliveries";
import CreateDelivery from "./pages/CreateDelivery";
import UserDashboard from "./pages/UserDashboard";
import OrderTracking from "./pages/Dashboard/OrderTracking";



function AppRoutes() {
  return (

      <Router>
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/available-deliveries" element={<AvailableDeliveries />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Secure Routes */}
            <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/create-delivery" element={<ProtectedRoute><CreateDelivery /></ProtectedRoute>} />
            <Route path="/order-tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>

  );
}

export default AppRoutes;