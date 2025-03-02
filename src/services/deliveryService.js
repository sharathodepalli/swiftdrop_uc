import { db } from "./firebase";
import { collection, doc, addDoc, getDoc, setDoc,getDocs, updateDoc, query, where, arrayUnion, serverTimestamp } from "firebase/firestore";

// ✅ Create a new delivery post
export const createDelivery = async (userId, formData) => {
  try {
    const deliveryRef = await addDoc(collection(db, "delivery"), {
      senderId: userId,
      itemDetails: {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        weight: formData.weight,
        dimensions: formData.dimensions,
        fragile: formData.fragile,
      },
      pickup: {
        location: {
          address: formData.pickup.location.address,
          city: formData.pickup.location.city,
        },
        flexibleTime: formData.pickup.flexibleTime,
        date: formData.pickup.date,
      },
      dropoff: {
        location: {
          address: formData.dropoff.location.address,
          city: formData.dropoff.location.city,
        },
        preferredTime: formData.dropoff.preferredTime,
      },
      compensation: {
        amount: formData.compensation.amount,
        currency: formData.compensation.currency,
        paymentMethod: formData.compensation.paymentMethod,
        escrow: formData.escrow,
      },
      security: {
        idVerificationRequired: formData.idVerificationRequired,
      },
      status: "Pending",
      assignedTraveler: null,
      requestedTravelers: [], // ✅ Ensure this field exists
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return deliveryRef.id;
  } catch (error) {
    console.error("❌ Error creating delivery:", error);
    throw error;
  }
 };

// // ✅ Request to take a delivery (Traveler sends request)
// export const requestDelivery = async (deliveryId, travelerId) => {
//   try {
//     const deliveryRef = doc(db, "delivery", deliveryId);
//     const deliveryDoc = await getDoc(deliveryRef);

//     if (!deliveryDoc.exists()) {
//       return { success: false, message: "Delivery not found!" };
//     }

//     const deliveryData = deliveryDoc.data();

//     // Check if the traveler already requested
//     if (deliveryData.requestedTravelers?.some((t) => t.travelerId === travelerId)) {
//       return { success: false, message: "You have already requested this delivery." };
//     }

//     // Add traveler to the request list
//     await updateDoc(deliveryRef, {
//       requestedTravelers: arrayUnion({ travelerId, requestedAt: new Date().toISOString() }),
//     });

//     return { success: true, message: "Request sent successfully!" };
//   } catch (error) {
//     console.error("Error requesting delivery:", error);
//     return { success: false, message: error.message };
//   }
// };

// // ✅ Cancel a delivery request
// export const cancelDeliveryRequest = async (deliveryId, travelerId) => {
//   try {
//     const deliveryRef = doc(db, "delivery", deliveryId);
//     const deliveryDoc = await getDoc(deliveryRef);

//     if (!deliveryDoc.exists()) {
//       return { success: false, message: "Delivery not found!" };
//     }

//     const deliveryData = deliveryDoc.data();
//     const updatedTravelers = (deliveryData.requestedTravelers || []).filter(
//       (t) => t.travelerId !== travelerId
//     );

//     // Update Firestore with the filtered list
//     await updateDoc(deliveryRef, { requestedTravelers: updatedTravelers });

//     return { success: true, message: "Request canceled successfully!" };
//   } catch (error) {
//     console.error("Error canceling request:", error);
//     return { success: false, message: error.message };
//   }
// };


// Request to take a delivery and insert into trips collection
export const requestDelivery = async (deliveryId, travelerId) => {
  try {
    const deliveryRef = doc(db, "delivery", deliveryId);
    const tripRef = doc(db, "trips", `${deliveryId}_${travelerId}`);
    
    const deliveryDoc = await getDoc(deliveryRef);
    
    if (!deliveryDoc.exists()) {
      return { success: false, message: "Delivery not found!" };
    }
    
    const deliveryData = deliveryDoc.data();
    
    // Check if the traveler already requested the delivery
    if (deliveryData.requestedTravelers && 
        deliveryData.requestedTravelers.some(t => t.travelerId === travelerId)) {
      return { success: false, message: "You have already requested this delivery." };
    }
    
    // Update delivery document
    await updateDoc(deliveryRef, {
      requestedTravelers: arrayUnion({ 
        travelerId, 
        requestedAt: new Date().toISOString() 
      }),
      updatedAt: serverTimestamp()
    });

    // Insert into the trips collection
    await setDoc(tripRef, {
      deliveryId: deliveryId,
      userId: travelerId,
      status: "Pending",
      requestedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Request sent successfully!" };
  } catch (error) {
    console.error("Error requesting delivery:", error);
    return { success: false, message: error.message };
  }
};

export const cancelDeliveryRequest = async (deliveryId, travelerId) => {
  try {
    const deliveryRef = doc(db, "delivery", deliveryId);
    const tripRef = doc(db, "trips", `${deliveryId}_${travelerId}`);

    const deliveryDoc = await getDoc(deliveryRef);
    
    if (!deliveryDoc.exists()) {
      return { success: false, message: "Delivery not found!" };
    }
    
    const deliveryData = deliveryDoc.data();
    
    // Remove the traveler from requestedTravelers
    const requestedTravelers = deliveryData.requestedTravelers || [];
    const updatedTravelers = requestedTravelers.filter(
      t => t.travelerId !== travelerId
    );
    
    // Update Firestore
    await updateDoc(deliveryRef, { 
      requestedTravelers: updatedTravelers,
      updatedAt: serverTimestamp()
    });

    // Remove from trips collection
    await setDoc(tripRef, {
      status: "Cancelled",
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Request canceled successfully!" };
  } catch (error) {
    console.error("Error canceling request:", error);
    return { success: false, message: error.message };
  }
};


// ✅ Get deliveries created by the logged-in user
export const getUserDeliveries = async (userId) => {
  const deliveriesQuery = query(collection(db, "delivery"), where("senderId", "==", userId));
  const querySnapshot = await getDocs(deliveriesQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get deliveries where the user has requested to be a traveler
export const getRequestedDeliveries = async (userId) => {
  const deliveriesQuery = query(collection(db, "delivery"), where("requestedTravelers", "array-contains", { travelerId: userId }));
  const querySnapshot = await getDocs(deliveriesQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get deliveries where the user has been **accepted** as a traveler
export const getAcceptedDeliveries = async (userId) => {
  const deliveriesQuery = query(collection(db, "delivery"), where("assignedTraveler", "==", userId));
  const querySnapshot = await getDocs(deliveriesQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ✅ Get deliveries that are available (Pending status)
export const getAvailableDeliveries = async () => {
  const deliveriesQuery = query(collection(db, "delivery"), where("status", "==", "Pending"));
  const querySnapshot = await getDocs(deliveriesQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ✅ Update delivery status (e.g., from Pending → In Progress → Completed)
export const updateDeliveryStatus = async (deliveryId, newStatus) => {
  const deliveryRef = doc(db, "delivery", deliveryId);
  await updateDoc(deliveryRef, {
    status: newStatus,
    trackingUpdates: arrayUnion({
      status: newStatus,
      timestamp: serverTimestamp(),
    }),
  });
};

// Accept a traveler for a delivery
export const acceptTravelerForDelivery = async (deliveryId, travelerId) => {
  try {
    const deliveryRef = doc(db, "delivery", deliveryId);
    const deliveryDoc = await getDoc(deliveryRef);

    if (!deliveryDoc.exists()) {
      return { success: false, message: "Delivery not found!" };
    }

    const deliveryData = deliveryDoc.data();

    if (deliveryData.assignedTraveler) {
      return { success: false, message: "Traveler already assigned for this delivery!" };
    }

    // Update Firestore with the accepted traveler
    await updateDoc(deliveryRef, {
      assignedTraveler: travelerId,
      status: "Accepted",
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Traveler accepted successfully!" };
  } catch (error) {
    console.error("Error accepting traveler:", error);
    return { success: false, message: error.message };
  }
};

// Cancel a traveler's request
export const cancelTravelerRequest = async (deliveryId, travelerId) => {
  try {
    const deliveryRef = doc(db, "delivery", deliveryId);
    const deliveryDoc = await getDoc(deliveryRef);

    if (!deliveryDoc.exists()) {
      return { success: false, message: "Delivery not found!" };
    }

    const deliveryData = deliveryDoc.data();
    const updatedTravelers = (deliveryData.requestedTravelers || []).filter(
      (t) => t.travelerId !== travelerId
    );

    // Update Firestore with the filtered list
    await updateDoc(deliveryRef, {
      requestedTravelers: updatedTravelers,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: "Traveler request canceled successfully!" };
  } catch (error) {
    console.error("Error canceling traveler request:", error);
    return { success: false, message: error.message };
  }
};
// //d


export async function assignTraveler(deliveryId, travelerId, setCreatedOrders) {
  try {
    const deliveryRef = doc(db, "delivery", deliveryId);

    // Get latest delivery data
    const deliverySnapshot = await getDoc(deliveryRef);
    if (!deliverySnapshot.exists()) {
      console.error(`❌ Error: Delivery ID ${deliveryId} not found.`);
      return;
    }

    // Update assignedTraveler and status in Firestore
    await updateDoc(deliveryRef, {
      assignedTraveler: travelerId,
      status: "Accepted", // Ensure the status updates!
    });

    // Fetch updated data after Firestore update
    const updatedDeliverySnapshot = await getDoc(deliveryRef);
    const updatedDelivery = { id: deliveryId, ...updatedDeliverySnapshot.data() };

    // Force UI re-render
    setCreatedOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === deliveryId ? updatedDelivery : order
      )
    );

    console.log(`✅ Traveler ${travelerId} assigned to Delivery ${deliveryId} (Status updated to "Accepted")`);
  } catch (error) {
    console.error("🚨 Error assigning traveler:", error);
  }
}

export async function cancelAssignedTraveler(deliveryId, setCreatedOrders) {
  try {
    const deliveryRef = doc(db, "delivery", deliveryId);

    // Get latest delivery data
    const deliverySnapshot = await getDoc(deliveryRef);
    if (!deliverySnapshot.exists()) {
      console.error(`❌ Error: Delivery ID ${deliveryId} not found.`);
      return;
    }

    // Remove assignedTraveler and reset status to "Pending"
    await updateDoc(deliveryRef, {
      assignedTraveler: null,
      status: "Pending", // Ensure the status updates!
    });

    // Fetch updated data after Firestore update
    const updatedDeliverySnapshot = await getDoc(deliveryRef);
    const updatedDelivery = { id: deliveryId, ...updatedDeliverySnapshot.data() };

    // Force UI re-render
    setCreatedOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === deliveryId ? updatedDelivery : order
      )
    );

    console.log(`✅ Traveler assignment removed for Delivery ${deliveryId} (Status reset to "Pending")`);
  } catch (error) {
    console.error("🚨 Error canceling traveler assignment:", error);
  }
}



// Fetch user-approved trips (real-time tracking)
export const getApprovedTrips = async (userId, setApprovedTrips) => {
  const q = query(collection(db, "approved_trips"), where("userId", "==", userId));

  return onSnapshot(q, (querySnapshot) => {
    const trips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setApprovedTrips(trips);
  });
};




//----------------------------






// import { db } from "./firebase";
// import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query,onSnapshot , where, arrayUnion, serverTimestamp } from "firebase/firestore";

// // ✅ Create a new delivery post
// export const createDelivery = async (userId, formData) => {
//   try {
//     const deliveryRef = await addDoc(collection(db, "delivery"), {
//       senderId: userId,
//       itemDetails: {
//         title: formData.title,
//         description: formData.description,
//         category: formData.category,
//         weight: formData.weight,
//         dimensions: formData.dimensions,
//         fragile: formData.fragile,
//       },
//       pickup: {
//         location: {
//           address: formData.pickup.location.address,
//           city: formData.pickup.location.city,
//         },
//         flexibleTime: formData.pickup.flexibleTime,
//         date: formData.pickup.date,
//       },
//       dropoff: {
//         location: {
//           address: formData.dropoff.location.address,
//           city: formData.dropoff.location.city,
//         },
//         preferredTime: formData.dropoff.preferredTime,
//       },
//       compensation: {
//         amount: formData.compensation.amount,
//         currency: formData.compensation.currency,
//         paymentMethod: formData.compensation.paymentMethod,
//         escrow: formData.escrow,
//       },
//       security: {
//         idVerificationRequired: formData.idVerificationRequired,
//       },
//       status: "Pending",
//       assignedTraveler: null,
//       requestedTravelers: [], // ✅ Ensure this field exists
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     return deliveryRef.id;
//   } catch (error) {
//     console.error("❌ Error creating delivery:", error);
//     throw error;
//   }
// };
// // ✅ Request to take a delivery (Traveler sends request)
// export const requestDelivery = async (deliveryId, travelerId) => {
//   try {
//     const deliveryRef = doc(db, "delivery", deliveryId); // Fix collection name
//     const deliveryDoc = await getDoc(deliveryRef);

//     if (!deliveryDoc.exists()) {
//       return { success: false, message: "Delivery not found!" };
//     }

//     const deliveryData = deliveryDoc.data();

//     // Check if the traveler already requested
//     if (deliveryData.requestedTravelers?.some((t) => t.travelerId === travelerId)) {
//       return { success: false, message: "You have already requested this delivery." };
//     }

//     // Step 1: Add traveler to `requestedTravelers` in `deliveries`
//     await updateDoc(deliveryRef, {
//       requestedTravelers: arrayUnion({ travelerId, requestedAt: new Date().toISOString() }),
//     });

//     // Step 2: Create an entry in `trips`
//     await addDoc(collection(db, "trips"), {
//       userId: travelerId,
//       deliveryId,
//       status: "Pending",
//       requestedAt: new Date(),
//       updatedAt: new Date(),
//     });

//     return { success: true, message: "Request sent successfully!" };
//   } catch (error) {
//     console.error("Error requesting delivery:", error);
//     return { success: false, message: error.message };
//   }
// };


// // ✅ Cancel a delivery request (Traveler cancels request)
// export const cancelDeliveryRequest = async (deliveryId, travelerId) => {
//   try {
//     const deliveryRef = doc(db, "deliveries", deliveryId); // Fix collection name
//     const deliveryDoc = await getDoc(deliveryRef);

//     if (!deliveryDoc.exists()) {
//       return { success: false, message: "Delivery not found!" };
//     }

//     const deliveryData = deliveryDoc.data();
//     const updatedTravelers = (deliveryData.requestedTravelers || []).filter(
//       (t) => t.travelerId !== travelerId
//     );

//     // Step 1: Remove traveler from `requestedTravelers` in `deliveries`
//     await updateDoc(deliveryRef, { requestedTravelers: updatedTravelers });

//     // Step 2: Remove the trip entry from `trips`
//     const tripsQuery = query(
//       collection(db, "trips"),
//       where("userId", "==", travelerId),
//       where("deliveryId", "==", deliveryId)
//     );
//     const tripsSnapshot = await getDocs(tripsQuery);

//     tripsSnapshot.forEach(async (docSnapshot) => {
//       await deleteDoc(doc(db, "trips", docSnapshot.id));
//     });

//     return { success: true, message: "Request canceled successfully!" };
//   } catch (error) {
//     console.error("Error canceling request:", error);
//     return { success: false, message: error.message };
//   }
// };




// // ✅ Get deliveries created by the logged-in user
// export const getUserDeliveries = async (userId) => {
//   const deliveriesQuery = query(collection(db, "delivery"), where("senderId", "==", userId));
//   const querySnapshot = await getDocs(deliveriesQuery);
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // ✅ Get deliveries where the user has requested to be a traveler
// export const getRequestedDeliveries = async (userId) => {
//   const deliveriesQuery = query(collection(db, "delivery"), where("requestedTravelers", "array-contains", { travelerId: userId }));
//   const querySnapshot = await getDocs(deliveriesQuery);
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // ✅ Get deliveries where the user has been **accepted** as a traveler
// export const getAcceptedDeliveries = async (userId) => {
//   const deliveriesQuery = query(collection(db, "delivery"), where("assignedTraveler", "==", userId));
//   const querySnapshot = await getDocs(deliveriesQuery);
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // ✅ Get deliveries that are available (Pending status)
// export const getAvailableDeliveries = async () => {
//   const deliveriesQuery = query(collection(db, "delivery"), where("status", "==", "Pending"));
//   const querySnapshot = await getDocs(deliveriesQuery);
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // ✅ Update delivery status (e.g., from Pending → In Progress → Completed)
// export const updateDeliveryStatus = async (deliveryId, newStatus) => {
//   const deliveryRef = doc(db, "delivery", deliveryId);
//   await updateDoc(deliveryRef, {
//     status: newStatus,
//     trackingUpdates: arrayUnion({
//       status: newStatus,
//       timestamp: serverTimestamp(),
//     }),
//   });
// };

// // Accept a traveler for a delivery
// export const acceptTravelerForDelivery = async (deliveryId, travelerId) => {
//   try {
//     const deliveryRef = doc(db, "delivery", deliveryId);
//     const deliveryDoc = await getDoc(deliveryRef);

//     if (!deliveryDoc.exists()) {
//       return { success: false, message: "Delivery not found!" };
//     }

//     const deliveryData = deliveryDoc.data();

//     if (deliveryData.assignedTraveler) {
//       return { success: false, message: "Traveler already assigned for this delivery!" };
//     }

//     // Update Firestore with the accepted traveler
//     await updateDoc(deliveryRef, {
//       assignedTraveler: travelerId,
//       status: "Accepted",
//       updatedAt: serverTimestamp(),
//     });

//     return { success: true, message: "Traveler accepted successfully!" };
//   } catch (error) {
//     console.error("Error accepting traveler:", error);
//     return { success: false, message: error.message };
//   }
// };

// // Cancel a traveler's request
// export const cancelTravelerRequest = async (deliveryId, travelerId) => {
//   try {
//     const deliveryRef = doc(db, "delivery", deliveryId);
//     const deliveryDoc = await getDoc(deliveryRef);

//     if (!deliveryDoc.exists()) {
//       return { success: false, message: "Delivery not found!" };
//     }

//     const deliveryData = deliveryDoc.data();
//     const updatedTravelers = (deliveryData.requestedTravelers || []).filter(
//       (t) => t.travelerId !== travelerId
//     );

//     // Update Firestore with the filtered list
//     await updateDoc(deliveryRef, {
//       requestedTravelers: updatedTravelers,
//       updatedAt: serverTimestamp(),
//     });

//     return { success: true, message: "Traveler request canceled successfully!" };
//   } catch (error) {
//     console.error("Error canceling traveler request:", error);
//     return { success: false, message: error.message };
//   }
// };
// // //d


// export async function assignTraveler(deliveryId, travelerId, setCreatedOrders) {
//   try {
//     const deliveryRef = doc(db, "delivery", deliveryId);

//     // Get latest delivery data
//     const deliverySnapshot = await getDoc(deliveryRef);
//     if (!deliverySnapshot.exists()) {
//       console.error(`❌ Error: Delivery ID ${deliveryId} not found.`);
//       return;
//     }

//     // Update assignedTraveler and status in Firestore
//     await updateDoc(deliveryRef, {
//       assignedTraveler: travelerId,
//       status: "Accepted", // Ensure the status updates!
//     });

//     // Fetch updated data after Firestore update
//     const updatedDeliverySnapshot = await getDoc(deliveryRef);
//     const updatedDelivery = { id: deliveryId, ...updatedDeliverySnapshot.data() };

//     // Force UI re-render
//     setCreatedOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === deliveryId ? updatedDelivery : order
//       )
//     );

//     console.log(`✅ Traveler ${travelerId} assigned to Delivery ${deliveryId} (Status updated to "Accepted")`);
//   } catch (error) {
//     console.error("🚨 Error assigning traveler:", error);
//   }
// }

// export async function cancelAssignedTraveler(deliveryId, setCreatedOrders) {
//   try {
//     const deliveryRef = doc(db, "delivery", deliveryId);

//     // Get latest delivery data
//     const deliverySnapshot = await getDoc(deliveryRef);
//     if (!deliverySnapshot.exists()) {
//       console.error(`❌ Error: Delivery ID ${deliveryId} not found.`);
//       return;
//     }

//     // Remove assignedTraveler and reset status to "Pending"
//     await updateDoc(deliveryRef, {
//       assignedTraveler: null,
//       status: "Pending", // Ensure the status updates!
//     });

//     // Fetch updated data after Firestore update
//     const updatedDeliverySnapshot = await getDoc(deliveryRef);
//     const updatedDelivery = { id: deliveryId, ...updatedDeliverySnapshot.data() };

//     // Force UI re-render
//     setCreatedOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === deliveryId ? updatedDelivery : order
//       )
//     );

//     console.log(`✅ Traveler assignment removed for Delivery ${deliveryId} (Status reset to "Pending")`);
//   } catch (error) {
//     console.error("🚨 Error canceling traveler assignment:", error);
//   }
// }



// // Fetch user-approved trips (real-time tracking)
// export const getApprovedTrips = async (userId, setApprovedTrips) => {
//   const q = query(collection(db, "approved_trips"), where("userId", "==", userId));

//   return onSnapshot(q, (querySnapshot) => {
//     const trips = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setApprovedTrips(trips);
//   });
// };






//____________________________________________
