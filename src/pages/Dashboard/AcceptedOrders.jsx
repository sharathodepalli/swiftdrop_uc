// import React, { useState } from "react";
// import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../../services/firebase";
// import { useNavigate } from "react-router-dom"; // For redirecting to review page

// function AcceptedOrders({ acceptedOrders }) {
//   const navigate = useNavigate();

//   // Status options
//   const statusOptions = ["In Progress", "Picked Up", "Out for Delivery", "Delivered"];

//   // Update order status in Firestore
//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const orderRef = doc(db, "approved_trips", orderId);

//       // Check if the document exists before updating
//       const orderSnap = await getDoc(orderRef);
//       if (!orderSnap.exists()) {
//         alert("Order not found in Firestore!");
//         console.error("No document found for orderId:", orderId);
//         return;
//       }

//       await updateDoc(orderRef, {
//         status: newStatus,
//         updatedAt: serverTimestamp(),
//       });

//       alert("Status updated successfully!");
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status.");
//     }
//   };

//   // Complete the delivery and navigate to the review page
//   const completeDelivery = async (orderId) => {
//     await handleStatusChange(orderId, "Completed");
//     navigate(`/review/${orderId}`);
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Accepted Trips</h1>
//       {acceptedOrders.length === 0 ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-500">No accepted trips found</p>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
//           <div className="space-y-4">
//             {acceptedOrders.map((order) => (
//               <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
//                 {/* Order Details */}
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
//                     <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
//                     <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
//                     <p className="text-sm text-gray-600">
//                       📅 Estimated Delivery: {order.eta || "N/A"}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Status Update Dropdown */}
//                 <div className="mt-4">
//                   <label className="text-sm text-gray-600">Update Status:</label>
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                     className="w-full mt-2 p-2 border rounded-md"
//                   >
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Complete Delivery Button */}
//                 <div className="mt-4 flex justify-end">
//                   {order.status === "Out for Delivery" && (
//                     <button
//                       onClick={() => completeDelivery(order.id)}
//                       className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
//                     >
//                       ✅ Complete Delivery
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AcceptedOrders;

// import React, { useState } from "react";
// import { doc, updateDoc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
// import { db } from "../../services/firebase";
// import { useNavigate } from "react-router-dom";

// function AcceptedOrders({ acceptedOrders }) {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const statusOptions = ["In Progress", "Picked Up", "Out for Delivery", "Delivered"];

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       setLoading(true);
//       const approvedRef = doc(db, "approved_trips", orderId);
//       const tripsRef = doc(db, "trips", orderId);
//       const deliveryRef = doc(db, "delivery", orderId);

//       // Check if approved_trips document exists
//       const approvedSnap = await getDoc(approvedRef);
//       if (!approvedSnap.exists()) {
//         alert("Order not found!");
//         return;
//       }

//       // Update all related documents
//       await Promise.all([
//         updateDoc(approvedRef, {
//           status: newStatus,
//           updatedAt: serverTimestamp(),
//         }),
//         updateDoc(tripsRef, {
//           status: newStatus,
//           updatedAt: serverTimestamp(),
//         }),
//         updateDoc(deliveryRef, {
//           status: newStatus,
//           updatedAt: serverTimestamp(),
//         }),
//       ]);

//       alert("Status updated successfully!");
//     } catch (error) {
//       console.error("Update error:", error);
//       alert("Failed to update status.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const completeDelivery = async (orderId) => {
//     try {
//       await handleStatusChange(orderId, "Delivered");

//       // Get sender ID from delivery document
//       const deliveryRef = doc(db, "delivery", orderId);
//       const deliverySnap = await getDoc(deliveryRef);
//       if (!deliverySnap.exists()) {
//         alert("Delivery document not found!");
//         return;
//       }

//       const senderId = deliverySnap.data().senderId;

//       // Create review request for sender
//       const reviewRef = doc(db, "reviews", orderId);
//       await setDoc(reviewRef, {
//         orderId,
//         senderId,
//         status: "pending",
//         createdAt: serverTimestamp(),
//       }, { merge: true });

//       alert("Delivery completed! Review form sent to sender.");
//       navigate(`/review/${orderId}`);
//     } catch (error) {
//       console.error("Completion error:", error);
//       alert("Failed to complete delivery.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Accepted Trips</h1>
//       {acceptedOrders.length === 0 ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-500">No accepted trips found</p>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
//           <div className="space-y-4">
//             {acceptedOrders.map((order) => (
//               <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
//                     <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
//                     <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
//                     <p className="text-sm text-gray-600">
//                       📅 Estimated Delivery: {order.eta || "N/A"}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <span className={`inline-block px-2 py-1 text-xs rounded-full ${
//                       order.status === "Delivered"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-200 text-gray-800"
//                     }`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="text-sm text-gray-600">Update Status:</label>
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                     className="w-full mt-2 p-2 border rounded-md"
//                     disabled={loading}
//                   >
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   {order.status === "Out for Delivery" && (
//                     <button
//                       onClick={() => completeDelivery(order.id)}
//                       className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
//                       disabled={loading}
//                     >
//                       ✅ Complete Delivery
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AcceptedOrders;
//_________
// import React, { useState, useEffect } from "react";
// import { 
//   collection, 
//   query, 
//   where, 
//   getDocs, 
//   doc, 
//   updateDoc, 
//   serverTimestamp, 
//   setDoc,
//   getDoc
// } from "firebase/firestore";
// import { db } from "../../services/firebase";
// import { useNavigate } from "react-router-dom";

// function AcceptedOrders() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [acceptedOrders, setAcceptedOrders] = useState([]);

//   const statusOptions = ["In Progress", "Picked Up", "Out for Delivery", "Delivered"];

//   useEffect(() => {
//     const fetchAcceptedOrders = async () => {
//       try {
//         setLoading(true);

//         // Fetch accepted orders from trips collection
//         const tripsQuery = query(collection(db, "trips"), where("status", "==", "Accepted"));
//         const tripsSnapshot = await getDocs(tripsQuery);
//         const tripsOrders = tripsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         // Fetch accepted orders from delivery collection
//         const deliveryQuery = query(collection(db, "delivery"), where("status", "==", "Accepted"));
//         const deliverySnapshot = await getDocs(deliveryQuery);
//         const deliveryOrders = deliverySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         // Combine and set the accepted orders
//         setAcceptedOrders([...tripsOrders, ...deliveryOrders]);
//       } catch (error) {
//         console.error("Error fetching accepted orders:", error);
//         alert("Failed to fetch accepted orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAcceptedOrders();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       setLoading(true);
  
//       // Get the delivery document first to access deliveryId and userId
//       const deliveryRef = doc(db, "delivery", orderId);
//       const deliverySnap = await getDoc(deliveryRef);
      
//       if (!deliverySnap.exists()) {
//         alert(`Document with ID ${orderId} does not exist in delivery collection.`);
//         return;
//       }
      
//       const deliveryData = deliverySnap.data();
//       const deliveryId = deliveryData.deliveryId;
//       const userId = deliveryData.userId || deliveryData.senderId || deliveryData.userId;
      
//       // Format the trips document ID correctly
//       const tripsDocId = `${deliveryId}_${userId}`;
      
//       // Check if the document exists in trips collection
//       const tripsRef = doc(db, "trips", tripsDocId);
//       const tripsSnap = await getDoc(tripsRef);
      
//       // Update delivery document first
//       await updateDoc(deliveryRef, {
//         status: newStatus,
//         updatedAt: serverTimestamp(),
//       });
      
//       // Only update trips document if it exists
//       if (tripsSnap.exists()) {
//         await updateDoc(tripsRef, {
//           status: newStatus,
//           updatedAt: serverTimestamp(),
//         });
//       } else {
//         console.log(`Trip document with ID ${tripsDocId} does not exist. Only delivery updated.`);
//       }
  
//       alert("Status updated successfully!");
      
//       // Update the local state to reflect the changes
//       setAcceptedOrders(prevOrders => 
//         prevOrders.map(order => 
//           order.id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
      
//     } catch (error) {
//       console.error("Update error:", error);
//       alert(`Failed to update status: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const completeDelivery = async (orderId) => {
//     try {
//       await handleStatusChange(orderId, "Delivered");

//       // Get sender ID from delivery document
//       const deliveryRef = doc(db, "delivery", orderId);
//       const deliverySnap = await getDoc(deliveryRef);
//       if (!deliverySnap.exists()) {
//         alert("Delivery document not found!");
//         return;
//       }

//       const senderId = deliverySnap.data().senderId;

//       // Create review request for sender
//       const reviewRef = doc(db, "reviews", orderId);
//       await setDoc(reviewRef, {
//         orderId,
//         senderId,
//         status: "pending",
//         createdAt: serverTimestamp(),
//       }, { merge: true });

//       alert("Delivery completed! Review form sent to sender.");
//       navigate(`/review/${orderId}`);
//     } catch (error) {
//       console.error("Completion error:", error);
//       alert("Failed to complete delivery.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Accepted Trips</h1>
//       {loading ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-500">Loading...</p>
//         </div>
//       ) : acceptedOrders.length === 0 ? (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <p className="text-gray-500">No accepted trips found</p>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
//           <div className="space-y-4">
//             {acceptedOrders.map((order) => (
//               <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
//                     <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
//                     <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
//                     <p className="text-sm text-gray-600">
//                       📅 Estimated Delivery: {order.eta || "N/A"}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <span className={`inline-block px-2 py-1 text-xs rounded-full ${
//                       order.status === "Delivered"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-200 text-gray-800"
//                     }`}>
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="text-sm text-gray-600">Update Status:</label>
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                     className="w-full mt-2 p-2 border rounded-md"
//                     disabled={loading}
//                   >
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   {order.status === "Out for Delivery" && (
//                     <button
//                       onClick={() => completeDelivery(order.id)}
//                       className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
//                       disabled={loading}
//                     >
//                       ✅ Complete Delivery
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AcceptedOrders;




import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

function AcceptedOrders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const statusOptions = ["In Progress", "Picked Up", "Out for Delivery", "Delivered"];

  const fetchAcceptedOrders = async () => {
    try {
      setLoading(true);

      // Fetch accepted orders from trips collection
      const tripsQuery = query(collection(db, "trips"), where("status", "!=", "Delivered"));
      const tripsSnapshot = await getDocs(tripsQuery);
      const tripsOrders = tripsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch accepted orders from delivery collection
      const deliveryQuery = query(collection(db, "delivery"), where("status", "!=", "Delivered"));
      const deliverySnapshot = await getDocs(deliveryQuery);
      const deliveryOrders = deliverySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Combine and set the accepted orders
      setAcceptedOrders([...tripsOrders, ...deliveryOrders]);
    } catch (error) {
      console.error("Error fetching accepted orders:", error);
      alert("Failed to fetch accepted orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
  
      // Get the delivery document first to access deliveryId and userId
      const deliveryRef = doc(db, "delivery", orderId);
      const deliverySnap = await getDoc(deliveryRef);
      
      if (!deliverySnap.exists()) {
        alert(`Document with ID ${orderId} does not exist in delivery collection.`);
        return;
      }
      
      const deliveryData = deliverySnap.data();
      const deliveryId = deliveryData.deliveryId;
      const userId = deliveryData.userId || deliveryData.senderId || deliveryData.userId;
      
      // Format the trips document ID correctly
      const tripsDocId = `${deliveryId}_${userId}`;
      
      // Check if the document exists in trips collection
      const tripsRef = doc(db, "trips", tripsDocId);
      const tripsSnap = await getDoc(tripsRef);
      
      // Update delivery document first
      await updateDoc(deliveryRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      
      // Only update trips document if it exists
      if (tripsSnap.exists()) {
        await updateDoc(tripsRef, {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
      } else {
        console.log(`Trip document with ID ${tripsDocId} does not exist. Only delivery updated.`);
      }
  
      alert("Status updated successfully!");
      
      // Refetch the updated orders
      fetchAcceptedOrders();
      
    } catch (error) {
      console.error("Update error:", error);
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const completeDelivery = async (orderId) => {
    try {
      await handleStatusChange(orderId, "Delivered");

      // Get sender ID from delivery document
      const deliveryRef = doc(db, "delivery", orderId);
      const deliverySnap = await getDoc(deliveryRef);
      if (!deliverySnap.exists()) {
        alert("Delivery document not found!");
        return;
      }

      const senderId = deliverySnap.data().senderId;

      // Create review request for sender
      const reviewRef = doc(db, "reviews", orderId);
      await setDoc(reviewRef, {
        orderId,
        senderId,
        status: "pending",
        createdAt: serverTimestamp(),
      }, { merge: true });

      alert("Delivery completed! Review form sent to sender.");
      navigate(`/review/${orderId}`);
    } catch (error) {
      console.error("Completion error:", error);
      alert("Failed to complete delivery.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Accepted Trips</h1>
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : acceptedOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No accepted trips found</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
          <div className="space-y-4">
            {acceptedOrders.map((order) => (
              <div key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">{order.itemDetails?.title || "Package"}</p>
                    <p className="text-sm text-gray-500">{order.pickup?.location?.address || "Pickup Address"}</p>
                    <p className="text-sm text-gray-500">{order.dropoff?.location?.address || "Dropoff Address"}</p>
                    <p className="text-sm text-gray-600">
                      📅 Estimated Delivery: {order.eta || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-600">Update Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="w-full mt-2 p-2 border rounded-md"
                    disabled={loading}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex justify-end">
                  {order.status === "Out for Delivery" && (
                    <button
                      onClick={() => completeDelivery(order.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      disabled={loading}
                    >
                      ✅ Complete Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AcceptedOrders;
