import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();

  return (
    <div className="lg:col-span-1">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center space-x-4">
          <img
                  src={`https://randomuser.me/api/portraits/${
                    parseInt(user?.uid, 36) % 2 === 0 ? 'men' : 'women'
                  }/${parseInt(user?.uid, 36) % 99}.jpg`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
                />
            <div>
              <h2 className="text-xl font-bold">{user?.fullName || "User"}</h2>
              <p className="text-indigo-100">ID Verified</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Trust Score</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${user?.trustScore || 85}%` }}></div>
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{user?.trustScore || 85}%</p>
          </div>
          
          <div className="mt-6 space-y-2">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${activeTab === "overview" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>Overview</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("created")}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${activeTab === "created" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span>My Created Orders</span>
              <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-semibold ">
                {user?.createdOrders?.length }
              </span>
            </button>
            
            <button 
              onClick={() => setActiveTab("requested")}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${activeTab === "requested" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l-4-4m4 4l4-4" />
              </svg>
              <span>My Requested Trips</span>
              <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-semibold ">
                {user?.requestedOrders?.length}
              </span>
            </button>
            
            <button 
              onClick={() => setActiveTab("accepted")}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${activeTab === "accepted" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>My Accepted Trips</span>
              <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-semibold ">
                {user?.acceptedOrders?.length}
              </span>
            </button>
            
            <button 
              onClick={() => setActiveTab("messages")}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${activeTab === "messages" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Messages</span>
              <span className="ml-auto bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                3
              </span>
            </button>
            
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${activeTab === "settings" ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition">
            Send a New Package
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;