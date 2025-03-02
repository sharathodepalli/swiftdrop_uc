import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAcceptedDeliveries } from "../services/deliveryService";
import { FaTruck, FaMapMarkerAlt } from "react-icons/fa";

function AcceptedDeliveries() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    if (user) {
      getAcceptedDeliveries(user.uid).then(setDeliveries);
    }
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
          ✅ Accepted Deliveries
        </h1>

        {deliveries.length === 0 ? (
          <p className="text-gray-500 text-center">You have not accepted any deliveries yet.</p>
        ) : (
          <div className="space-y-6">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
                <h3 className="text-lg font-bold text-gray-800">{delivery.itemDetails?.title}</h3>
                <p className="text-gray-600 text-sm">{delivery.itemDetails?.description}</p>
                
                <p className="flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <strong>Pickup:</strong> {delivery.pickup?.location?.city}
                </p>
                <p className="flex items-center">
                  <FaTruck className="text-blue-500 mr-2" />
                  <strong>Dropoff:</strong> {delivery.dropoff?.location?.city}
                </p>

                <p className="text-green-600 font-semibold">Status: {delivery.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptedDeliveries;
