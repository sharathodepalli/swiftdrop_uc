


import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ Import useLocation
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // ✅ Get the current route

  // ✅ Conditionally set background color
  //const navbarBg = location.pathname === "/" ? "bg-black " : "bg-indigo-600";
  const navbarBg =
  location.pathname === "/"
    ? "bg-black bg-opacity-50 backdrop-blur-md" // Glass effect on homepage
    : "bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-md"; // Gradient elsewhere


  return (
    <nav className={`${navbarBg} text-white p-4`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">SwiftDrop 🚀</Link>

        <div className="flex space-x-4 items-center">
          {user && <Link to="/available-deliveries" className="hover:text-indigo-300">Available Deliveries</Link>} 
          {user && <Link to="/create-delivery" className="hover:text-indigo-300">Create Delivery</Link>}
          {user && <Link to="/user-dashboard" className="hover:text-indigo-300">Dashboard</Link>}

          {user ? (
            <div className="relative">
              {/* Profile Image Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none"
              >
                <img
                  src={`https://randomuser.me/api/portraits/${
                    parseInt(user?.uid, 36) % 2 === 0 ? 'men' : 'women'
                  }/${parseInt(user?.uid, 36) % 99}.jpg`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800 z-50">
                  <Link to="/user-dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                  <a 
                    href="http://localhost:5173/review" 
                    className="block px-4 py-2 hover:bg-gray-100"
                    target="_self"
                    rel="noopener noreferrer"
                  >
                    Reviews
                  </a>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                  <div className="border-t my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/available-deliveries" className="hover:text-indigo-300">Available Deliveries</Link> 
              <Link to="/login" className="hover:text-indigo-300">Login</Link>
              <Link to="/signup" className="hover:text-indigo-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";

// function Navbar() {
//   const { user, logout } = useAuth();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   const navbarBg =
//     location.pathname === "/"
//       ? "bg-black bg-opacity-50 backdrop-blur-md"
//       : "bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-md";

//   return (
//     <>
//       {/* Navbar */}
//       <nav className={`${navbarBg} text-white p-4 fixed top-0 w-full z-50`}>
//         <div className="flex justify-between items-center max-w-7xl mx-auto">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold">SwiftDrop 🚀</Link>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="md:hidden focus:outline-none"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-4 items-center">
//             <Link to="/available-deliveries" className="hover:text-indigo-300">Available Deliveries</Link>
//             {user && <Link to="/create-delivery" className="hover:text-indigo-300">Create Delivery</Link>}
//             {user && <Link to="/user-dashboard" className="hover:text-indigo-300">Dashboard</Link>}
//             {user ? (
//               <div className="relative">
//                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
//                   <img
//                     src={`https://randomuser.me/api/portraits/${
//                       parseInt(user?.uid, 36) % 2 === 0 ? 'men' : 'women'
//                     }/${parseInt(user?.uid, 36) % 99}.jpg`}
//                     alt="Profile"
//                     className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
//                   />
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800 z-50">
//                     <Link to="/user-dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
//                     <a href="http://localhost:5173/review" className="block px-4 py-2 hover:bg-gray-100" target="_self" rel="noopener noreferrer">Reviews</a>
//                     <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
//                     <div className="border-t my-1"></div>
//                     <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <Link to="/login" className="hover:text-indigo-300">Login</Link>
//                 <Link to="/signup" className="hover:text-indigo-300">Sign Up</Link>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden absolute top-16 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md flex flex-col items-center space-y-4 py-4 z-40">
//           <Link to="/available-deliveries" className="hover:text-yellow-300">Available Deliveries</Link>
//           {user && <Link to="/create-delivery" className="hover:text-yellow-300">Create Delivery</Link>}
//           {user && <Link to="/user-dashboard" className="hover:text-yellow-300">Dashboard</Link>}
//           {user ? (
//             <>
//               <Link to="/settings" className="hover:text-yellow-300">Settings</Link>
//               <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-500 hover:text-red-300">Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-yellow-300">Login</Link>
//               <Link to="/signup" className="hover:text-yellow-300">Sign Up</Link>
//             </>
//           )}
//         </div>
//       )}

//       {/* Push Content Down to Prevent Overlap */}
//       <div className="pt-20 md:pt-24"></div>
//     </>
//   );
// }

// export default Navbar;
