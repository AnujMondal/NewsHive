// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import Logo from "../assets/logo.png";

// function Home() {
//   const [news, setNews] = useState([]);

//   useEffect(() => {
//     axios.get("https://newshive-express-1.onrender.com/newsData?page=3").then((response) => {
//       setNews(response.data.data);
//       console.log(response.data.data);
//     });
//   }, []);

//   return (
//     <>
//     {news != null ?
//     <div className="bg-white text-[#333333] min-h-screen font-sans">
//       {/* Header */}
//       <header className="bg-white py-6 px-8 flex justify-between items-center shadow-sm">
//         <div className="flex items-center space-x-6">
//           <img src={Logo} alt="Logo" className="h-10 w-50 object-contain" />
//         </div>
//         <nav>
//           <ul className="flex space-x-8 text-lg text-[#333333]">
//             <li className="hover:text-[#CC0000] cursor-pointer">Home</li>
//             <li className="hover:text-[#CC0000] cursor-pointer">World</li>
//             <li className="hover:text-[#CC0000] cursor-pointer">Politics</li>
//             <li className="hover:text-[#CC0000] cursor-pointer">Sports</li>
//           </ul>
//         </nav>
//       </header>

//       {/* Breaking News Ticker */}
//       <div className="bg-[#CC0000] py-2 overflow-hidden relative">
//         <motion.div
//           className="flex space-x-10 text-white font-semibold text-sm whitespace-nowrap"
//           animate={{ x: ["100%", `-${news.length * 150}px`] }} // Adjust width dynamically
//           transition={{ repeat: Infinity, duration: 15 * news.length / 5, ease: "linear" }} // Adjust duration dynamically
//           whileHover={{ animationPlayState: "paused" }} // Pause on hover
//         >
//           {news.map((item, index) => (
//             <span key={index} className="px-4">
//               <b>{item.title}</b>
//             </span>
//           ))}
//         </motion.div>
//       </div>

//       {/* Main Content */}
//       <main className="p-6">
//         {news.length > 0 && (
//           <section className="mb-8">
//             <h2 className="text-2xl font-bold mb-4 text-[#CC0000]">Top Story</h2>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-[#E5E5E5]">
//               <img src={"https://newshive-express-1.onrender.com/images/"+ news[0].media.path} alt="News" className="w-full h-64 object-cover rounded-md" />
//               <h3 className="text-xl font-bold mt-4">{news[0].title}</h3>
//               <p className="mt-2 text-[#555555]">{news[0].description}</p>
//             </div>
//           </section>
//         )}

//         {/* News Grid */}
//         <section>
//           <h2 className="text-2xl font-bold mb-4 text-[#CC0000]">Latest News</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {news.slice(1, 7).map((article, index) => (
//               <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition border border-[#E5E5E5]">
//                 {article.urlToImage && <img src={"https://newshive-express-1.onrender.com/images/"+ article.media.path} alt="News" className="w-full h-40 object-cover rounded-md" />}
//                 <h3 className="text-lg font-bold mt-2">{article.title}</h3>
//                 <p className="text-sm mt-1 text-[#555555]">{article.content}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="bg-[#CC0000] text-white text-center p-4 mt-8">
//         <p>&copy; 2025 NewsHub. All Rights Reserved.</p>
//       </footer>
//     </div>
//     : ""}
//     </>
//   );
// }

// export default Home;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import Dis from "../dashboard/Featured/Dis";


// Constants
const API_URL = "https://newshive-express-1.onrender.com/rndData?";
const IMAGE_BASE_URL = "https://newshive-express-1.onrender.com/images/";

