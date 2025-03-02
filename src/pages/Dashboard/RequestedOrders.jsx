
// import React, { useEffect, useState } from "react";
// import { db } from "../../services/firebase";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { useAuth } from "../../contexts/AuthContext";
// import { getUserProfile } from "../../services/userService";
// import ChatWindow from "./ChatWindow"; // Import the chat window

// function RequestedOrders() {
//   const { user } = useAuth();
//   const [requestedOrders, setRequestedOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [chatSender, setChatSender] = useState(null);
//   const [chatDeliveryTitle, setChatDeliveryTitle] = useState(""); // Store the delivery title for chat

//   useEffect(() => {
//     if (!user?.uid) {
//       setLoading(false);
//       return;
//     }

//     const fetchRequestedOrders = async () => {
//       setLoading(true);
//       try {
//         const tripsRef = collection(db, "trips");
//         const q = query(tripsRef, where("userId", "==", user.uid));
//         const querySnapshot = await getDocs(q);

//         if (querySnapshot.empty) {
//           console.log("No requested trips found.");
//           setRequestedOrders([]);
//           return;
//         }

//         const trips = await Promise.all(
//           querySnapshot.docs.map(async (tripDoc) => {
//             const tripData = tripDoc.data();

//             let userProfile = null;
//             try {
//               userProfile = await getUserProfile(tripData.userId);
//             } catch (error) {
//               console.error("Error fetching user profile:", error);
//             }

//             let deliveryDetails = null;
//             let senderId = null;
//             try {
//               const deliveryRef = doc(db, "delivery", tripData.deliveryId);
//               const deliverySnapshot = await getDoc(deliveryRef);
//               if (deliverySnapshot.exists()) {
//                 deliveryDetails = deliverySnapshot.data();
//                 senderId = deliveryDetails.senderId;
//               }
//             } catch (error) {
//               console.error("Error fetching delivery details:", error);
//             }

//             return {
//               id: tripDoc.id,
//               ...tripData,
//               userName: userProfile?.fullName || "Unknown User",
//               senderId: senderId || "N/A",
//               requestedAt: tripData.requestedAt ? new Date(tripData.requestedAt).toLocaleString() : "N/A",
//               updatedAt: tripData.updatedAt ? new Date(tripData.updatedAt).toLocaleString() : "N/A",
//               deliveryTitle: deliveryDetails?.itemDetails?.title || "No Title",
//               deliveryDescription: deliveryDetails?.itemDetails?.description || "No Description",
//             };
//           })
//         );

//         setRequestedOrders(trips);
//       } catch (error) {
//         console.error("🔥 Error fetching requested orders:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequestedOrders();
//   }, [user?.uid]);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📦 My Requested Trips</h1>

//       {loading ? (
//         <p className="text-gray-500 text-center">Loading...</p>
//       ) : requestedOrders.length === 0 ? (
//         <p className="text-gray-500 text-center">No requested trips found</p>
//       ) : (
//         <ul className="space-y-6 max-w-3xl mx-auto">
//           {requestedOrders.map((order) => (
//             <li key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
//               {/* Delivery Title & Description */}
//               <div className="mb-3">
//                 <h2 className="text-lg font-bold text-gray-900">{order.deliveryTitle}</h2>
//                 <p className="text-sm text-gray-600">{order.deliveryDescription}</p>
//               </div>

//               {/* Delivery Details */}
//               <div className="border-t border-gray-300 pt-3 flex justify-between items-start">
//                 <div className="text-sm text-gray-700 space-y-1">
//                   <p><span className="font-medium text-gray-900">Delivery ID:</span> {order.deliveryId}</p>
//                   <p><span className="font-medium text-gray-900">Requested By:</span> {order.userName}</p>
//                 </div>
//                 {/* Chat Button - Positioned at the Right */}
//                 <button
//                   onClick={() => {
//                     setChatSender(order.senderId);
//                     setChatDeliveryTitle(order.deliveryTitle); // Set delivery title for chat
//                   }}
//                   className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded-lg shadow hover:bg-blue-600 transition"
//                 >
//                   💬 Chat
//                 </button>
//               </div>

