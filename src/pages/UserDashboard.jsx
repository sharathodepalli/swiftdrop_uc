

//fsdafdsfadfasdfdsf0--------------------
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserDeliveries, getRequestedDeliveries, getAcceptedDeliveries, acceptTravelerForDelivery, cancelTravelerRequest } from '../services/deliveryService';
import { getUserProfile } from '../services/userService';
import { Overview, CreatedOrders, RequestedOrders, AcceptedOrders, Messages, Settings, Sidebar } from './Dashboard';

function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [createdOrders, setCreatedOrders] = useState([]);
  const [requestedOrders, setRequestedOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [travelerProfiles, setTravelerProfiles] = useState({});
  const [showRequests, setShowRequests] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(85);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
     setIsLoading(true);
     if (user) {
       const [created, requested, accepted] = await Promise.all([
         getUserDeliveries(user.uid),
         getRequestedDeliveries(user.uid),
         getAcceptedDeliveries(user.uid)
       ]);
       
       setCreatedOrders(created);
       setRequestedOrders(requested);
       setAcceptedOrders(accepted);
     }
     setIsLoading(false);
   };
    
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchTravelerProfiles = async () => {
      let profiles = {};
      const ordersWithTravelers = createdOrders.filter(order => 
        order.requestedTravelers && order.requestedTravelers.length > 0
      );
      
      if (ordersWithTravelers.length > 0) {
        for (let order of ordersWithTravelers) {
          for (let traveler of order.requestedTravelers) {
            if (!profiles[traveler.travelerId]) {
              const profile = await getUserProfile(traveler.travelerId);
              profiles[traveler.travelerId] = profile || { 
                fullName: "Unknown User", 
                profilePicture: "/default-avatar.png",
                rating: { overallRating: 0, totalReviews: 0 }
              };
            }
          }
        }
        setTravelerProfiles(profiles);
      }
    };

    if (createdOrders.length > 0) {
      fetchTravelerProfiles();
    }
  }, [createdOrders]);

  const handleAcceptTraveler = async (deliveryId, travelerId) => {
    setIsLoading(true);
    const response = await acceptTravelerForDelivery(deliveryId, travelerId);
    if (response.success) {
      setCreatedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === deliveryId ? { ...order, assignedTraveler: travelerId, status: "Accepted" } : order
        )
      );
      // Show success toast instead of alert
    } else {
      // Show error toast instead of alert
    }
    setIsLoading(false);
  };

  const handleCancelTravelerRequest = async (deliveryId, travelerId) => {
    setIsLoading(true);
    const response = await cancelTravelerRequest(deliveryId, travelerId);
    if (response.success) {
      setCreatedOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          requestedTravelers: order.requestedTravelers?.filter((t) => t.travelerId !== travelerId),
        }))
      );
      // Show success toast instead of alert
    } else {
      // Show error toast instead of alert
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && <Overview createdOrders={createdOrders} acceptedOrders={acceptedOrders} />}
                {activeTab === "created" && <CreatedOrders createdOrders={createdOrders} filterStatus={filterStatus} setFilterStatus={setFilterStatus} travelerProfiles={travelerProfiles} showRequests={showRequests} setShowRequests={setShowRequests} handleAcceptTraveler={handleAcceptTraveler} handleCancelTravelerRequest={handleCancelTravelerRequest} />}
                {activeTab === "requested" && <RequestedOrders requestedOrders={requestedOrders} />}
                {activeTab === "accepted" && <AcceptedOrders acceptedOrders={acceptedOrders} />}
                {activeTab === "messages" && <Messages />}
                {activeTab === "settings" && <Settings />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