function Header() {
  return (
    <header className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white py-2 px-8 shadow-lg">
      {/* Logo */}
      <div className="flex justify-between items-center">
        <div className="bg-white p-2 rounded-full shadow-md">
          <img src={Logo} alt="NewsHive Logo" className="h-12 object-contain" />
        </div>

        {/* Navigation Bar */}
        <nav>
          <ul className="flex space-x-6 text-lg font-medium">
            <li className="hover:text-yellow-100 transition duration-200 ease-in-out">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-yellow-100 transition duration-200 ease-in-out">
              Politics
            </li>
            <li className="hover:text-yellow-100 transition duration-200 ease-in-out">
              Sports
            </li>
            {localStorage.getItem("user") != null ? (
              <li className="hover:text-yellow-100 transition duration-200 ease-in-out">
                <Link to={"/admin"}>Dashboard</Link>
              </li>
            ) : (
              <li className="hover:text-yellow-100 transition duration-200 ease-in-out">
                <Link to={"/login"}>Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      
      {/* Breaking News Bar */}
      <div className="mt-2 bg-red-800 text-yellow-100 py-1 shadow-md w-full">
        <p className="text-sm font-semibold tracking-wide text-center">
          Breaking News: Stay updated with the latest headlines from around the
          world!
        </p>
      </div>
    </header>
  );
}

function NewsTicker({ news }) {
  return (
    <div className="bg-gray-900 py-3 overflow-hidden">
      <motion.div
        className="flex space-x-12 text-white font-medium text-sm whitespace-nowrap"
        animate={{ x: ["100%", `-${news.length * 200}px`] }}
        transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
      >
        {news.map((item, index) => (
          <span key={index} className="px-4 flex items-center space-x-2">
            {item.media?.path && (
              <img
                src={IMAGE_BASE_URL + item.media.path}
                alt="News"
                className="w-8 h-8 object-cover rounded-full border-2 border-white"
              />
            )}
            <span>{item.title}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function TopStory({ news }) {
  if (!news.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-4xl font-extrabold mb-6 text-red-600 tracking-tight">
        Top Story
      </h2>
      <Link to={`/news/${news[0]._id}`}>
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={IMAGE_BASE_URL + news[0].media.path}
            alt="News"
            className="w-full h-80 object-cover rounded-lg mb-4"
          />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {news[0].title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{news[0].description}</p>
        </motion.div>
      </Link>
    </section>
  );
}

function LatestNews({ news }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-extrabold mb-6 text-red-600 tracking-tight">
        Latest News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.slice(1, 15).map((article, index) => (
          <Link to={`/news/${article._id}`} key={index}>
            <motion.div
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.03 }}
            >
              {article.media?.path && (
                <img
                  src={IMAGE_BASE_URL + article.media.path}
                  alt="News"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600">{article.content}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Sidebar() {
  const trendingTopics = [
    "Education",
    "Travel",
    "Health",
    "International",
    "Sports",
    "Technology",
    "Climate Change",
  ];

  // State to manage email input
  const [email, setEmail] = useState(""); // Add state for email input

  // Handle form submission
  const handleSubscribe = (e) => {
    e.preventDefault(); // Prevents page reload
    alert("Congratulations! on successfully subscribing to our NewsLetter!!");
    setEmail(""); // Clear the input after alert
  };

  return (
    <aside className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-8">
      <h2 className="text-xl font-bold mb-4 text-red-600">Trending Topics</h2>
      <ul className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <li key={index}>
            <Link
              to={`/topics/${topic.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-gray-700 hover:text-red-600 transition-all duration-200 font-medium"
            >
              {topic}
            </Link>
          </li>
        ))}
      </ul>

      {/* Newsletter Signup */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Subscribe to Our Newsletter
        </h3>
        <form className="space-y-3" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            value={email} // Controlled input value
            onChange={(e) => setEmail(e.target.value)} // Update state on change
            required // Ensures email is filled before submission
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">NewsHive</h3>
          <p className="text-gray-400">
            Your trusted source for the latest news and updates.

            
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-yellow-300 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/politics"
                className="text-gray-400 hover:text-yellow-300 transition"
              >
                Politics
              </Link>
            </li>
            <li>
              <Link
                to="/sports"
                className="text-gray-400 hover:text-yellow-300 transition"
              >
                Sports
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-300 transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.56c-.89.39-1.84.65-2.83.77 1.02-.61 1.8-1.58 2.17-2.73-.95.56-2 .97-3.12 1.19-.9-.96-2.18-1.56-3.6-1.56-2.72 0-4.92 2.2-4.92 4.92 0 .39.04.77.13 1.13-4.09-.21-7.72-2.16-10.15-5.14-.42.72-.66 1.56-.66 2.46 0 1.7.87 3.2 2.18 4.08-.8-.03-1.55-.25-2.2-.61v.06c0 2.38 1.69 4.36 3.94 4.81-.41.11-.85.17-1.3.17-.32 0-.63-.03-.93-.09.63 1.97 2.45 3.4 4.61 3.44-1.69 1.33-3.82 2.12-6.13 2.12-.4 0-.79-.02-1.18-.07 2.19 1.41 4.79 2.23 7.58 2.23 9.09 0 14.06-7.53 14.06-14.06 0-.21 0-.42-.01-.63.96-.69 1.8-1.56 2.46-2.55z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-300 transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.52 0-9.96 4.44-9.96 9.96 0 4.41 3.6 8.04 8.16 9.36v-6.6h-2.4v-2.76h2.4v-2.04c0-2.4 1.44-3.72 3.6-3.72 1.08 0 2.04.12 2.04.12v2.28h-1.2c-1.2 0-1.44.6-1.44 1.44v1.92h2.88l-.48 2.76h-2.4v6.6c4.56-1.32 8.16-4.95 8.16-9.36 0-5.52-4.44-9.96-9.96-9.96z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-gray-400 mt-8">
        ©️ 2025 NewsHive. All Rights Reserved.
      </p>
      <p className="text-center text-gray-400 mt-2">
      Made with ❤️ by NewsHive Team
      </p>
      <p className="text-center text-gray-400 mt-2">
        ( Aditya , Anuj , Nandini , Charu )
      </p>
    </footer>
  );
}

function Home() {
  const [news, setNews] = useState([]);
  const [livveAval,setLiveAval] = useState(false);
  const [liveTitle,setLiveTitle] = useState("");
  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setNews(response.data);
    });
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const l = await axios.get("https://newshive-express-1.onrender.com/checkLive");
        console.log(l);
        if (l.status === 200 && livveAval == false) {
          setLiveAval(true);
          setLiveTitle(l.data);
        } else {
          setLiveAval(false);
          setLiveTitle("");
        }
      } catch (err) {
        setLiveAval(false);
        setLiveTitle("");
      }
    };
  
    check();
    const intervalId = setInterval(check, 30000);
    return () => clearInterval(intervalId);
  }, []);
  

  return (
    // <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
    //   <Header />
    //   <NewsTicker news={news} />
    //   <main className="p-8 max-w-7xl mx-auto">
    //     <div className="flex flex-col lg:flex-row gap-8">
    //       {/* Main Content */}
    //       <div className="flex-1">
    //         <TopStory news={news} />
    //         <LatestNews news={news} />
    //       </div>
    //       {livveAval ? <Dis/> : <></>}
    //       {/* Sidebar */}
    //       <div className="w-full lg:w-80">
    //         <Sidebar />
    //       </div>
    //     </div>
    //   </main>
    //   <Footer />
    // </div>
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      <Header />
      <NewsTicker news={news} />
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
          {livveAval && liveTitle && (
              <div className="mt-6">
                <Dis title={liveTitle} />
              </div>
            )}
            <TopStory news={news} />
            <LatestNews news={news} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
