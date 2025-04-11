import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("user"))
    {
      navigate('/admin');
    }
  },[]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://newshive-express-1.onrender.com/login', {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("user",response.data.id);
        localStorage.setItem("token",response.data.token);
        navigate('/admin'); // Redirect on success
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
