// import React from 'react';
// import { Link } from 'react-router-dom';
// import { AiFillDashboard } from 'react-icons/ai';
// import { BiNews } from 'react-icons/bi';
// import { ImProfile } from 'react-icons/im';
// import { IoLogOutOutline } from 'react-icons/io5';
// import { AiOutlinePlus } from 'react-icons/ai';
// import { FiUsers } from 'react-icons/fi';
// import { FaPlus } from 'react-icons/fa';
// import logo from '../../assets/logo.png';

// const Sidebar = () => {
//     return (
//         <div className='w-[250px] h-screen fixed left-0 top-0 bg-white'>
//             <div className='h-[70px] flex justify-center items-center'>
//                 <Link to='/'>
//                     <img className='w-[150px] h-[50px]' src={logo} alt="Logo" />
//                 </Link>
//             </div>
//             <ul className='px-3 flex flex-col gap-y-1 font-medium'>
//                 <li>
//                     <Link to='/admin' className='px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white'>
//                         <span className='text-xl'><AiFillDashboard /></span>
//                         <span>Dashboard</span>
//                     </Link>
//                 </li>
//                 <li>
//                     <Link to='/admin/writer/add' className='px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white'>
//                         <span className='text-xl'><FaPlus /></span>
//                         <span>Add Writer</span>
//                     </Link>
//                 </li>
//                 <li>
//                     <Link to='/admin/writers' className='px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white'>
//                         <span className='text-xl'><FiUsers /></span>
//                         <span>Writers</span>
//                     </Link>
//                 </li>
//                 <li>
//                     <Link to='/admin' className='px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white'>
//                         <span className='text-xl'><BiNews /></span>
//                         <span>News</span>
//                     </Link>
//                 </li>
//                 <li>
//                     <Link to='/admin/profile' className='px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white'>
//                         <span className='text-xl'><ImProfile /></span>
//                         <span>Profile</span>
//                     </Link>
//                 </li>
//             </ul>
//         </div>
//     );
// };

// export default Sidebar;

// // Let me know if you want any adjustments! 🚀
import React from "react";
import { Link } from "react-router-dom";
import { AiFillDashboard } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { ImProfile } from "react-icons/im";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { MdFiberManualRecord } from 'react-icons/md'
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const role = localStorage.getItem("role");

  return (
    <div className="w-[250px] h-screen fixed left-0 top-0 bg-white">
      <div className="h-[70px] flex justify-center items-center">
        <Link to="/">
          <img className="w-[150px] h-[50px]" src={logo} alt="Logo" />
        </Link>
      </div>
      <ul className="px-3 flex flex-col gap-y-1 font-medium">
        {/* Dashboard - only for Admin */}
        {role === "admin" && (
          <li>
            <Link
              to="/admin"
              className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
            >
              <span className="text-xl">
                <AiFillDashboard />
              </span>
              <span>Dashboard</span>
            </Link>
          </li>
        )}

        {role === "admin" ? (
          <>
            <li>
              <Link
                to="/admin/writer/add"
                className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
              >
                <span className="text-xl">
                  <FaPlus />
                </span>
                <span>Add Writer</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/writers"
                className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
              >
                <span className="text-xl">
                  <FiUsers />
                </span>
                <span>Writers</span>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/writer/createNews"
                className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
              >
                <span className="text-xl">
                  <FaPlus />
                </span>
                <span>Create News</span>
              </Link>
            </li>
          </>
        )}

        {role === "admin" ? (
          <li>
            <Link
              to="/admin"
              className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
            >
              <span className="text-xl">
                <BiNews />
              </span>
              <span>All News</span>
            </Link>
          </li>
        ) : (
          <li>
            <Link
              to="/writer/news"
              className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
            >
              <span className="text-xl">
                <BiNews />
              </span>
              <span>My News</span>
            </Link>
          </li>
        )}
        {role === "writer" && (
          <li>
            <Link
              to="/writer/requestLive"
              className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
            >
              <span className="text-xl">
                <FaVideo />
              </span>
              <span>Live News</span>
            </Link>
          </li>
        )}


{role === "writer" && (
          <li>
            <Link
              to="/writer/manageLive"
              className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
            >
              <span className="text-xl">
                <MdFiberManualRecord/>
              </span>
              <span>Manage Live Stream</span>
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/admin/profile"
            className="px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
          >
            <span className="text-xl">
              <ImProfile />
            </span>
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