//               {/* Status & Timestamp */}
//               <div className="mt-3 border-t border-gray-300 pt-3 flex justify-between text-xs text-gray-500">
//                 <span
//                   className={`px-3 py-1 rounded-full font-semibold text-xs ${
//                     order.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : order.status === "Completed"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//                 <div className="text-right">
//                   <p>📅 Requested At: {order.requestedAt}</p>
//                   <p>🕒 Updated At: {order.updatedAt}</p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Chat Window - Bottom Right */}
//       {/* {chatSender && (
//         <ChatWindow
//           senderId={chatSender}
//           deliveryTitle={chatDeliveryTitle} // Pass correct delivery title
//           closeChat={() => setChatSender(null)}
//         />
//       )} */}

// {chatSender && (
//   <ChatWindow
//     senderId={user.uid}
//     travelerId={chatSender}
//     deliveryTitle={chatDeliveryTitle}
//     closeChat={() => setChatSender(null)}
//   />
// )}
//     </div>
//   );
// }

// export default RequestedOrders;
//---------------------------------------

// import React, { useEffect, useState } from "react";
// import { db } from "../../services/firebase";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { useAuth } from "../../contexts/AuthContext";
// import { getUserProfile } from "../../services/userService";
// import ChatWindow from "./ChatWindow";

// function RequestedOrders() {
//   const { user } = useAuth();
//   const [requestedOrders, setRequestedOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [chatSender, setChatSender] = useState(null);
//   const [chatDeliveryTitle, setChatDeliveryTitle] = useState(""); 
//   const [unreadMessages, setUnreadMessages] = useState({});

//   useEffect(() => {
//     if (!user?.uid) {
//       setLoading(false);
//       return;
//     }

//     const fetchRequestedOrders = async () => {
//       setLoading(true);
//       try {
//         const tripsRef = collection(db, "trips");
//         const q = query(tripsRef, where("userId", "==", user.uid));
//         const querySnapshot = await getDocs(q);

//         if (querySnapshot.empty) {
//           console.log("No requested trips found.");
//           setRequestedOrders([]);
//           return;
//         }

//         const trips = await Promise.all(
//           querySnapshot.docs.map(async (tripDoc) => {
//             const tripData = tripDoc.data();

//             let userProfile = null;
//             try {
//               userProfile = await getUserProfile(tripData.userId);
//             } catch (error) {
//               console.error("Error fetching user profile:", error);
//             }

//             let deliveryDetails = null;
//             let senderId = null;
//             try {
//               const deliveryRef = doc(db, "delivery", tripData.deliveryId);
//               const deliverySnapshot = await getDoc(deliveryRef);
//               if (deliverySnapshot.exists()) {
//                 deliveryDetails = deliverySnapshot.data();
//                 senderId = deliveryDetails.senderId;
//               }
//             } catch (error) {
//               console.error("Error fetching delivery details:", error);
//             }

//             return {
//               id: tripDoc.id,
//               ...tripData,
//               userName: userProfile?.fullName || "Unknown User",
//               senderId: senderId || "N/A",
//               requestedAt: tripData.requestedAt ? new Date(tripData.requestedAt).toLocaleString() : "N/A",
//               updatedAt: tripData.updatedAt ? new Date(tripData.updatedAt).toLocaleString() : "N/A",
//               deliveryTitle: deliveryDetails?.itemDetails?.title || "No Title",
//               deliveryDescription: deliveryDetails?.itemDetails?.description || "No Description",
//             };
//           })
//         );

//         // **Filter out orders where the user is also the sender**
//         const filteredTrips = trips.filter(order => order.senderId !== user.uid);

//         setRequestedOrders(filteredTrips);
//         fetchUnreadMessages(filteredTrips);
//       } catch (error) {
//         console.error("🔥 Error fetching requested orders:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Fetch unread messages for each order
//     const fetchUnreadMessages = async (orders) => {
//       try {
//         const unreadCounts = {};
//         for (const order of orders) {
//           if (order.senderId !== user.uid) {
//             const messagesRef = collection(db, "messages");
//             const q = query(
//               messagesRef,
//               where("read", "==", false),
//               where("senderId", "==", order.senderId)
//             );
//             const querySnapshot = await getDocs(q);
//             unreadCounts[order.id] = querySnapshot.size;
//           }
//         }
//         setUnreadMessages(unreadCounts);
//       } catch (error) {
//         console.error("❌ Error fetching message count:", error);
//       }
//     };

//     fetchRequestedOrders();
//   }, [user?.uid]);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📦 My Requested Trips</h1>

//       {loading ? (
//         <p className="text-gray-500 text-center">Loading...</p>
//       ) : requestedOrders.length === 0 ? (
//         <p className="text-gray-500 text-center">No requested trips found</p>
//       ) : (
//         <ul className="space-y-6 max-w-3xl mx-auto">
//           {requestedOrders.map((order) => (
//             <li key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
//               {/* Delivery Title & Description */}
//               <div className="mb-3">
//                 <h2 className="text-lg font-bold text-gray-900">{order.deliveryTitle}</h2>
//                 <p className="text-sm text-gray-600">{order.deliveryDescription}</p>
//               </div>

//               {/* Delivery Details */}
//               <div className="border-t border-gray-300 pt-3 flex justify-between items-start">
//                 <div className="text-sm text-gray-700 space-y-1">
//                   <p><span className="font-medium text-gray-900">Delivery ID:</span> {order.deliveryId}</p>
//                   <p><span className="font-medium text-gray-900">Requested By:</span> {order.userName}</p>
//                 </div>
//                 {/* Chat Button with Validation */}
//                 {order.senderId !== user.uid ? (
//                   <button
//                     onClick={() => {
//                       setChatSender(order.senderId);
//                       setChatDeliveryTitle(order.deliveryTitle);
//                     }}
//                     className="relative bg-blue-500 text-white px-3 py-1.5 text-sm rounded-lg shadow hover:bg-blue-600 transition"
//                   >
//                     💬 Chat
//                     {unreadMessages[order.id] > 0 && (
//                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                         {unreadMessages[order.id]}
//                       </span>
//                     )}
//                   </button>
//                 ) : (
//                   <span className="text-gray-500 text-sm">You cannot chat with yourself</span>
//                 )}
//               </div>

//               {/* Status & Timestamp */}
//               <div className="mt-3 border-t border-gray-300 pt-3 flex justify-between text-xs text-gray-500">
//                 <span
//                   className={`px-3 py-1 rounded-full font-semibold text-xs ${
//                     order.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : order.status === "Completed"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//                 <div className="text-right">
//                   <p>📅 Requested At: {order.requestedAt}</p>
//                   <p>🕒 Updated At: {order.updatedAt}</p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Chat Window - Open only if sender and traveler are different */}
//       {chatSender && chatSender !== user.uid && (
//         <ChatWindow
//           senderId={user.uid}
//           travelerId={chatSender}
//           deliveryTitle={chatDeliveryTitle}
//           closeChat={() => setChatSender(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default RequestedOrders;

import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { 
  collection, query, where, getDocs, doc, getDoc, 
  onSnapshot, serverTimestamp 
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { getUserProfile } from "../../services/userService";
import ChatWindow from "./ChatWindow";

function RequestedOrders() {
  const { user } = useAuth();
  const [requestedOrders, setRequestedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatSender, setChatSender] = useState(null);
  const [chatDeliveryTitle, setChatDeliveryTitle] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchRequestedOrders = async () => {
      setLoading(true);
      try {
        const tripsRef = collection(db, "trips");
        const tripsQ = query(tripsRef, where("userId", "==", user.uid));

        const deliveriesRef = collection(db, "delivery");
        const deliveriesQ = query(deliveriesRef, where("senderId", "==", user.uid));

        const unsubscribeTrips = onSnapshot(tripsQ, async (tripsSnapshot) => {
          const tripsData = await processTripsSnapshot(tripsSnapshot);
          setRequestedOrders(tripsData);
          fetchUnreadMessages(tripsData);
        });

        const unsubscribeDeliveries = onSnapshot(deliveriesQ, async (deliveriesSnapshot) => {
          const deliveriesData = deliveriesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          // Update requestedOrders with latest delivery statuses
          const updatedTrips = requestedOrders.map(trip => {
            const delivery = deliveriesData.find(d => d.id === trip.deliveryId);
            return {
              ...trip,
              status: delivery?.status || trip.status,
            };
          });
          setRequestedOrders(updatedTrips);
        });

        return () => {
          unsubscribeTrips();
          unsubscribeDeliveries();
        };
      } catch (error) {
        console.error("Error setting up listeners:", error);
      } finally {
        setLoading(false);
      }
    };

    const processTripsSnapshot = async (snapshot) => {
      return Promise.all(
        snapshot.docs.map(async (tripDoc) => {
          const tripData = tripDoc.data();
          let userProfile = null;
          try {
            userProfile = await getUserProfile(tripData.userId);
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }

          let deliveryDetails = null;
          let senderId = null;
          try {
            const deliveryRef = doc(db, "delivery", tripData.deliveryId);
            const deliverySnapshot = await getDoc(deliveryRef);
            if (deliverySnapshot.exists()) {
              deliveryDetails = deliverySnapshot.data();
              senderId = deliveryDetails.senderId;
            }
          } catch (error) {
            console.error("Error fetching delivery details:", error);
          }

          return {
            id: tripDoc.id,
            ...tripData,
            userName: userProfile?.fullName || "Unknown User",
            senderId: senderId || "N/A",
            requestedAt: tripData.requestedAt 
              ? new Date(tripData.requestedAt).toLocaleString() 
              : "N/A",
            updatedAt: tripData.updatedAt 
              ? new Date(tripData.updatedAt).toLocaleString() 
              : "N/A",
            deliveryTitle: deliveryDetails?.itemDetails?.title || "No Title",
            deliveryDescription: deliveryDetails?.itemDetails?.description || "No Description",
            status: deliveryDetails?.status || "Pending",
          };
        })
      ).then(trips => 
        trips.filter(order => 
          order.senderId !== user.uid && order.status === "Pending"
        )
      );
    };

    fetchRequestedOrders();
  }, [user?.uid]);

  const fetchUnreadMessages = async (orders) => {
    try {
      const unreadCounts = {};
      for (const order of orders) {
        if (order.senderId !== user.uid) {
          const messagesRef = collection(db, "messages");
          const q = query(
            messagesRef,
            where("read", "==", false),
            where("senderId", "==", order.senderId)
          );
          const querySnapshot = await getDocs(q);
          unreadCounts[order.id] = querySnapshot.size;
        }
      }
      setUnreadMessages(unreadCounts);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📦 My Requested Trips</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : requestedOrders.length === 0 ? (
        <p className="text-gray-500 text-center">No requested trips found</p>
      ) : (
        <ul className="space-y-6 max-w-3xl mx-auto">
          {requestedOrders.map((order) => (
            <li key={order.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
              <div className="mb-3">
                <h2 className="text-lg font-bold text-gray-900">{order.deliveryTitle}</h2>
                <p className="text-sm text-gray-600">{order.deliveryDescription}</p>
              </div>

              <div className="border-t border-gray-300 pt-3 flex justify-between items-start">
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium text-gray-900">Delivery ID:</span> {order.deliveryId}</p>
                  <p><span className="font-medium text-gray-900">Requested By:</span> {order.userName}</p>
                </div>
                {order.senderId !== user.uid ? (
                  <button
                    onClick={() => {
                      setChatSender(order.senderId);
                      setChatDeliveryTitle(order.deliveryTitle);
                    }}
                    className="relative bg-blue-500 text-white px-3 py-1.5 text-sm rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    💬 Chat
                    {unreadMessages[order.id] > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadMessages[order.id]}
                      </span>
                    )}
                  </button>
                ) : (
                  <span className="text-gray-500 text-sm">You cannot chat with yourself</span>
                )}
              </div>

              <div className="mt-3 border-t border-gray-300 pt-3 flex justify-between text-xs text-gray-500">
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
                <div className="text-right">
                  <p>📅 Requested At: {order.requestedAt}</p>
                  <p>🕒 Updated At: {order.updatedAt}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {chatSender && chatSender !== user.uid && (
        <ChatWindow
          senderId={user.uid}
          travelerId={chatSender}
          deliveryTitle={chatDeliveryTitle}
          closeChat={() => setChatSender(null)}
        />
      )}
    </div>
  );
}

export default RequestedOrders;