import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createDelivery } from "../services/deliveryService";
import { useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";

function CreateDelivery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // ✅ Default values to prevent "undefined" errors
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General Parcel",
    weight: { value: "", unit: "kg" },
    dimensions: { length: "", width: "", height: "" },
    fragile: false,
    pickup: { 
      location: { 
        address: "", 
        city: "", 
        lat: null, 
        lng: null
      },
      flexibleTime: false ,
    pickupDate: "",
    pickupTime: ""
   },
    dropoff: {
      location: { 
        address: "", 
        city: "", 
        lat: null, 
        lng: null 
      },
      dropoffDate: "",
      dropoffTime: "",
    },
    compensation: { amount: 0, currency: "EUR", paymentMethod: "Cash" },
    escrow: false,
    idVerificationRequired: false,
    specialInstructions: "",
  });

  // ✅ Handle Input Changes (Ensure Nested Fields are Updated Correctly)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData((prev) => {
      const updatedForm = JSON.parse(JSON.stringify(prev)); // Deep copy
  
      const keys = name.split(".");
      let obj = updatedForm;
  
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {}; // Ensure the path exists
        obj = obj[keys[i]];
      }
  
      obj[keys[keys.length - 1]] = type === "checkbox" ? checked : value || "";
  
      return updatedForm;
    });
  };
  

  // ✅ Convert Date & Time to Firestore Timestamp
  const getFirestoreTimestamp = (date, time) => {
    if (!date || !time) return null;
    const dateTimeString = `${date}T${time}:00`;
    const dateTime = new Date(dateTimeString);
    return isNaN(dateTime.getTime()) ? null : Timestamp.fromDate(dateTime);
  };

  // ✅ Ensure No Undefined Values Before Submitting
  const cleanData = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) obj[key] = ""; 
      else if (typeof obj[key] === "object" && obj[key] !== null) cleanData(obj[key]);
    });
    return obj;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("❌ You must be logged in to create a delivery post.");
      return;
    }

    // ✅ Validate Required Fields
    const requiredFields = [
      "title", "description",
      "pickup.location.address", "pickup.location.city", "pickupDate", "pickupTime",
      "dropoff.location.address", "dropoff.location.city", "dropoffDate", "dropoffTime",
      "compensation.amount"
    ];

    const missingFields = requiredFields.filter(field => {
      const keys = field.split(".");
      let value = formData;
      keys.forEach(key => value = value?.[key] ?? null);
      return !value || value === "";
    });

    if (missingFields.length > 0) {
      alert(`❌ Please fill in all required fields.`);
      console.warn("Missing Fields:", missingFields);
      return;
    }

    // ✅ Convert Pickup & Dropoff Date-Time to Firestore Timestamp
    const pickupTimestamp = getFirestoreTimestamp(formData.pickupDate, formData.pickupTime);
    const dropoffTimestamp = getFirestoreTimestamp(formData.dropoffDate, formData.dropoffTime);

    if (!pickupTimestamp || !dropoffTimestamp) {
      alert("❌ Invalid Pickup or Dropoff date/time.");
      return;
    }

    // ✅ Final Data for Firestore
    const formattedData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      weight: { value: parseFloat(formData.weight.value) || 0, unit: formData.weight.unit },
      dimensions: {
        length: formData.dimensions.length || "",
        width: formData.dimensions.width || "",
        height: formData.dimensions.height || "",
      },
      fragile: formData.fragile,
      pickup: {
        location: {
          address: formData.pickup.location.address || "",
          city: formData.pickup.location.city || "",
          lat: formData.pickup.location.lat || "",
          lng: formData.pickup.location.lng || "",
        },
        date: pickupTimestamp ,
        flexibleTime: formData.pickup.flexibleTime || false,
      },
      dropoff: {
        location: {
          address: formData.dropoff.location.address || "",
          city: formData.dropoff.location.city || "",
          lat: formData.dropoff.location.lat || null,
          lng: formData.dropoff.location.lng || null,
        },
        preferredTime: dropoffTimestamp,
      },
      compensation: { 
        amount: parseFloat(formData.compensation.amount), 
        currency: formData.compensation.currency, 
        paymentMethod: formData.compensation.paymentMethod 
      },
      escrow: formData.escrow,
      idVerificationRequired: formData.idVerificationRequired,
      specialInstructions: formData.specialInstructions || "",
      status: "Pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
