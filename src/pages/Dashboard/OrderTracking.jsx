// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";

// const mapContainerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco default

// // Replace with your API key


// // Libraries to load
// const libraries = ["places", "directions", "geometry"];

// function OrderTracking({ isOpen, onClose, pickup, dropoff }) {
//   const [map, setMap] = useState(null);
//   const [center, setCenter] = useState(defaultCenter);
//   const [polylinePath, setPolylinePath] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [error, setError] = useState("");
//   const directionsServiceRef = useRef(null);
//   const polylineRef = useRef(null);
  
//   // Use the hook to load Google Maps JS API
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   // Initialize DirectionsService when API is loaded
//   useEffect(() => {
//     if (isLoaded && window.google) {
//       directionsServiceRef.current = new window.google.maps.DirectionsService();
//     }
//   }, [isLoaded]);

//   // Function to get directions
//   const fetchDirections = useCallback(() => {
//     if (!isLoaded || !pickup || !dropoff || !directionsServiceRef.current) {
//       return;
//     }
    
//     console.log("Fetching directions with:", { pickup, dropoff });
    
//     directionsServiceRef.current.route(
//       {
//         origin: new window.google.maps.LatLng(pickup.lat, pickup.lng),
//         destination: new window.google.maps.LatLng(dropoff.lat, dropoff.lng),
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           console.log("Directions result:", result);
          
//           if (result && result.routes && result.routes.length > 0) {
//             // Get all points along the route
//             const points = result.routes[0].overview_path.map(point => ({
//               lat: point.lat(),
//               lng: point.lng()
//             }));
            
//             // Validate points
//             if (points.every(point => typeof point.lat === 'number' && typeof point.lng === 'number')) {
//               setPolylinePath(points);
//               // Start tracking from first point
//               if (points.length > 0) {
//                 setCurrentLocation(points[0]);
//               }
//             } else {
//               console.error("Invalid points in polylinePath:", points);
//               setError("Invalid route data.");
//             }
//           } else {
//             setError("No valid routes found");
//           }
//         } else {
//           setError(`Directions request failed: ${status}`);
//           console.error("Directions request failed:", status);
//         }
//       }
//     );
//   }, [isLoaded, pickup, dropoff]);

//   // Set up map when coordinates are valid and API is loaded
//   useEffect(() => {
//     // Reset error
//     setError("");
    
//     // Validate coordinates
//     const hasValidPickup = pickup && typeof pickup.lat === "number" && typeof pickup.lng === "number";
//     const hasValidDropoff = dropoff && typeof dropoff.lat === "number" && typeof dropoff.lng === "number";
    
//     if (!hasValidPickup || !hasValidDropoff) {
//       setError("Invalid location data provided.");
//       return;
//     }
    
//     // Set center between pickup and dropoff
//     setCenter({
//       lat: (pickup.lat + dropoff.lat) / 2,
//       lng: (pickup.lng + dropoff.lng) / 2,
//     });
    
//     // Get directions if API is loaded
//     if (isLoaded && directionsServiceRef.current) {
//       fetchDirections();
//     }
//   }, [pickup, dropoff, isLoaded, fetchDirections]);

//   // Simulate real-time tracking
//   useEffect(() => {
//     if (!polylinePath || polylinePath.length === 0) return;

//     let index = 0;
//     let intervalId;

//     try {
//       intervalId = setInterval(() => {
//         if (index < polylinePath.length) {
//           setCurrentLocation(polylinePath[index]);
//           index++;
//         } else {
//           clearInterval(intervalId);
//         }
//       }, 2000); // Updates every 2 seconds
//     } catch (err) {
//       setError("Error simulating vehicle movement.");
//       console.error("Tracking simulation error:", err);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [polylinePath]);

//   // Handle map load
//   const handleMapLoad = useCallback((mapInstance) => {
//     setMap(mapInstance);
//     console.log("Map loaded successfully");
//   }, []);

//   if (!isOpen) return null;
  
//   // Handle loading and error states
//   if (loadError) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Order Tracking</h2>
//           <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
//             Error loading Google Maps: {loadError.message}
//           </div>
//           <button
//             onClick={onClose}
//             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-auto"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }
  
//   if (!isLoaded) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Order Tracking</h2>
//           <div className="p-4 text-center">Loading Google Maps...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Order Tracking</h2>
        
//         <div className="relative">
//           <GoogleMap 
//             mapContainerStyle={mapContainerStyle} 
//             center={center} 
//             zoom={12}
//             onLoad={handleMapLoad}
//             options={{
//               fullscreenControl: false,
//               streetViewControl: false,
//               mapTypeControl: false,
//               zoomControl: true,
//             }}
//           >
//             {pickup && pickup.lat && pickup.lng && (
//               <Marker 
//                 position={pickup} 
//                 label="P"
//                 title="Pickup Location"
//               />
//             )}

