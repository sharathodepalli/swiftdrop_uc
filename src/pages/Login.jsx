
import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import videoSrc from "../assets/loginpage.mp4"; // Import Background Video

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

        {/* Dark Overlay */}
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-70"></div>

        {/* Clickable SwiftDrop Logo */}
        <div className="absolute top-6 left-10 flex items-center z-10">
          <Link to="/" className="text-2xl font-bold text-white hover:text-yellow-400 transition">
            SwiftDrop 🚀
          </Link>
        </div>

        {/* Login Box */}
        <div className="relative z-10 bg-white bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center mb-4 text-white">Welcome Back</h2>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {user && <p className="text-green-300 text-center mb-4">Logged in as {user.email}</p>}
          
          <form onSubmit={handleLogin} className="space-y-4">
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

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold rounded-lg shadow-md hover:bg-yellow-500 transition"
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
