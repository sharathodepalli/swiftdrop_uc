// src/pages/DeliveryDetails.jsx
import ReviewForm from "../components/ReviewForm";

function DeliveryDetails({ delivery }) {
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Delivery Details</h1>
      <p><strong>Pickup:</strong> {delivery.pickupLocation}</p>
      <p><strong>Drop-off:</strong> {delivery.dropOffLocation}</p>
      <p><strong>Status:</strong> {delivery.status}</p>

      {/* Show Review Form After Completion */}
      {delivery.status === "Completed" && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Leave a Review for the Traveler</h2>
          <ReviewForm userId={delivery.travelerId} />
        </div>
      )}
    </div>
  );
}

export default DeliveryDetails;