//             {dropoff && dropoff.lat && dropoff.lng && (
//               <Marker 
//                 position={dropoff} 
//                 label="D"
//                 title="Dropoff Location"
//               />
//             )}

//             {currentLocation && currentLocation.lat && currentLocation.lng && (
//               <Marker 
//                 position={currentLocation} 
//                 icon={{
//                   url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
//                   scaledSize: isLoaded ? new window.google.maps.Size(30, 30) : null
//                 }}
//                 title="Delivery Vehicle"
//               />
//             )}

// {polylinePath.length > 0 && (
//   <Polyline
//     path={polylinePath}
//     options={{
//       strokeColor: "#0088FF",
//       strokeOpacity: 0.8,
//       strokeWeight: 5,
//     }}
//     onLoad={polyline => {
//       polylineRef.current = polyline;
//       console.log("Polyline loaded successfully");
//     }}
//   />
// )}
          
//           </GoogleMap>
//         </div>
        
//         <div className="mt-4 flex justify-between items-center">
//           {error && (
//             <p className="text-red-500 text-sm">{error}</p>
//           )}
//           <div className="text-gray-600 text-sm">
//             <span>Status: </span>
//             {polylinePath.length === 0 ? (
//               <span className="text-yellow-500">Calculating route...</span>
//             ) : currentLocation ? (
//               <span className="text-green-500">Delivery in progress</span>
//             ) : (
//               <span className="text-blue-500">Ready</span>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-auto"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderTracking;


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import mapboxgl from "mapbox-gl";
// mapboxgl.accessToken = "pk.eyJ1Ijoic2hhcmF0aDIiLCJhIjoiY203cmhjZTU2MThlajJsb3AwMTZpbzIwbyJ9.9Tq5vhVBdTTuayhzo4Zgcw"; // Replace with your Mapbox token

// function OrderTracking({ isOpen, onClose, pickup, dropoff }) {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [route, setRoute] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!isOpen) return;

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [pickup.lng || dropoff.lng, pickup.lat || dropoff.lat],
//       zoom: 12,
//     });

//     // Add controls
//     map.current.addControl(new mapboxgl.NavigationControl());

//     return () => map.current?.remove();
//   }, [isOpen, pickup, dropoff]);

//   // Fetch directions
//   const fetchDirections = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
//       );
//       const data = await response.json();
//       setRoute(data.routes[0]);
//     } catch (error) {
//       setError("Failed to fetch directions.");
//     } finally {
//       setLoading(false);
//     }
//   }, [pickup, dropoff]);

//   // Simulate vehicle movement
//   useEffect(() => {
//     if (!route || !map.current) return;

//     let index = 0;
//     const interval = setInterval(() => {
//       if (index < route.geometry.coordinates.length) {
//         const [lng, lat] = route.geometry.coordinates[index];
//         setCurrentLocation({ lat, lng });
//         index++;
//       } else {
//         clearInterval(interval);
//         setCurrentLocation(null);
//       }
//     }, 2000);

//     return () => {
//       clearInterval(interval);
//       setCurrentLocation(null);
//     };
//   }, [route]);

//   // Render the map and components
//   useEffect(() => {
//     if (!map.current || !route) return;

//     // Add route polyline
//     map.current.addSource("route", {
//       type: "geojson",
//       data: {
//         type: "Feature",
//         geometry: route.geometry,
//       },
//     });

//     map.current.addLayer({
//       id: "route-layer",
//       type: "line",
//       source: "route",
//       paint: {
//         "line-color": "#0088FF",
//         "line-width": 5,
//       },
//     });

//     // Remove previous markers
//     if (map.current.getLayer("pickups-layer")) {
//       map.current.removeLayer("pickups-layer");
//       map.current.removeSource("pickups");
//     }

//     // Add markers
//     map.current.addSource("pickups", {
//       type: "geojson",
//       data: {
//         type: "FeatureCollection",
//         features: [
//           {
//             type: "Feature",
//             geometry: { type: "Point", coordinates: [pickup.lng, pickup.lat] },
//             properties: { title: "Pickup" },
//           },
//           {
//             type: "Feature",
//             geometry: { type: "Point", coordinates: [dropoff.lng, dropoff.lat] },
//             properties: { title: "Dropoff" },
//           },
//         ],
//       },
//     });

//     map.current.addLayer({
//       id: "pickups-layer",
//       type: "symbol",
//       source: "pickups",
//       layout: {
//         "icon-image": "{title}-15",
//         "icon-allow-overlap": true,
//       },
//     });

