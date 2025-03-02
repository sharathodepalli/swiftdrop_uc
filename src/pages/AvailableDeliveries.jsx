

// import { useEffect, useState, useRef } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { getAvailableDeliveries, requestDelivery } from "../services/deliveryService"; // ✅ Fixed Import
// import { getUserProfile } from "../services/userService";
// import { FaMapMarkerAlt, FaBoxOpen, FaTruck, FaMoneyBillWave, FaShieldAlt } from "react-icons/fa";

// function AvailableDeliveries() {
//   const { user } = useAuth();
//   const [deliveries, setDeliveries] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
//   const tooltipRef = useRef(null);

//   useEffect(() => {
//     getAvailableDeliveries().then(async (data) => {
//       console.log("Delivery:", data);

//       const deliveriesWithSender = await Promise.all(
//         data.map(async (delivery) => {
//           const senderProfile = await getUserProfile(delivery.senderId);
//           return { ...delivery, senderProfile };
//         })
//       );

//       setDeliveries(deliveriesWithSender);
//     });
//   }, []);

//   const handleProfileClick = (event, senderProfile) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     setTooltipPosition({
//       x: rect.left + window.scrollX,
//       y: rect.top + rect.height + window.scrollY + 5,
//     });
//     setSelectedUser(senderProfile);
//   };

//   const acceptDeliveryRequest = async (deliveryId) => {
//     if (!user?.uid) {
//       alert("User not found. Please log in.");
//       return;
//     }

//     const response = await requestDelivery(deliveryId, user.uid);

//     if (response.success) {
//       alert("✅ Request sent successfully!");
//       setDeliveries((prevDeliveries) =>
//         prevDeliveries.map((d) =>
//           d.id === deliveryId
//             ? { ...d, requestedTravelers: [...(d.requestedTravelers ?? []), { travelerId: user.uid }] }
//             : d
//         )
//       );
//     } else {
//       alert("❌ " + response.message);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
//         setSelectedUser(null);
//       }
//     };

//     if (selectedUser) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [selectedUser]);

//   return (
//     <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
//       <div className="w-full max-w-2xl">
//         <h1 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
//           📦 Available Deliveries
//         </h1>

//         {deliveries.length === 0 ? (
//           <p className="text-gray-500 text-center">No available deliveries.</p>
//         ) : (
//           <div className="space-y-6">
//             {deliveries.map((delivery) => (
//               <div key={delivery.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-300 relative">
//                 <div 
//                   className="flex items-center mb-3 cursor-pointer relative"
//                   onClick={(event) => handleProfileClick(event, delivery.senderProfile)}
//                 >
//                   <img
//                     src={delivery.senderProfile?.profilePicture || "/default-avatar.png"}
//                     alt={delivery.senderProfile?.fullName}
//                     className="w-10 h-10 rounded-full border mr-3"
//                   />
//                   <div>
//                     <h3 className="text-md font-semibold text-gray-800">{delivery.senderProfile?.fullName}</h3>
//                     <p className="text-sm text-gray-500">
//                       ⭐ {delivery.senderProfile?.rating?.overallRating} ({delivery.senderProfile?.rating?.totalReviews} reviews)
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <h3 className="text-lg font-bold text-gray-800">{delivery.itemDetails?.title}</h3>
//                   <p className="text-gray-600 text-sm">{delivery.itemDetails?.description}</p>
//                 </div>

//                 <div className="text-gray-700 text-sm space-y-2">
//                   <p className="flex items-center">
//                     <FaMapMarkerAlt className="text-red-500 mr-2" />
//                     <strong>Pickup:</strong> {delivery.pickup?.location?.address}, {delivery.pickup?.location?.city}
//                   </p>
//                   <p className="flex items-center">
//                     <FaTruck className="text-blue-500 mr-2" />
//                     <strong>Dropoff:</strong> {delivery.dropoff?.location?.address}, {delivery.dropoff?.location?.city}
//                   </p>
//                   <p className="flex items-center">
//                     <FaBoxOpen className="text-green-500 mr-2" />
//                     <strong>Category:</strong> {delivery.itemDetails?.category}
//                   </p>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   {(delivery.requestedTravelers ?? []).some((t) => t.travelerId === user?.uid) ? (
//                     <button className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
//                       ✅ Request Sent
//                     </button>
//                   ) : (
//                     <button
//                       className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
//                       onClick={() => acceptDeliveryRequest(delivery.id)}
//                     >
//                       ✅ Accept Delivery
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AvailableDeliveries;



import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAvailableDeliveries, requestDelivery } from "../services/deliveryService";
import { getUserProfile } from "../services/userService";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { FaMapMarkerAlt, FaBoxOpen, FaTruck, FaMoneyBillWave, FaShieldAlt } from "react-icons/fa";

function AvailableDeliveries() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    getAvailableDeliveries().then(async (data) => {
      const deliveriesWithSender = await Promise.all(
        data.map(async (delivery) => {
          const senderProfile = await getUserProfile(delivery.senderId);
          return { ...delivery, senderProfile };
        })
      );
      setDeliveries(deliveriesWithSender);
    });
  }, []);

  const handleProfileClick = (event, senderProfile) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + rect.height + window.scrollY + 5,
    });
    setSelectedUser(senderProfile);
  };

  const acceptDeliveryRequest = async (deliveryId) => {
    if (!user?.uid) {
      alert("User not found. Please log in.");
      return;
    }

    const response = await requestDelivery(deliveryId, user.uid);

    if (response.success) {
      alert("✅ Request sent successfully!");

      // Update deliveries state
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((d) =>
          d.id === deliveryId
            ? { ...d, requestedTravelers: [...(d.requestedTravelers ?? []), { travelerId: user.uid }] }
            : d
        )
      );

      // Create trip document in Firestore
      const tripsRef = collection(db, "trips");
      await addDoc(tripsRef, {
        deliveryId: deliveryId,
        travelerId: user.uid,
        status: "Pending",
        createdAt: serverTimestamp(),
      });
    } else {
      alert("❌ " + response.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setSelectedUser(null);
      }
    };

    if (selectedUser) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedUser]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        
        <h1 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
          📦 Available Deliveries
        </h1>

        {deliveries.length === 0 ? (
          <p className="text-gray-500 text-center">No available deliveries.</p>
        ) : (
          <div className="space-y-6">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-300 relative">
                <div 
                  className="flex items-center mb-3 cursor-pointer relative"
                  onClick={(event) => handleProfileClick(event, delivery.senderProfile)}
                >
                  <img
                    src={delivery.senderProfile?.profilePicture || "/default-avatar.png"}
                    alt={delivery.senderProfile?.fullName}
                    className="w-10 h-10 rounded-full border mr-3"
                  />
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">{delivery.senderProfile?.fullName}</h3>
                    <p className="text-sm text-gray-500">
                      ⭐ {delivery.senderProfile?.rating?.overallRating} ({delivery.senderProfile?.rating?.totalReviews} reviews)
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{delivery.itemDetails?.title}</h3>
                  <p className="text-gray-600 text-sm">{delivery.itemDetails?.description}</p>
                </div>

                <div className="text-gray-700 text-sm space-y-2">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                    <strong>Pickup:</strong> {delivery.pickup?.location?.address}, {delivery.pickup?.location?.city}
                  </p>
                  <p className="flex items-center">
                    <FaTruck className="text-blue-500 mr-2" />
                    <strong>Dropoff:</strong> {delivery.dropoff?.location?.address}, {delivery.dropoff?.location?.city}
                  </p>
                  <p className="flex items-center">
                    <FaBoxOpen className="text-green-500 mr-2" />
                    <strong>Category:</strong> {delivery.itemDetails?.category}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  {(delivery.requestedTravelers ?? []).some((t) => t.travelerId === user?.uid) ? (
                    <button className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
                      ✅ Request Sent
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                      onClick={() => acceptDeliveryRequest(delivery.id)}
                    >
                      ✅ Accept Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailableDeliveries;