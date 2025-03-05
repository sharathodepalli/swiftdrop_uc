

// import { useState } from "react";
// import { register } from "../services/authService";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Mail, Lock, Phone, User } from "lucide-react";
// import { Link } from "react-router-dom";

// import { db } from '../services/firebase';
// import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


// const createUserProfile = async (userId, email, name, phoneNumber) => {
//   const userRef = doc(db, 'users', userId);
//   await setDoc(userRef, {
//     uid: userId,
//     fullName: name,
//     email: email,
//     phoneNumber: phoneNumber,
//     isVerified: false,
//     trustScore: 0.0,
//     createdAt: serverTimestamp(),
//   });
// };

// function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const userCredential = await register(email, password);
//       const user = userCredential.user;

      
//       await createUserProfile(user.uid, email, name, phoneNumber);

//       setSuccess("Account created successfully! Redirecting to login...");
//       navigate("/");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
      
//       <style>
//         {`
//           *, *::before, *::after {
//             box-sizing: border-box;
//             margin: 0;
//             padding: 0;
//           }
//           html, body {
//             width: 100vw;
//             height: 100vh;
//             overflow: hidden;
//             background: black;
//           }
//           img {
//             display: block;
//           }
//         `}
//       </style>

//       <div className="relative flex flex-col items-center justify-center w-screen h-screen text-white">
        
//         <div className="absolute inset-0 w-full h-full">
//           <img 
//             src="https://img.freepik.com/free-photo/side-view-women-exchanging-items_23-2150323460.jpg?t=st=1740859943~exp=1740863543~hmac=59bb6843b536610ab3c62326e21897207f2e0d47aa91435d06bc22df91a69eee&w=2000" 
//             alt="Background"
//             className="w-full h-full object-cover fixed"
//           />
//         </div>
//         <div className="absolute inset-0 w-full h-full bg-black bg-opacity-60"></div>

        
//         {/* <div className="absolute top-6 left-10 flex items-center z-10">
//           <Link to="/" className="text-2xl font-bold text-white hover:text-yellow-400 transition">
//             SwiftDrop 🚀
//           </Link>
//         </div> */}

        
//         <div className="relative z-10 bg-white bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md">
//           <h2 className="text-2xl font-bold text-center mb-4 text-white">Create Your Account</h2>
//           {error && <p className="text-red-400 text-center mb-4">{error}</p>}
//           {success && <p className="text-green-300 text-center mb-4">{success}</p>}
//           <form onSubmit={handleRegister} className="space-y-4">
           
//             <div className="relative">
//               <User className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
//               <Input
//                 type="text"
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
//                 required
//               />
//             </div>
            
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
//               <Input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
//                 required
//               />
//             </div>
            
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
//               <Input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
//                 required
//               />
//             </div>
            
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
//               <Input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
//                 required
//               />
//             </div>
            
//             <div className="relative">
//               <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
//               <Input
//                 type="number"
//                 placeholder="Phone Number"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
//                 required
//               />
//             </div>
            
//             <Button
//               type="submit"
//               className="w-full bg-yellow-400 text-black font-bold rounded-lg shadow-md hover:bg-yellow-500 transition"
//               disabled={isLoading}
//             >
//               {isLoading ? "Creating Account..." : "Sign Up"}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Signup;

import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";

import { db } from '../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import videoSrc from "../assets/signuppage.mp4"; // Import Background Video

const createUserProfile = async (userId, email, name, phoneNumber) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    uid: userId,
    fullName: name,
    email: email,
    phoneNumber: phoneNumber,
    isVerified: false,
    trustScore: 0.0,
    createdAt: serverTimestamp(),
  });
};

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userCredential = await register(email, password);
      const user = userCredential.user;

      await createUserProfile(user.uid, email, name, phoneNumber);

      setSuccess("Account created successfully! Redirecting to login...");
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html, body {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: black;
          }
          video {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div className="relative flex flex-col items-center justify-center w-screen h-screen text-white">
        
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            src={videoSrc}
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        {/* Dark Overlay to Improve Text Visibility */}
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-60"></div>

        {/* Clickable SwiftDrop Logo */}
        <div className="absolute top-6 left-10 flex items-center z-10">
          <Link to="/" className="text-2xl font-bold text-white hover:text-yellow-400 transition">
            SwiftDrop 🚀
          </Link>
        </div>

        {/* Signup Form with Blurred Background */}
        <div className="relative z-10 bg-white bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center mb-4 text-white">Create Your Account</h2>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {success && <p className="text-green-300 text-center mb-4">{success}</p>}
          
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
              <Input
                type="number"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 bg-transparent border border-white text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold rounded-lg shadow-md hover:bg-yellow-500 transition"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