console.log("pickup in createDelvery:", formattedData.pickup.date);

console.log("pickUp FlexibleTime" + formattedData.pickup.flexibleTime);
console.log("pickup in createDelvery:", cleanData(formattedData.pickup.date));
    try {
      await createDelivery(user.uid, cleanData(formattedData));
      alert("✅ Delivery post created successfully!");
      navigate("/available-deliveries");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Error creating delivery. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
    <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl w-full">
      
        {/* Progress Indicator (Clickable for Navigation) */}
        <div className="flex justify-between mb-6 text-gray-600 cursor-pointer">
          <span onClick={() => setStep(1)} className={`font-bold ${step === 1 ? "text-blue-600 underline" : ""}`}>1. Item Details</span>
          <span onClick={() => setStep(2)} className={`font-bold ${step === 2 ? "text-blue-600 underline" : ""}`}>2. Pickup & Dropoff</span>
          <span onClick={() => setStep(3)} className={`font-bold ${step === 3 ? "text-blue-600 underline" : ""}`}>3. Payment & Security</span>
          <span onClick={() => setStep(4)} className={`font-bold ${step === 4 ? "text-blue-600 underline" : ""}`}>4. Preview & Submit</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: ITEM DETAILS */}

{step === 1 && (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Item Details</h2>

    {/* Item Title */}
  <div className="bg-gray-50 p-5 rounded-md shadow-sm mb-6 border border-gray-300">
    <label className="text-gray-600 text-sm">Item Title</label>
    <input
      type="text"
      name="title"
      placeholder="Enter item title"
      value={formData.title}
      onChange={handleChange}
      className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
      required
    />

    {/* Item Description */}
    <label className="text-gray-600 text-sm">Item Description</label>
    <textarea
      name="description"
      placeholder="Provide a brief description"
      value={formData.description}
      onChange={handleChange}
      className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
      required
    />

    {/* Item Category */}
    <label className="text-gray-600 text-sm">Category</label>
    <select
      name="category"
      value={formData.category}
      onChange={handleChange}
      className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
    >
      <option>General Parcel</option>
      <option>Documents</option>
      <option>Books</option>
      <option>Household Items</option>
      <option>Gifts</option>
    </select>

    {/* Weight Input */}
    <label className="text-gray-600 text-sm">Weight</label>
    <div className="flex items-center gap-3 mb-3">
      <input
        type="number"
        name="weight.value"
        placeholder="Enter weight"
        value={formData.weight.value}
        onChange={handleChange}
        className="w-3/4 p-3 border rounded-md focus:ring focus:ring-blue-300"
        required
      />
      <select
        name="weight.unit"
        value={formData.weight.unit}
        onChange={handleChange}
        className="w-1/4 p-3 border rounded-md focus:ring focus:ring-blue-300"
      >
        <option>kg</option>
        <option>g</option>
        <option>lbs</option>
      </select>
    </div>

    {/* Dimensions */}
    <label className="text-gray-600 text-sm">Dimensions (cm)</label>
    <div className="grid grid-cols-3 gap-4 mb-3">
      <input
        type="number"
        name="dimensions.length"
        placeholder="Length"
        value={formData.dimensions.length}
        onChange={handleChange}
        className="p-3 border rounded-md focus:ring focus:ring-blue-300"
      />
      <input
        type="number"
        name="dimensions.width"
        placeholder="Width"
        value={formData.dimensions.width}
        onChange={handleChange}
        className="p-3 border rounded-md focus:ring focus:ring-blue-300"
      />
      <input
        type="number"
        name="dimensions.height"
        placeholder="Height"
        value={formData.dimensions.height}
        onChange={handleChange}
        className="p-3 border rounded-md focus:ring focus:ring-blue-300"
      />
    </div>

    {/* Fragility Toggle */}
    <div className="flex items-center space-x-2 mb-3">
      <input
        type="checkbox"
        name="fragile"
        checked={formData.fragile}
        onChange={handleChange}
        className="h-5 w-5 text-blue-500 border-gray-300 focus:ring focus:ring-blue-400"
      />
      <span className="text-gray-700">Is this item fragile?</span>
    </div>
  </div>
    
    {/* Prevents moving to Step 2 if required fields are empty */}
<button
  type="button"
  onClick={() => {
    if (!formData.title || !formData.description) {
      alert("Please enter item title and description before proceeding.");
      return;
    }
    setStep(2);
  }}
  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
>
  Next Step ➡
</button>

  </>
)}


