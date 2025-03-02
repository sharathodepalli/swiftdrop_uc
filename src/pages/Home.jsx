
import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <>
      <style>
        {`
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html, body, #root {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          img {
            display: block;
          }
        `}
      </style>

      <div className="relative flex flex-col items-center justify-center w-screen h-screen text-white">
        
        {/* Full-Screen Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://img.freepik.com/free-photo/person-giving-order-customer-curbside-pickup_23-2149106396.jpg?t=st=1740855987~exp=1740859587~hmac=0ae5354a0f62cfa3f080615e042e19677f0048460d494a418a118ce936813f11&w=2000" 
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 text-center px-6 bg-black bg-opacity-50 w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold drop-shadow-lg">
            Welcome to <span className="text-yellow-300">SwiftDrop</span>
          </h1>
          <h2 className="text-3xl font-semibold mt-4 drop-shadow-lg">
            Earn While You Travel, Deliver with Ease!
          </h2>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <Link to="/create-delivery" className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition">
              Create Delivery
            </Link>
            <Link to="/available-deliveries" className="px-6 py-3 bg-transparent border border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition">
              Available Deliveries
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}