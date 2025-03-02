import React, { useState } from "react";
import { db } from "../../../services/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../contexts/AuthContext";

function TravelerApproval({ order, traveler, onApprove, onCancel }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    if (!order || !traveler || !user) {
      setError("Missing required information");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Create a new entry in the approved_chats collection
      const chatData = {
        orderId: order.id,
        userId: user.uid,
        travelerId: traveler.id,
        createdAt: serverTimestamp(),
        pickup: {
          address: order.pickup?.location?.address || "",
          lat: order.pickup?.location?.lat || 0,
          lng: order.pickup?.location?.lng || 0
        },
        dropoff: {
          address: order.dropoff?.location?.address || "",
          lat: order.dropoff?.location?.lat || 0,
          lng: order.dropoff?.location?.lng || 0
        },
        itemDetails: order.itemDetails || {},
        status: "Approved",
        lastMessage: null,
        lastMessageTime: null
      };

      const approvedChatRef = await addDoc(collection(db, "approved_chats"), chatData);
      
      // 2. Update the order with the assigned traveler
      await updateDoc(doc(db, "orders", order.id), {
        assignedTraveler: traveler.id,
        status: "Accepted",
        updatedAt: serverTimestamp()
      });

      // 3. Run callback if provided
      if (onApprove && typeof onApprove === 'function') {
        onApprove(approvedChatRef.id);
      }
    } catch (err) {
      console.error("Error approving traveler:", err);
      setError("Failed to approve traveler. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-2">Approve Traveler</h3>
      <p className="text-gray-600 mb-4">
        Are you sure you want to approve {traveler?.name || "this traveler"} for your delivery?
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleApprove}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  );
}

export default TravelerApproval;