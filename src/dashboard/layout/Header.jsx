import React, { useState, useEffect } from 'react';
import profile from '../../assets/profile.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [userData, setUserData] = useState({
    name: '',
    role: ''
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const getUserDataFromToken = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/');
          return;
        }
        
        // Parse the JWT token
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Get user info from token payload
          const { id, role, name, email } = payload;
          
          // Set user data - customize based on what's in your token
          setUserData({
            name: name || email?.split('@')[0] || 'User', // Use name from token, fallback to email username, then 'User'
            role: role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'User'
          });
          
          console.log("Token payload:", payload); // Log to see what's in your token
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    };
    
    getUserDataFromToken();
  }, [navigate]);
  
  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/');
  };

  return (
    <div className='fixed top-0 right-0 w-[calc(100vw-250px)] bg-white shadow-md z-50'>
      <div className='h-[70px] flex justify-end items-center px-6'>
        {/* Profile Section */}
        <div className='flex gap-x-3 items-center relative'>
          <div className='flex flex-col text-right'>
            <span className='font-semibold'>{userData.name}</span>
            <span className='text-sm text-gray-500 capitalize'>{userData.role}</span>
          </div>
          <img 
            className='w-10 h-10 rounded-full border border-gray-300' 
            src={profile} 
            alt='Profile' 
          />
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className='px-4 py-1 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md text-sm font-medium transition-all duration-300'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
