import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    
    if (user) {
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'writer') {
        navigate('/writer');
      } else {
        // Default route if role is not recognized
        navigate('/admin');
      }
    }
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://newshive-express-1.onrender.com/login', {
        email,
        password,
      });
      console.log(response.data);
      if (response.data.success) {
        // Parse the JWT token to get the user info
        const token = response.data.token;
        const tokenParts = token.split('.');
        
        if (tokenParts.length === 3) {
          // Decode the payload part (middle part) of the JWT
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Store user info from token
          localStorage.setItem("user", payload.id || "unknown");
          localStorage.setItem("token", token);
          localStorage.setItem("role", payload.role || "writer"); // Default to writer if not specified
          localStorage.setItem("name", payload.name || "User"); // Default to 'User' if not specified
          console.log("Token payload:", payload); // Log to see what's in your token
          // Redirect based on role
          if (payload.role === 'admin') {
            navigate('/admin');
          } else if (payload.role === 'writer') {
            navigate('/writer');
          } else {
            // Default route if role is not recognized
            navigate('/editor');
          }
        } else {
          // Invalid token format
          setError('Authentication error. Please try again.');
        }
      } else {
        setError('Incorrect email or password');
      }
    } catch (error) {

      setError('Login failed. Please try again.');

      

    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-sky-200">
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-8 py-10 w-96 backdrop-filter backdrop-blur-lg bg-opacity-40">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-gray-800 bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-gray-800 bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;