//     // Vehicle marker
//     if (currentLocation) {
//       if (map.current.getLayer("vehicle")) {
//         map.current.removeLayer("vehicle");
//         map.current.removeSource("vehicle");
//       }

//       map.current.addSource("vehicle", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: {
//             type: "Point",
//             coordinates: [currentLocation.lng, currentLocation.lat],
//           },
//         },
//       });

//       map.current.addLayer({
//         id: "vehicle",
//         type: "symbol",
//         source: "vehicle",
//         layout: {
//           "icon-image": "trucks-15",
//         },
//       });
//     }
//   }, [route, currentLocation]);

//   return (
//     <div className={`fixed inset-0 ${isOpen ? "block" : "hidden"}`}>
//       {isOpen && (
//         <div className="bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : (
//               <div>
//                 <div ref={mapContainer} className="w-full h-96" />
//                 <div className="mt-4">
//                   {error && <p className="text-red-500">{error}</p>}
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 float-right"
//                     onClick={onClose}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OrderTracking;

import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Replace with your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1Ijoic2hhcmF0aDIiLCJhIjoiY203cmhjZTU2MThlajJsb3AwMTZpbzIwbyJ9.9Tq5vhVBdTTuayhzo4Zgcw";

function OrderTracking({ isOpen, onClose, pickup, dropoff }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const currentLocationRef = useRef(null);
  const [route, setRoute] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  useEffect(() => {
    if (!isOpen) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        pickup?.lng ?? dropoff?.lng ?? defaultCenter.lng,
        pickup?.lat ?? dropoff?.lat ?? defaultCenter.lat
      ],
      zoom: 12,
    });

    const onLoad = () => {
      mapRef.current.addControl(new mapboxgl.NavigationControl());
      updateMapLayers();
    };

    mapRef.current.on('load', onLoad);

    return () => {
      mapRef.current?.remove();
    };
  }, [isOpen, pickup, dropoff]);

  useEffect(() => {
    routeRef.current = route;
    updateMapLayers();
  }, [route]);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
    updateMapLayers();
  }, [currentLocation]);

  const updateMapLayers = () => {
    const map = mapRef.current;
    const routeData = routeRef.current;
    const currentLoc = currentLocationRef.current;

    if (!map || !map.style || !map.style.loaded()) return;

    // Remove previous sources and layers
    if (map.getLayer('route-layer')) map.removeLayer('route-layer');
    if (map.getSource('route')) map.removeSource('route');
    if (map.getLayer('pickups-layer')) map.removeLayer('pickups-layer');
    if (map.getSource('pickups')) map.removeSource('pickups');
    if (map.getLayer('vehicle')) map.removeLayer('vehicle');
    if (map.getSource('vehicle')) map.removeSource('vehicle');

    // Add new route
    if (routeData) {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: routeData.geometry,
        },
      });
      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': '#0088FF',
          'line-width': 5,
        },
      });
    }

    // Add pickup and dropoff markers
    const features = [];
    if (pickup) {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [pickup.lng, pickup.lat] },
        properties: { title: 'Pickup' },
      });
    }
    if (dropoff) {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [dropoff.lng, dropoff.lat] },
        properties: { title: 'Dropoff' },
      });
    }
    if (features.length > 0) {
      map.addSource('pickups', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      });
      map.addLayer({
        id: 'pickups-layer',
        type: 'symbol',
        source: 'pickups',
        layout: {
          'icon-image': '{title}-15',
          'icon-allow-overlap': true,
        },
      });
    }

    // Add vehicle marker
    if (currentLoc) {
      map.addSource('vehicle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [currentLoc.lng, currentLoc.lat],
          },
        },
      });
      map.addLayer({
        id: 'vehicle',
        type: 'symbol',
        source: 'vehicle',
        layout: {
          'icon-image': 'trucks-15',
        },
      });
    }
  };

  // Fetch directions (implementation similar to previous code)
  const fetchDirections = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      setRoute(data.routes[0]);
    } catch (err) {
      setError("Failed to fetch directions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pickup && dropoff && mapRef.current) {
      fetchDirections();
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    if (route) {
      const { geometry } = route;

      let index = 0;
      const interval = setInterval(() => {
        if (index < geometry.coordinates.length) {
          const [lng, lat] = geometry.coordinates[index];
          setCurrentLocation({ lng, lat });
          index++;
        } else {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [route]);

  return (
    <div className={`fixed inset-0 ${isOpen ? "flex" : "hidden"}`}>
      {isOpen && (
        <div className="bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div ref={mapContainer} className="w-full h-96" />
            <div className="mt-4">
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : null}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 float-right"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;