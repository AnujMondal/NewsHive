import React, { useState } from "react";
import axios from "axios";

function AddEditor() {
  const [editorData, setEditorData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleEditorChange = (e) => {
    const { name, value } = e.target;
    setEditorData({ ...editorData, [name]: value });
  };

  const handleEditorSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://newshive-express-1.onrender.com/add-editor", editorData, {
        headers: {
          'Authorization': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        }
      });

      console.log("Editor added successfully:", res.data);
      alert("Editor added successfully!");

      // Clear form
      setEditorData({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {
      console.error("Error adding editor:", error);
      alert("Failed to add editor. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#E5E5E5]">
        <h2 className="text-2xl font-bold mb-4">Add Editor</h2>
        <form onSubmit={handleEditorSubmit} className="grid grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={editorData.name}
              onChange={handleEditorChange}
              placeholder="name"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={editorData.email}
              onChange={handleEditorChange}
              placeholder="email"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={editorData.password}
              onChange={handleEditorChange}
              placeholder="password"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add editor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditor;