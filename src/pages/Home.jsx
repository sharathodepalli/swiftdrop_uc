
// import React from 'react';
// import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import gifImage from "../assets/homepage.gif";

// export default function Home() {
//   const { user, logout } = useAuth();

//   return (
//     <>
//       <style>
//         {`
//           *, *::before, *::after {
//             box-sizing: border-box;
//             margin: 0;
//             padding: 0;
//           }
//           html, body, #root {
//             width: 100%;
//             height: 100%;
//             overflow: hidden;
//           }
//           img {
//             display: block;
//           }
//         `}
//       </style>

//       <div className="relative flex flex-col items-center justify-center w-screen h-screen text-white">
        
//         {/* Full-Screen Background Image */}
//         <div className="absolute inset-0 w-full h-full">


//         <img src={gifImage} alt="Background" className="absolute top-0 left-0 w-full h-full object-cover" />

         
//           {/* <img 
//             src="https://img.freepik.com/free-photo/person-giving-order-customer-curbside-pickup_23-2149106396.jpg?t=st=1740855987~exp=1740859587~hmac=0ae5354a0f62cfa3f080615e042e19677f0048460d494a418a118ce936813f11&w=2000" 
//             alt="Background"
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           /> */}
//         </div>

//         {/* Content Wrapper */}
//         <div className="relative z-10 text-center px-6 bg-black bg-opacity-0 w-full h-full flex flex-col items-center justify-center">
//           <h1 className="text-6xl font-bold drop-shadow-lg">
//             Welcome to <span className="text-yellow-300">SwiftDrop</span>
//           </h1>
//           <h2 className="text-3xl font-semibold mt-4 drop-shadow-lg">
//             Earn While You Travel, Deliver with Ease!
//           </h2>

//           {/* Action Buttons */}
//           <div className="mt-8 flex space-x-4">
//             <Link to="/create-delivery" className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition">
//               Create Delivery
//             </Link>
//             <Link to="/available-deliveries" className="px-6 py-3 bg-transparent border border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition">
//               Available Deliveries
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import videoSrc from "../assets/homepage.mp4"; // Adjust path if needed

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Global Reset Styles */}
      <style>
        {`
          *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body, #root {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          video {
            display: block;
            width: 100%;
            height: 100%;
          }
        `}
      </style>

      {/* Improved Navbar - Semi-Transparent */}
      <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-70 text-white py-4 px-6 z-20 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Clickable Logo Redirecting to Homepage */}
          <Link to="/" className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition">
            SwiftDrop 🚀
          </Link>

          {/* Navbar Links */}
          <div className="space-x-6">
            <Link to="/available-deliveries" className="hover:text-yellow-300 transition">Available Deliveries</Link>
            <Link to="/login" className="hover:text-yellow-300 transition">Login</Link>
            <Link to="/signup" className="hover:text-yellow-300 transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Background Video with Blur Effect */}
      <div className="fixed inset-0 w-full h-full">
        <video 
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {/* Blur effect */}
        <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-lg"></div>
      </div>

      {/* Centered Content with Styling Enhancements */}
      <div className="relative z-10 text-center px-6 w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-6xl font-extrabold drop-shadow-lg text-white">
          Welcome to <span className="text-yellow-300">SwiftDrop</span>
        </h1>
        <h2 className="text-3xl font-semibold mt-4 text-white drop-shadow-lg tracking-wide">
          Earn While You Travel, Deliver with Ease!
        </h2>

        {/* Modern Action Buttons */}
        <div className="mt-8 flex space-x-6">
          <Link to="/create-delivery" className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition-transform transform hover:scale-105">
            Create Delivery
          </Link>
          <Link to="/available-deliveries" className="px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-transform transform hover:scale-105">
            Available Deliveries
          </Link>
        </div>
      </div>
    </>
  );
}