{/* STEP 2: PICKUP & DROPOFF DETAILS */}
{step === 2 && (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Pickup & Dropoff</h2>

    {/* Pickup Section */}
    <div className="bg-gray-50 p-5 rounded-md shadow-sm mb-6 border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">📍 Pickup Details</h3>

      <label className="text-gray-600 text-sm">Pickup Address</label>
      <input
        type="text"
        name="pickup.location.address"
        placeholder="Enter pickup address"
        value={formData.pickup.location.address}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
        required
      />

      <label className="text-gray-600 text-sm">Pickup City</label>
      <input
        type="text"
        name="pickup.location.city"
        placeholder="Enter city name"
        value={formData.pickup.location.city}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
        required
      />

      {/* Pickup Date & Time (Side-by-Side) */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label className="text-gray-600 text-sm">Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="text-gray-600 text-sm">Pickup Time</label>
          <input
            type="time"
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>
      </div>
    </div>

    {/* Dropoff Section */}
    <div className="bg-gray-50 p-5 rounded-md shadow-sm border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">🚚 Dropoff Details</h3>

      <label className="text-gray-600 text-sm">Dropoff Address</label>
      <input
        type="text"
        name="dropoff.location.address"
        placeholder="Enter dropoff address"
        value={formData.dropoff.location.address}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
        required
      />

      <label className="text-gray-600 text-sm">Dropoff City</label>
      <input
        type="text"
        name="dropoff.location.city"
        placeholder="Enter city name"
        value={formData.dropoff.location.city}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
        required
      />

      {/* Dropoff Date & Time (Side-by-Side) */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label className="text-gray-600 text-sm">Dropoff Date</label>
          <input
            type="date"
            name="dropoffDate"
            value={formData.dropoffDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="text-gray-600 text-sm">Dropoff Time</label>
          <input
            type="time"
            name="dropoffTime"
            value={formData.dropoffTime}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>
      </div>
    </div>
     {/* Navigation to Next Step */}
     <button
  type="button"
  onClick={() => {
    if (!formData.pickup.location.address || !formData.pickupDate) {
      alert("Please enter pickup location and date before proceeding.");
      return;
    }
    setStep(3);
  }}
  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
>
  Next Step ➡
</button>
  </>
)}

        {/* STEP 3: PAYMENT & SECURITY */}
{step === 3 && (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Payment & Security</h2>

    {/* Compensation Section */}
    <div className="bg-gray-50 p-5 rounded-md shadow-sm mb-6 border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">💰 Compensation Details</h3>

      {/* Compensation Amount with Currency Selection */}
<label className="text-gray-600 text-sm">Compensation Amount</label>
<div className="flex items-center gap-3 mb-3">
  <input
    type="number"
    name="compensation.amount"
    placeholder="Enter amount"
    value={formData.compensation.amount}
    onChange={handleChange}
    className="w-3/4 p-3 border rounded-md focus:ring focus:ring-blue-300"
  />
  <select
    name="compensation.currency"
    value={formData.compensation.currency}
    onChange={handleChange}
    className="w-1/4 p-3 border rounded-md focus:ring focus:ring-blue-300"
  >
    <option value="EUR">€ EUR</option>
    <option value="USD">$ USD</option>
    <option value="GBP">£ GBP</option>
    <option value="INR">₹ INR</option>
  </select>
</div>

      <label className="text-gray-600 text-sm">Payment Method</label>
      <select
        name="compensation.paymentMethod"
        value={formData.compensation.paymentMethod}
        onChange={handleChange}
        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 mb-3"
      >
        <option>Cash</option>
        <option>Online Payment</option>
        <option>Escrow</option>
      </select>

      <label className="flex items-center space-x-2 mt-3">
        <input
          type="checkbox"
          name="escrow"
          checked={formData.escrow}
          onChange={handleChange}
          className="h-5 w-5 text-blue-500 border-gray-300 focus:ring focus:ring-blue-400"
        />
        <span className="text-gray-700">Use Escrow Payment for Secure Transactions</span>
      </label>
    </div>

    {/* Security Section */}
    <div className="bg-gray-50 p-5 rounded-md shadow-sm border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">🔒 Security Settings</h3>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="idVerificationRequired"
          checked={formData.idVerificationRequired}
          onChange={handleChange}
          className="h-5 w-5 text-blue-500 border-gray-300 focus:ring focus:ring-blue-400"
        />
        <span className="text-gray-700">Require ID Verification from Traveler</span>
      </label>
    </div>

    {/* Navigation to Next Step */}
    <button
      type="button"
      onClick={() => setStep(4)}
      className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition mt-6"
    >
      Next Step ➡
    </button>
  </>
)}

{/* STEP 4: PREVIEW & SUBMIT */}
{step === 4 && (
  <>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 4: Preview & Submit</h2>

    {/* Preview Container */}
    <div className="bg-gray-50 p-5 rounded-md shadow-sm border border-gray-300 mb-6">

      {/* Item Details */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">📦 Item Details</h3>
        <p><strong>Title:</strong> {formData.title}</p>
        <p><strong>Description:</strong> {formData.description}</p>
        <p><strong>Category:</strong> {formData.category}</p>
        <p><strong>Weight:</strong> {formData.weight.value} {formData.weight.unit}</p>
        <p><strong>Dimensions:</strong> {formData.dimensions.length}cm × {formData.dimensions.width}cm × {formData.dimensions.height}cm</p>
        <p><strong>Fragile:</strong> {formData.fragile ? "Yes" : "No"}</p>
      </div>

      {/* Pickup & Dropoff Details */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">📍 Pickup & Dropoff</h3>
        <p><strong>Pickup Address:</strong> {formData.pickup.location.address}, {formData.pickup.location.city}</p>
        <p><strong>Pickup Date & Time:</strong> {formData.pickupDate} at {formData.pickupTime}</p>
        <p><strong>Dropoff Address:</strong> {formData.dropoff.location.address}, {formData.dropoff.location.city}</p>
        <p><strong>Dropoff Date & Time:</strong> {formData.dropoffDate} at {formData.dropoffTime}</p>
      </div>

      {/* Payment & Security */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">💰 Payment & Security</h3>
        <p><strong>Compensation:</strong> €{formData.compensation.amount}</p>
        <p><strong>Payment Method:</strong> {formData.compensation.paymentMethod}</p>
        <p><strong>Escrow Payment:</strong> {formData.escrow ? "Enabled" : "Not Used"}</p>
        <p><strong>ID Verification Required:</strong> {formData.idVerificationRequired ? "Yes" : "No"}</p>
      </div>
    </div>

    {/* Edit & Submit Buttons */}
    <div className="flex justify-between">
                <button type="button" onClick={() => setStep(3)} className="w-1/2 bg-gray-400 text-white py-3 rounded-md hover:bg-gray-500 transition mr-2">
                  ⬅ Edit Payment
                </button>
                <button type="button" onClick={handleSubmit} className="w-1/2 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition">
                  ✅ Confirm & Submit
                </button>
              </div>
  </>
)}
        </form>
      </div>
    </div>
  );
}

export default CreateDelivery;
