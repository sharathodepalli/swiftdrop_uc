
import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/available-deliveries"); 
    } catch (error) {
      setError("Invalid credentials. Please try again.");
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
            overflow-x: hidden; /* Prevent horizontal scrolling */
            background: black;
          }
          img {
            display: block;
            width: 100vw; /* Forces image to span entire width */
          }
        `}
      </style>

      <div className="relative flex flex-col items-center justify-center w-screen h-screen text-white">
        
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://img.freepik.com/free-photo/young-men-greeting-nature-near-car_23-2148179881.jpg?t=st=1740859628~exp=1740863228~hmac=bba7d9b7f730339d4db7d7dcc417b39647d9179581f8692939417665c8d00b8d&w=2000" 
            alt="Background"
            className="w-full h-full object-cover fixed"
          />
        </div>

       
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-60"></div>


        
        <div className="relative z-10 bg-white bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center mb-4 text-white">Welcome Back</h2>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {user && <p className="text-green-300 text-center mb-4">Logged in as {user.email}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border border-white text-white placeholder-gray-300"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border border-white text-white placeholder-gray-300"
            />
            <Button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-300 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-yellow-300 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;