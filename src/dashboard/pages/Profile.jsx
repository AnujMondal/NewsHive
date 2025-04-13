import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User not logged in.");
      return;
    }

    try {
      const res = await axios.get(`https://newshive-express-1.onrender.com/user/${userId}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        Unable to load profile details.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={
            user.gender === "female"
              ? "https://img.icons8.com/glyph-neue/64/admin-settings-female.png"
              : "https://img.icons8.com/glyph-neue/64/admin-settings-male.png"
          }
          alt="Admin Avatar"
          className="w-36 h-36 rounded-full border-4 border-blue-100 shadow-md"
        />
        <div className="text-gray-800 text-base space-y-2 w-full">
          <p><span className="font-semibold text-blue-600">Name:</span> {user.name}</p>
          <p><span className="font-semibold text-blue-600">Email:</span> {user.email}</p>
          <p><span className="font-semibold text-blue-600">Category:</span> {user.category || "All"}</p>
          <p><span className="font-semibold text-blue-600">Role:</span> {user.role || "User"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;