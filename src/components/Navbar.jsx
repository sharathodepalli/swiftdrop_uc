// import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "@/components/ui/button";

// function Navbar() {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="bg-indigo-600 text-white p-4">
//       <div className="flex justify-between items-center max-w-7xl mx-auto">
//         {/* Logo */}
//         <Link to="/" className="text-2xl font-bold">SwiftDrop 🚀</Link>

//         <div className="flex space-x-4 items-center">
//           {/* Show these options only if user is logged in */}
//           {user && <Link to="/available-deliveries" className="hover:text-indigo-300">Available Deliveries</Link>} 
//           {user && <Link to="/create-delivery" className="hover:text-indigo-300">Create Delivery</Link>}
//           {user && <Link to="/user-dashboard" className="hover:text-indigo-300">Dashboard</Link>}
         

//           {user ? (
//             <>
//               <Link to="/profile" className="hover:text-indigo-300">Profile</Link>
//               <Button
//                 onClick={logout}
//                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//               >
//                 Logout
//               </Button>
//             </>
//           ) : (
//             <>
//               <Link to="/available-deliveries" className="hover:text-indigo-300">Available Deliveries</Link> 
//               <Link to="/login" className="hover:text-indigo-300">Login</Link>
//               <Link to="/signup" className="hover:text-indigo-300">Sign Up</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ Import useLocation
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // ✅ Get the current route

  // ✅ Conditionally set background color
  const navbarBg = location.pathname === "/" ? "bg-black " : "bg-indigo-600";

  return (
    <nav className={`${navbarBg} text-white p-4`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">SwiftDrop 🚀</Link>

        <div className="flex space-x-4 items-center">
          {user && <Link to="/available-deliveries" className="hover:text-indigo-300">Available Deliveries</Link>} 
          {user && <Link to="/create-delivery" className="hover:text-indigo-300">Create Delivery</Link>}


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