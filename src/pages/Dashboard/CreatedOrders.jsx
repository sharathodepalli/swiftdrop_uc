
// import React, { useEffect, useState, useMemo } from "react";
// import { db } from "../../services/firebase";
// import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
// import { useAuth } from "../../contexts/AuthContext";
// import ChatWindow from "./ChatWindow";

// function CreatedOrders({ createdOrders, setFilterStatus, filterStatus, showRequests, setShowRequests }) {
//   const { user } = useAuth();
//   const [chatUser, setChatUser] = useState(null);
//   const [chatDeliveryTitle, setChatDeliveryTitle] = useState("");
//   const [messageCounts, setMessageCounts] = useState({});

//   // Fetch unread messages for each order
//   const fetchMessageCounts = async () => {
//     if (!user?.uid || createdOrders.length === 0) return;

//     const counts = {};
//     for (const order of createdOrders) {
//       if (order.assignedTraveler) {
//         const chatId = [user.uid, order.assignedTraveler].sort().join("_");
//         const messagesRef = collection(db, "chats", chatId, "messages");

//         try {
//           const q = query(messagesRef, where("read", "==", false), where("senderId", "!=", user.uid));
//           const unreadMessages = await getDocs(q);
//           counts[order.id] = unreadMessages.size;
//         } catch (error) {
//           console.error("❌ Error fetching message count:", error);
//         }
//       }
//     }
//     setMessageCounts(counts);
//   };

//   // Fetch unread messages on orders change
//   useEffect(() => {
//     fetchMessageCounts();
//   }, [createdOrders]);

//   // Listen for live updates on unread messages
//   useEffect(() => {
//     if (!user?.uid || createdOrders.length === 0) return;

//     const unsubscribes = createdOrders.map((order) => {
//       if (order.assignedTraveler) {
//         const chatId = [user.uid, order.assignedTraveler].sort().join("_");
//         const messagesRef = collection(db, "chats", chatId, "messages");
//         const q = query(messagesRef, where("read", "==", false), where("senderId", "!=", user.uid));

//         return onSnapshot(q, (snapshot) => {
//           setMessageCounts((prev) => ({
//             ...prev,
//             [order.id]: snapshot.size,
//           }));
//         });
//       }
//       return null;
//     });

//     return () => unsubscribes.forEach((unsub) => unsub && unsub());
//   }, [createdOrders]);

//   // Filter orders based on status
//   const filteredOrders = useMemo(() => {
//     if (filterStatus === "all") return createdOrders;
//     return createdOrders.filter(order => order.status === filterStatus);
//   }, [createdOrders, filterStatus]);

//   // Status colors
//   const getStatusColor = (status) => ({
//     Pending: "bg-yellow-100 text-yellow-800",
//     Accepted: "bg-blue-100 text-blue-800",
//     "In Progress": "bg-purple-100 text-purple-800",
//     "Picked Up": "bg-indigo-100 text-indigo-800",
//     Completed: "bg-green-100 text-green-800",
//     Cancelled: "bg-red-100 text-red-800",
//   })[status] || "bg-gray-100 text-gray-800";

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">My Created Orders</h1>
//         <select 
//           value={filterStatus} 
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           <option value="all">All Status</option>
//           <option value="Pending">Pending</option>
//           <option value="Accepted">Accepted</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Orders List */}
//       {filteredOrders.length === 0 ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-500">No orders found</p>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow">
//           <p className="text-sm text-gray-500 mb-4">Showing {filteredOrders.length} orders</p>

//           <div className="space-y-4">
//             {filteredOrders.map((order) => (
//               <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
//                 {/* Order Details */}
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
//                     <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
//                     <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
//                   </div>
//                   <div className="text-right">
//                     <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-4 flex justify-between items-center">
//                   {/* Traveler Requests */}
//                   {order.requestedTravelers?.length > 0 && (
//                     <button
//                       onClick={() => setShowRequests(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
//                       className="text-indigo-600 hover:text-indigo-800 font-medium"
//                     >
//                       {showRequests[order.id] ? "Hide Requests" : "Show Requests"}
//                     </button>
//                   )}

