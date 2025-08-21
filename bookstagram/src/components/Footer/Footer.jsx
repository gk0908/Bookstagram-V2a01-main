import { FaHome, FaSearch, FaHeart, FaUser, FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const hiddenRoutes = ["/login", "/reader"];
  if (hiddenRoutes.includes(currentPath)) return null;

  const [unreadFavorites, setUnreadFavorites] = useState(3); 

  const menuItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "Search", icon: <FaSearch />, path: "/search" },
    {
      label: "Upload",
      icon: <FaUpload />,
      path: "/upload"
    },
    {
      label: "Favourite",
      icon: (
        <div className="relative">
          <FaHeart />
          {unreadFavorites > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadFavorites}
            </span>
          )}
        </div>
      ),
      path: "/favourite",
    },
    { label: "Profile", icon: <FaUser />, path: "/profile" },
  ];

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md bg-[#16213e] border border-gray-700 shadow-xl rounded-2xl flex justify-between items-center px-6 py-3 md:hidden z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 90 }}
    >
      {menuItems.map((item) => {
        const isActive = currentPath === item.path;

        return (
          <motion.button
            key={item.label}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.9 }}
            className={`relative group flex flex-col items-center text-sm transition-all ${
              isActive
                ? "text-white font-semibold scale-110"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            {item.label}

            
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-gray-700 text-white text-xs px-2 py-1 rounded-md z-50">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default Footer;