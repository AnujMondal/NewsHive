import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageLive = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        category: "all",
        repoter: localStorage.getItem("user") != "undefined" ? localStorage.getItem("user") : "VIT", // Handle fallback for localStorage
        createdAt:  new Date().toISOString(),
        editor: {
            DTOA:"",
            ID: ""
        },
        Details: {
            startTime: "",
            approxTime: ""
        },
        status: "ready"
    });
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("Details")) {
            const [field, key] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [key]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const p = {...formData};
            let res = await axios.post("https://newshive-express-1.onrender.com/ApplyLive", p);
            if (res.status === 200 && res.data === "00100") {
                setMsg("APPLIED SUCESSFULLY");
            } else {
                console.log(res.status);
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        // Set a timer to remove the overlay after 3 seconds
        if (msg.length > 0) {
            const timer = setTimeout(() => {
                setMsg(""); // Clear the message
                setFormData({
                    title: "",
                    category: "all",
                    repoter: localStorage.getItem("user") !== "undefined" ? localStorage.getItem("user") : "VIT", // Reset to default values
                    createdAt: new Date().toISOString(),
                    editor: {
                        DTOA: "",
                        ID: ""
                    },
                    Details: {
                        startTime: "",
                        approxTime: ""
                    },
                    status: "ready"
                });
                navigate("/"); 
                
            }, 3000); // Hide the message after 3 seconds

            return () => clearTimeout(timer); // Clean up timer
        }
    }, [msg,navigate]);

    return (
        <>
        {msg.length === 0 ? (
                <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Manage Live Stream</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block mb-1 font-medium">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Enter title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="all">All</option>
                                <option value="Education">Education</option>
                                <option value="Technology">Technology</option>
                                <option value="Sports">Sports</option>
                                <option value="International">International</option>
                                <option value="Health">Health</option>
                                <option value="Travel">Travel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Start Time</label>
                            <input
                                type="datetime-local"
                                name="Details.startTime"
                                value={formData.Details.startTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Approximate End Time</label>
                            <input
                                type="datetime-local"
                                name="Details.approxTime"
                                value={formData.Details.approxTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </form>
                </div>
                ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <h1 className="bg-green-600 text-white text-xl font-semibold p-6 rounded-lg shadow-lg text-center">
                        {msg}
                    </h1>
                </div>
            )}
        </>
    );
};

export default ManageLive;
