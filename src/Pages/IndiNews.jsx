import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndiNews = () => {
  const [data, setData] = useState([]);
  const [dd, setDD] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  const checkTimeInRange = (datetimeString) => {
    const targetDate = new Date(datetimeString);
    const now = new Date();
    const fiveMinutesAfter = new Date(targetDate.getTime() + 5 * 60 * 1000);
    return now >= targetDate && now <= fiveMinutesAfter;
  };

  const getData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (localStorage.getItem("user")) {
        const res = await axios.get(
          `https://newshive-express-1.onrender.com/indiNewsData/${localStorage.getItem("user")}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setData(res.data);
          setDD(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getAllValues = (obj) => {
    let values = [];
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        values = values.concat(getAllValues(obj[key]));
      } else {
        values.push(obj[key]);
      }
    }
    return values;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      if (value.trim() === "") {
        setDD(data);
        return;
      }

      const filtered = data.filter((news) =>
        getAllValues(news).some((val) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        )
      );

      setDD(filtered);
    }, 400);

    setDebounceTimeout(timeout);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your News Reports</h2>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={handleSearch}
            className="w-full max-w-xl px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-blue-500 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Editor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">Approx Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Live</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dd.map((news, idx) => (
                <tr
                  key={idx}
                  className={`cursor-pointer hover:bg-blue-50 transition duration-200`}
                  onClick={() => {
                    if (
                      news.status === "Active" &&
                      checkTimeInRange(news.Details.startTime)
                    ) {
                      navigate("/live", { state: { Sid: news._id } });
                    }
                  }}
                >
                  <td className="px-4 py-2 max-w-xs truncate">{news.title}</td>
                  <td className="px-4 py-2 text-center">{news.category}</td>
                  <td className="px-4 py-2 text-center">{news.repoter}</td>
                  <td className="px-4 py-2 text-center">
                    {news.editor?.DTOA || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(news.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {news.Details?.startTime || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {news.Details?.approxTime || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">{news.status}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        news.status === "Active"
                          ? "bg-green-500"
                          : news.status === "Pending"
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      }`}
                    ></span>
                  </td>
                </tr>
              ))}
              {!loading && dd.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No news found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndiNews;