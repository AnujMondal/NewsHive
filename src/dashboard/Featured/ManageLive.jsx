import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdLiveTv } from "react-icons/md";

const ManageLive = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        category: "all",
        repoter: localStorage.getItem("user") !== "undefined" ? localStorage.getItem("user") : "VIT",
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
            const payload = { ...formData };
            const res = await axios.post("https://newshive-express-1.onrender.com/ApplyLive", payload);
            if (res.status === 200 && res.data === "00100") {
                setMsg("✅ Live stream scheduled successfully!");
            } else {
                console.log(res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (msg.length > 0) {
            const timer = setTimeout(() => {
                setMsg("");
                setFormData({
                    title: "",
                    category: "all",
                    repoter: localStorage.getItem("user") !== "undefined" ? localStorage.getItem("user") : "VIT",
                    createdAt: new Date().toISOString(),
                    editor: { DTOA: "", ID: "" },
                    Details: { startTime: "", approxTime: "" },
                    status: "ready"
                });
                navigate("/");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [msg, navigate]);

    return (
        <>
            {msg.length === 0 ? (
                <div className="max-w-lg mx-auto mt-14 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <MdLiveTv className="text-red-600 text-3xl animate-pulse" />
                        <h2 className="text-2xl font-semibold text-gray-800">Schedule a Live News Stream</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="e.g. Breaking: Budget 2025 Live Coverage"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
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
                            <label className="block mb-1 font-medium text-gray-700">Start Time</label>
                            <input
                                type="datetime-local"
                                name="Details.startTime"
                                value={formData.Details.startTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Approximate End Time</label>
                            <input
                                type="datetime-local"
                                name="Details.approxTime"
                                value={formData.Details.approxTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
                        >
                            Schedule Live
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-green-500 text-white text-xl font-semibold px-8 py-6 rounded-lg shadow-lg">
                        {msg}
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageLive;