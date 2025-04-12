import axios from "axios";
import { useState, useEffect, useRef } from "react";

const IndiNews = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const lastElementRef = useRef(null); // Assuming use for infinite scroll
  const hasMore = true; // Placeholder, implement logic if needed

  const checkTimeInRange = (datetimeString) => {
    // Parse the input datetime string into a Date object
    const targetDate = new Date(datetimeString);
  
    // Get the current time
    const currentDate = new Date();
  
    // Calculate 5 minutes after the target datetime
    const fiveMinutesAfter = new Date(targetDate.getTime() + 5 * 60 * 1000);
  
    // Check if the current time is between the target datetime and 5 minutes after it
    if (currentDate >= targetDate && currentDate <= fiveMinutesAfter) {
      return true; // Current time is in the range
    }
    
    return false; // Current time is not in the range
  };
  const getData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
        // if(localStorage.getItem("user"))
        // {
        //     const res = await axios.get("https://newshive-express-1.onrender.com/indiNewsData/"+localStorage.getItem("user"), {
        //         headers: {
        //           'Authorization': localStorage.getItem("token"),
        //           'Content-Type': 'application/json'
        //         }});
        //     if (res.status === 200) {
        //       setData(res.data);
        //     }
        // }
                const res = await axios.get("https://newshive-express-1.onrender.com/indiNewsData/Aniket");
                if (res.status === 200) {
                  setData(res.data);
                }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const handelShow = (news) => {
    // Implement modal or redirection logic here
    console.log("Clicked News:", news);
  };

  const filteredData = data.filter((item) =>
    [item.title, item.category, item.content]
      .some(field => field?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={handleSearch}
          className="w-full max-w-lg px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full table-fixed border-collapse text-sm text-gray-700">
          <thead className="bg-blue-400 text-white sticky top-0 z-10">
            <tr>
                <th className="px-4 py-3 w-[300px] text-center">Title</th>
                <th className="px-4 py-3 w-[150px] text-center">Category</th>
                <th className="px-4 py-3 w-[150px] text-center">Reporter</th>
                <th className="px-4 py-3 w-[150px] text-center">Editor</th>
                <th className="px-4 py-3 w-[150px] text-center">Date</th>
                <th className="px-4 py-3 w-[150px] text-center">Start Time</th>
                <th className="px-4 py-3 w-[150px] text-center">Approx Time</th>
                <th className="px-4 py-3 w-[100px] text-center">Status</th>
                <th className="px-4 py-3 w-[50px] text-center">Indicator</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {data.map((news, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    if(news.status === "active" && checkTimeInRange(news.Details.startTime))
                    {
                        // redirect to start
                    }
                    }}
                  className="hover:bg-blue-100 cursor-pointer"
                >
                    <td className="px-4 py-3 truncate">{news.title}</td>
                    <td className="px-4 py-3 text-center">{news.category}</td>
                    <td className="px-4 py-3 text-center">{news.repoter}</td>
                    <td className="px-4 py-3 text-center">{news.editor?.DTOA || "N/A"}</td>
                    <td className="px-4 py-3 text-center">
                    {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">{news.Details?.startTime || "N/A"}</td>
                    <td className="px-4 py-3 text-center">{news.Details?.approxTime || "N/A"}</td>
                    <td className="px-4 py-3 text-center">{news.status}</td>
                    <td className="px-4 py-3 text-center">
                    <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{
                        backgroundColor:
                            news.status === "active"
                            ? "#10B981"
                            : news.status === "pending"
                            ? "#FBBF24"
                            : "#EF4444"
                        }}
                    ></span>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndiNews;