//                   {/* Messages Button with Unread Count */}
//                   {order.assignedTraveler && (
//                     <button
//                       onClick={() => {
//                         if (user.uid === order.assignedTraveler) {
//                           console.error("❌ Invalid chat setup: senderId and travelerId must be different.");
//                           return;
//                         }
//                         setChatUser(order.assignedTraveler);
//                         setChatDeliveryTitle(order.itemDetails?.title || "Package");
//                       }}
//                       className="relative bg-green-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-green-600 transition"
//                     >
//                       💬 Messages {messageCounts[order.id] > 0 && (
//                         <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
//                           {messageCounts[order.id]}
//                         </span>
//                       )}
//                     </button>
//                   )}

//                   {/* Track Button */}
//                   <button
//                     onClick={() => alert(`Tracking Order: ${order.id}`)}
//                     className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-600 transition"
//                   >
//                     🚚 Track
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Chat Window */}
//       {chatUser && (
//         <ChatWindow
//           senderId={user.uid}
//           travelerId={chatUser}
//           deliveryTitle={chatDeliveryTitle}
//           closeChat={() => setChatUser(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default CreatedOrders;
// import React, { useState, useEffect } from "react";
// import { db } from "../../services/firebase";
// import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
// import { useAuth } from "../../contexts/AuthContext";
// import ChatWindow from "./ChatWindow";
// import OrderTracking from "./OrderTracking"; // Import the tracking component

// function CreatedOrders({ createdOrders, setFilterStatus, filterStatus, showRequests, setShowRequests }) {
//   const { user } = useAuth();
//   const [chatUser, setChatUser] = useState(null);
//   const [chatDeliveryTitle, setChatDeliveryTitle] = useState("");
//   const [messageCounts, setMessageCounts] = useState({});
//   const [trackingOrder, setTrackingOrder] = useState(null);
//   const [isTrackingDialogOpen, setTrackingDialogOpen] = useState(false); // State to control the dialog box

//   // Status colors
//   const getStatusColor = (status) => ({
//     Pending: "bg-yellow-100 text-yellow-800",
//     Accepted: "bg-blue-100 text-blue-800",
//     "In Progress": "bg-purple-100 text-purple-800",
//     "Picked Up": "bg-indigo-100 text-indigo-800",
//     Completed: "bg-green-100 text-green-800",
//     Cancelled: "bg-red-100 text-red-800",
//   })[status] || "bg-gray-100 text-gray-800";

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">My Created Orders</h1>
//         <select 
//           value={filterStatus} 
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           <option value="all">All Status</option>
//           <option value="Pending">Pending</option>
//           <option value="Accepted">Accepted</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Orders List */}
//       {createdOrders.length === 0 ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-500">No orders found</p>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow">
//           <p className="text-sm text-gray-500 mb-4">Showing {createdOrders.length} orders</p>

//           <div className="space-y-4">
//             {createdOrders.map((order) => (
//               <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
//                 {/* Order Details */}
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
//                     <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
//                     <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
//                   </div>
//                   <div className="text-right">
//                     <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-4 flex justify-between items-center">
//                   {/* Traveler Requests */}
//                   {order.requestedTravelers?.length > 0 && (
//                     <button
//                       onClick={() => setShowRequests(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
//                       className="text-indigo-600 hover:text-indigo-800 font-medium"
//                     >
//                       {showRequests[order.id] ? "Hide Requests" : "Show Requests"}
//                     </button>
//                   )}

//                   {/* Messages Button */}
//                   {order.assignedTraveler && (
//                     <button
//                       onClick={() => {
//                         setChatUser(order.assignedTraveler);
//                         setChatDeliveryTitle(order.itemDetails?.title || "Package");
//                       }}
//                       className="relative bg-green-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-green-600 transition"
//                     >
//                       💬 Messages {messageCounts[order.id] > 0 && (
//                         <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
//                           {messageCounts[order.id]}
//                         </span>
//                       )}
//                     </button>
//                   )}

//                   {/* Track Button */}
//                   <button
//                     onClick={() => {
//                       setTrackingOrder(order);
//                       setTrackingDialogOpen(true);
//                     }}
//                     className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-600 transition"
//                   >
//                     🚚 Track
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Chat Window */}
//       {chatUser && (
//         <ChatWindow
//           senderId={user.uid}
//           travelerId={chatUser}
//           deliveryTitle={chatDeliveryTitle}
//           closeChat={() => setChatUser(null)}
//         />
//       )}

//       {/* Order Tracking Modal */}
//       {isTrackingDialogOpen && (
//         <OrderTracking
//           isOpen={isTrackingDialogOpen}
//           onClose={() => setTrackingDialogOpen(false)}
//           pickup={trackingOrder?.pickup?.location}
//           dropoff={trackingOrder?.dropoff?.location}
//         />
//       )}
//     </div>
//   );
// }

// export default CreatedOrders;

//--------------=------------------------------------------
// import React, { useState, useEffect } from "react";
// import { db } from "../../services/firebase";
// import { 
//   collection, query, where, getDocs, 
//   onSnapshot, updateDoc, addDoc, doc, 
//   serverTimestamp, arrayRemove, Timestamp 
// } from "firebase/firestore";
// import { useAuth } from "../../contexts/AuthContext";
// import ChatWindow from "./ChatWindow";
// import OrderTracking from "./OrderTracking";
// import TravelerApproval from "./Track/TravelerApproval";
// import { getUserApprovedChats } from "../../services/ApprovedTripSevice";

// function CreatedOrders({ createdOrders, setFilterStatus, filterStatus, showRequests, setShowRequests }) {
//   const { user } = useAuth();
//   const [chatUser, setChatUser] = useState(null);
//   const [chatDeliveryTitle, setChatDeliveryTitle] = useState("");
//   const [messageCounts, setMessageCounts] = useState({});
//   const [trackingOrder, setTrackingOrder] = useState(null);
//   const [isTrackingDialogOpen, setTrackingDialogOpen] = useState(false);
//   const [selectedTraveler, setSelectedTraveler] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showApprovalDialog, setShowApprovalDialog] = useState(false);
//   const [approvedChats, setApprovedChats] = useState([]);
//   const [travelerInfo, setTravelerInfo] = useState({});
//   const [loading, setLoading] = useState({});



// // Add this function at the top of your file
// const geocodeAddress = async (address) => {
//   const key = "pk.eyJ1Ijoic2hhcmF0aDIiLCJhIjoiY203cmhjZTU2MThlajJsb3AwMTZpbzIwbyJ9.9Tq5vhVBdTTuayhzo4Zgcw";
//   const response = await fetch(
//     `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${key}`
//   );
//   const data = await response.json();
//   if (data.features.length > 0) {
//     return {
//       lat: data.features[0].center[1],
//       lng: data.features[0].center[0]
//     };
//   }
//   throw new Error("Geocoding failed for address: " + address);
// };

//   // Status colors mapping


//   const getStatusColor = (status) => ({
//     Pending: "bg-yellow-100 text-yellow-800",
//     Accepted: "bg-blue-100 text-blue-800",
//     "In Progress": "bg-purple-100 text-purple-800",
//     "Picked Up": "bg-indigo-100 text-indigo-800",
//     Completed: "bg-green-100 text-green-800",
//     Cancelled: "bg-red-100 text-red-800",
//   })[status] || "bg-gray-100 text-gray-800";

//   // Initialize showRequests state for each order
//   useEffect(() => {
//     if (createdOrders.length > 0 && !showRequests) {
//       const initialShowRequests = {};
//       createdOrders.forEach(order => {
//         initialShowRequests[order.id] = false;
//       });
//       setShowRequests(initialShowRequests);
//     }
//   }, [createdOrders, showRequests, setShowRequests]);

//   // Fetch approved chats for the user
//   useEffect(() => {
//     if (user?.uid) {
//       const unsubscribe = getUserApprovedChats(user.uid, (chats) => {
//         setApprovedChats(chats);
//       });
      
//       return () => {
//         if (unsubscribe) unsubscribe();
//       };
//     }
//   }, [user]);

//   // Helper function to extract traveler ID
//   const getTravelerId = (traveler) => {
//     if (typeof traveler === 'string') return traveler;
//     return traveler?.travelerId || traveler?.uid || null;
//   };

//   // Fetch traveler information
//   useEffect(() => {
//     const fetchTravelerInfo = async (traveler) => {
//       const travelerId = getTravelerId(traveler);
//       if (!travelerId || travelerInfo[travelerId]) return;
      
//       try {
//         const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", travelerId)));
//         if (!userDoc.empty) {
//           const userData = userDoc.docs[0].data();
//           setTravelerInfo(prev => ({
//             ...prev,
//             [travelerId]: {
//               name: userData.displayName || "Unknown User",
//               photoURL: userData.photoURL || null,
//               email: userData.email || null,
//               rating: userData.rating || 0,
//               trips: userData.completedTrips || 0
//             }
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching traveler info:", error);
//       }
//     };

//     // Process all visible requested travelers
//     Object.entries(showRequests || {}).forEach(([orderId, isShown]) => {
//       if (isShown) {
//         const order = createdOrders.find(o => o.id === orderId);
//         if (order?.requestedTravelers?.length) {
//           order.requestedTravelers.forEach(traveler => {
//             fetchTravelerInfo(traveler);
//           });
//         }
//       }
//     });
//   }, [showRequests, createdOrders, travelerInfo]);

//   // Toggle show requests for an order
//   const toggleShowRequests = (orderId) => {
//     setShowRequests(prev => ({
//       ...prev,
//       [orderId]: !prev[orderId]
//     }));
//   };

//   // Handle approving a traveler
//   const handleApproveTraveler = (order, traveler) => {
//     setSelectedOrder(order);
//     setSelectedTraveler(traveler);
//     setShowApprovalDialog(true);
//   };

//   // Handle successful traveler approval
//   const handleApprovalSuccess = async () => {
//     try {
//       if (!selectedOrder || !selectedTraveler) return;
  
//       setLoading(prev => ({ ...prev, [selectedOrder.id]: true }));
//       const travelerId = getTravelerId(selectedTraveler);
  
//       // Update delivery document
//       const deliveryRef = doc(db, "delivery", selectedOrder.id);
//       await updateDoc(deliveryRef, {
//         assignedTraveller: travelerId,
//         status: "Accepted",
//         updatedAt: serverTimestamp()
//       });
  
//       // Get addresses from selectedOrder
//       const pickupAddress = selectedOrder.pickup.location.address;
//       const dropoffAddress = selectedOrder.dropoff.location.address;
  
//       // Geocode addresses
//       const [pickupLoc, dropoffLoc] = await Promise.all([
//         geocodeAddress(pickupAddress),
//         geocodeAddress(dropoffAddress)
//       ]);
  
//       // Update approved_trips collection
//       const approvedTripsRef = collection(db, "approved_trips");
//       await addDoc(approvedTripsRef, {
//         orderId: selectedOrder.id,
//         travelerId: travelerId,
//         status: "Accepted",
//         createdAt: serverTimestamp(),
//         pickupLat: pickupLoc.lat,
//         pickupLng: pickupLoc.lng,
//         dropoffLat: dropoffLoc.lat,
//         dropoffLng: dropoffLoc.lng
//       });
  
//       // Update existing trip document in trips collection
//       const tripRef = doc(db, "trips", selectedOrder.id);
//       await updateDoc(tripRef, {
//         travelerId: travelerId,
//         status: "Accepted",
//         updatedAt: serverTimestamp()
//       });
  
//       alert("Traveler approved successfully!");
//       setShowApprovalDialog(false);
//       setSelectedOrder(null);
//       setSelectedTraveler(null);
//     } catch (error) {
//       console.error("Error approving traveler:", error);
//       alert(`Approval failed: ${error.message}`);
//     } finally {
//       setLoading(prev => ({ ...prev, [selectedOrder?.id]: false }));
//     }
//   };

//   // Handle rejecting a traveler request
//   const handleRejectTraveler = async (order, traveler) => {
//     try {
//       if (!order || !traveler) return;
//       const travelerId = getTravelerId(traveler);
      
//       setLoading(prev => ({ ...prev, [order.id + travelerId]: true }));
      
//       // Update order document to remove traveler from requests
//       const orderRef = doc(db, "orders", order.id);
//       const updatedTravelers = order.requestedTravelers.filter(t => 
//         getTravelerId(t) !== travelerId
//       );

//       await updateDoc(orderRef, {
//         requestedTravelers: updatedTravelers,
//         updatedAt: serverTimestamp()
//       });

//       alert("Request rejected successfully");
//     } catch (error) {
//       console.error("Error rejecting traveler request:", error);
//       alert("Failed to reject request. Please try again.");
//     } finally {
//       setLoading(prev => ({ ...prev, [order.id + travelerId]: false }));
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">My Created Orders</h1>
//         <select 
//           value={filterStatus} 
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           <option value="all">All Status</option>
//           <option value="Pending">Pending</option>
//           <option value="Accepted">Accepted</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Orders List */}
//       {createdOrders.length === 0 ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-500">No orders found</p>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow">
//           <p className="text-sm text-gray-500 mb-4">Showing {createdOrders.length} orders</p>

//           <div className="space-y-4">
//             {createdOrders.map((order) => (
//               <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
//                 {/* Order Details */}
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
//                     <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
//                     <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
//                   </div>
//                   <div className="text-right">
//                     <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-4 flex justify-between items-center">
//                   {/* Traveler Requests */}
//                   {order.requestedTravelers?.length > 0 && (
//                     <button
//                       onClick={() => toggleShowRequests(order.id)}
//                       className="text-indigo-600 hover:text-indigo-800 font-medium"
//                     >
//                       {showRequests?.[order.id] ? "Hide Requests" : `Show Requests (${order.requestedTravelers.length})`}
//                     </button>
//                   )}

//                   {/* Messages Button */}
//                   {order.assignedTraveler && (
//                     <button
//                       onClick={() => {
//                         setChatUser(getTravelerId(order.assignedTraveler));
//                         setChatDeliveryTitle(order.itemDetails?.title || "Package");
//                       }}
//                       className="relative bg-green-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-green-600 transition"
//                     >
//                       💬 Messages {messageCounts[order.id] > 0 && (
//                         <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
//                           {messageCounts[order.id]}
//                         </span>
//                       )}
//                     </button>
//                   )}

//                   {/* Track Button */}
//                   <button
//                     onClick={() => {
//                       setTrackingOrder(order);
//                       setTrackingDialogOpen(true);
//                     }}
//                     className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-600 transition"
//                   >
//                     🚚 Track
//                   </button>
//                 </div>

//                 {/* Traveler Requests List */}
//                 {showRequests?.[order.id] && order.requestedTravelers?.length > 0 && (
//                   <div className="mt-4 border-t pt-4">
//                     <h3 className="text-md font-medium mb-2">Delivery Requests</h3>
//                     <div className="space-y-3">
//                       {order.requestedTravelers.map((traveler, index) => {
//                         const travelerId = getTravelerId(traveler);
//                         return (
//                           <div key={`${travelerId}-${index}`} className="flex justify-between items-center bg-white p-3 rounded-md">
//                             <div className="flex items-center">
//                               {travelerInfo[travelerId]?.photoURL ? (
//                                 <img 
//                                   src={travelerInfo[travelerId].photoURL} 
//                                   alt={travelerInfo[travelerId].name}
//                                   className="w-10 h-10 rounded-full mr-3"
//                                 />
//                               ) : (
//                                 <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
//                                   <span className="text-gray-600">{travelerInfo[travelerId]?.name?.charAt(0) || "U"}</span>
//                                 </div>
//                               )}
//                               <div>
//                                 <p className="font-medium">{travelerInfo[travelerId]?.name || travelerId}</p>
//                                 {travelerInfo[travelerId] && (
//                                   <p className="text-xs text-gray-500">
//                                     Rating: ⭐ {travelerInfo[travelerId].rating}/5 • {travelerInfo[travelerId].trips} trips
//                                   </p>
//                                 )}
//                                 {traveler.requestedAt && (
//                                   <p className="text-xs text-gray-500">
//                                     Requested: {new Date(traveler.requestedAt.seconds * 1000).toLocaleString()}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleApproveTraveler(order, traveler)}
//                                 disabled={loading[order.id] || order.status !== "Pending"}
//                                 className={`${
//                                   order.status !== "Pending" 
//                                     ? "bg-gray-300 cursor-not-allowed" 
//                                     : "bg-green-500 hover:bg-green-600"
//                                 } text-white px-3 py-1 text-sm rounded transition`}
//                               >
//                                 {loading[order.id] ? "..." : "Approve"}
//                               </button>
//                               <button
//                                 onClick={() => handleRejectTraveler(order, traveler)}
//                                 disabled={loading[order.id + travelerId]}
//                                 className="bg-red-100 text-red-800 px-3 py-1 text-sm rounded hover:bg-red-200 transition"
//                               >
//                                 {loading[order.id + travelerId] ? "..." : "Reject"}
//                               </button>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Chat Window */}
//       {chatUser && (
//         <ChatWindow
//           senderId={user.uid}
//           travelerId={chatUser}
//           deliveryTitle={chatDeliveryTitle}
//           closeChat={() => setChatUser(null)}
//         />
//       )}

//       {/* Order Tracking Modal */}
//       {isTrackingDialogOpen && trackingOrder && (
//         <OrderTracking
//           isOpen={isTrackingDialogOpen}
//           onClose={() => setTrackingDialogOpen(false)}
//           pickup={trackingOrder.pickup?.location}
//           dropoff={trackingOrder.dropoff?.location}
//         />
//       )}

//       {/* Traveler Approval Dialog */}
//       {showApprovalDialog && selectedOrder && selectedTraveler && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
//             <h2 className="text-xl font-bold mb-4">Approve Traveler</h2>
//             <p className="mb-4">
//               Are you sure you want to approve <strong>{travelerInfo[getTravelerId(selectedTraveler)]?.name || getTravelerId(selectedTraveler)}</strong> to deliver your package?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowApprovalDialog(false)}
//                 className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApprovalSuccess}
//                 className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
//                 disabled={loading[selectedOrder.id]}
//               >
//                 {loading[selectedOrder.id] ? "Approving..." : "Approve Traveler"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreatedOrders;

import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { 
  collection, query, where, getDocs, 
  onSnapshot, updateDoc, doc, 
  serverTimestamp, arrayRemove, Timestamp 
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import ChatWindow from "./ChatWindow";
import OrderTracking from "./OrderTracking";
import TravelerApproval from "./Track/TravelerApproval";
import { getUserApprovedChats } from "../../services/ApprovedTripSevice";

function CreatedOrders({ createdOrders, setFilterStatus, filterStatus, showRequests, setShowRequests }) {
  const { user } = useAuth();
  const [chatUser, setChatUser] = useState(null);
  const [chatDeliveryTitle, setChatDeliveryTitle] = useState("");
  const [messageCounts, setMessageCounts] = useState({});
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isTrackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvedChats, setApprovedChats] = useState([]);
  const [travelerInfo, setTravelerInfo] = useState({});
  const [loading, setLoading] = useState({});

  // Status colors mapping
  const getStatusColor = (status) => ({
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-blue-100 text-blue-800",
    "In Progress": "bg-purple-100 text-purple-800",
    "Picked Up": "bg-indigo-100 text-indigo-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  })[status] || "bg-gray-100 text-gray-800";

  // Initialize showRequests state for each order
  useEffect(() => {
    if (createdOrders.length > 0 && !showRequests) {
      const initialShowRequests = {};
      createdOrders.forEach(order => {
        initialShowRequests[order.id] = false;
      });
      setShowRequests(initialShowRequests);
    }
  }, [createdOrders, showRequests, setShowRequests]);

  // Fetch approved chats for the user
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = getUserApprovedChats(user.uid, (chats) => {
        setApprovedChats(chats);
      });
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user]);

  // Helper function to extract traveler ID
  const getTravelerId = (traveler) => {
    if (typeof traveler === 'string') return traveler;
    return traveler?.travelerId || traveler?.uid || null;
  };

  // Fetch traveler information
  useEffect(() => {
    const fetchTravelerInfo = async (traveler) => {
      const travelerId = getTravelerId(traveler);
      if (!travelerId || travelerInfo[travelerId]) return;
      
      try {
        const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", travelerId)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setTravelerInfo(prev => ({
            ...prev,
            [travelerId]: {
              name: userData.fullName || "Unknown User",
              photoURL: userData.photoURL || null,
              email: userData.email || null,
              rating: userData.rating || 0,
              trips: userData.completedTrips || 0
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching traveler info:", error);
      }
    };

    // Process all visible requested travelers
    Object.entries(showRequests || {}).forEach(([orderId, isShown]) => {
      if (isShown) {
        const order = createdOrders.find(o => o.id === orderId);
        if (order?.requestedTravelers?.length) {
          order.requestedTravelers.forEach(traveler => {
            fetchTravelerInfo(traveler);
          });
        }
      }
    });
  }, [showRequests, createdOrders, travelerInfo]);

  // Toggle show requests for an order
  const toggleShowRequests = (orderId) => {
    setShowRequests(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Handle approving a traveler
  const handleApproveTraveler = (order, traveler) => {
    setSelectedOrder(order);
    setSelectedTraveler(traveler);
    setShowApprovalDialog(true);
  };

  // Handle successful traveler approval
  const handleApprovalSuccess = async () => {
    try {
      if (!selectedOrder || !selectedTraveler) return;
  
      setLoading(prev => ({ ...prev, [selectedOrder.id]: true }));
  
      const travelerId = getTravelerId(selectedTraveler);
  
      // Update delivery document
      const deliveryRef = doc(db, "delivery", selectedOrder.id);
      await updateDoc(deliveryRef, {
        assignedTraveller: travelerId,
        status: "Accepted",
        updatedAt: serverTimestamp()
      });
  
      // Update existing trip document in trips collection with the format deliveryId_userId
      const tripsRef = doc(db, "trips", `${selectedOrder.id}_${travelerId}`);
      await updateDoc(tripsRef, {
        travelerId: travelerId,
        status: "Accepted",
        updatedAt: serverTimestamp()
      });
  
      alert("Traveler approved successfully!");
      setShowApprovalDialog(false);
      setSelectedOrder(null);
      setSelectedTraveler(null);
    } catch (error) {
      console.error("Error approving traveler:", error);
      alert(`Approval failed: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [selectedOrder?.id]: false }));
    }
  };

  // Handle rejecting a traveler request
  const handleRejectTraveler = async (order, traveler) => {
    try {
      if (!order || !traveler) return;
      const travelerId = getTravelerId(traveler);
      
      setLoading(prev => ({ ...prev, [order.id + travelerId]: true }));
      
      // Update order document to remove traveler from requests
      const orderRef = doc(db, "orders", order.id);
      const updatedTravelers = order.requestedTravelers.filter(t => 
        getTravelerId(t) !== travelerId
      );

      await updateDoc(orderRef, {
        requestedTravelers: updatedTravelers,
        updatedAt: serverTimestamp()
      });

      alert("Request rejected successfully");
    } catch (error) {
      console.error("Error rejecting traveler request:", error);
      alert("Failed to reject request. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [order.id + travelerId]: false }));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Created Orders</h1>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {createdOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-4">Showing {createdOrders.length} orders</p>

          <div className="space-y-4">
            {createdOrders.map((order) => (
              <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                {/* Order Details */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
                    <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
                    <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between items-center">
                  {/* Traveler Requests */}
                  {order.requestedTravelers?.length > 0 && (
                    <button
                      onClick={() => toggleShowRequests(order.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                      {showRequests?.[order.id] ? "Hide Requests" : `Show Requests (${order.requestedTravelers.length})`}
                    </button>
                  )}

                  {/* Messages Button */}
                  {order.assignedTraveler && (
                    <button
                      onClick={() => {
                        setChatUser(getTravelerId(order.assignedTraveler));
                        setChatDeliveryTitle(order.itemDetails?.title || "Package");
                      }}
                      className="relative bg-green-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-green-600 transition"
                      >
                      💬 Messages {messageCounts[order.id] > 0 && (
                        <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                          {messageCounts[order.id]}
                        </span>
                      )}
                    </button>
                  )}

                  {/* Track Button */}
                  <button
                    onClick={() => {
                      setTrackingOrder(order);
                      setTrackingDialogOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-600 transition"
                    >
                    🚚 Track
                  </button>
                </div>

                {/* Traveler Requests List */}
                {showRequests?.[order.id] && order.requestedTravelers?.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-md font-medium mb-2">Delivery Requests</h3>
                    <div className="space-y-3">
                      {order.requestedTravelers.map((traveler, index) => {
                        const travelerId = getTravelerId(traveler);
                        return (
                          <div key={`${travelerId}-${index}`} className="flex justify-between items-center bg-white p-3 rounded-md">
                            <div className="flex items-center">
                              {travelerInfo[travelerId]?.photoURL ? (
                                <img 
                                  src={travelerInfo[travelerId].photoURL} 
                                  alt={travelerInfo[travelerId].name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                  <span className="text-gray-600">{travelerInfo[travelerId]?.name?.charAt(0) || "U"}</span>
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{travelerInfo[travelerId]?.name || travelerId}</p>
                                {travelerInfo[travelerId] && (
                                  <p className="text-xs text-gray-500">
                                    Rating: ⭐ {travelerInfo[travelerId].rating}/5 • {travelerInfo[travelerId].trips} trips
                                  </p>
                                )}
                                {traveler.requestedAt && (
                                  <p className="text-xs text-gray-500">
                                    Requested: {new Date(traveler.requestedAt.seconds * 1000).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveTraveler(order, traveler)}
                                disabled={loading[order.id] || order.status !== "Pending"}
                                className={`${
                                  order.status !== "Pending" 
                                    ? "bg-gray-300 cursor-not-allowed" 
                                    : "bg-green-500 hover:bg-green-600"
                                } text-white px-3 py-1 text-sm rounded transition`}
                              >
                                {loading[order.id] ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleRejectTraveler(order, traveler)}
                                disabled={loading[order.id + travelerId]}
                                className="bg-red-100 text-red-800 px-3 py-1 text-sm rounded hover:bg-red-200 transition"
                              >
                                {loading[order.id + travelerId] ? "..." : "Reject"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {chatUser && (
        <ChatWindow
          senderId={user.uid}
          travelerId={chatUser}
          deliveryTitle={chatDeliveryTitle}
          closeChat={() => setChatUser(null)}
        />
      )}

      {/* Order Tracking Modal */}
      {isTrackingDialogOpen && trackingOrder && (
        <OrderTracking
          isOpen={isTrackingDialogOpen}
          onClose={() => setTrackingDialogOpen(false)}
          pickup={trackingOrder.pickup?.location}
          dropoff={trackingOrder.dropoff?.location}
        />
      )}

      {/* Traveler Approval Dialog */}
      {showApprovalDialog && selectedOrder && selectedTraveler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Approve Traveler</h2>
            <p className="mb-4">
              Are you sure you want to approve <strong>{travelerInfo[getTravelerId(selectedTraveler)]?.name || getTravelerId(selectedTraveler)}</strong> to deliver your package?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApprovalDialog(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovalSuccess}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                disabled={loading[selectedOrder.id]}
              >
                {loading[selectedOrder.id] ? "Approving..." : "Approve Traveler"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatedOrders;