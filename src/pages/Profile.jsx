// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserReviews } from "../services/reviewService";
import { getUserDeliveries } from "../services/deliveryService";

function Profile() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    if (user) {
      getUserReviews(user.uid).then((data) => {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      });

      getUserDeliveries(user.uid).then(setDeliveries);
    }
  }, [user]);

  if (!user) {
    return <p className="text-center text-gray-500">Please log in to view your profile.</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-2">Your Profile</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Average Rating:</strong> {averageRating}</p>

        <h2 className="text-xl font-semibold mt-4">Your Deliveries:</h2>
        {deliveries.length === 0 ? (
          <p className="text-gray-500">No deliveries yet.</p>
        ) : (
          <ul className="space-y-2 mt-2">
            {deliveries.map((delivery) => (
              <li key={delivery.id} className="bg-gray-50 p-3 rounded-md shadow-sm">
                <p><strong>From:</strong> {delivery.pickupLocation}</p>
                <p><strong>To:</strong> {delivery.dropoffLocation}</p>
                <p><strong>Item:</strong> {delivery.itemDescription}</p>
                <p><strong>Status:</strong> {delivery.status}</p>
              </li>
            ))}
          </ul>
        )}

        <h2 className="text-xl font-semibold mt-4">Reviews Received:</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-2 mt-2">
            {reviews.map((review) => (
              <li key={review.id} className="bg-gray-50 p-3 rounded-md shadow-sm">
                <p><strong>Rating:</strong> ⭐ {review.rating}</p>
                <p><strong>Comment:</strong> {review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
