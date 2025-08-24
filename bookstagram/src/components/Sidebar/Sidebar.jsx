import React from "react";
import {
  FaBell,
  FaBook,
  FaHeart,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { auth, db } from "../../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [fullName, setFullName] = useState("Loading...");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setPhotoURL(user.photoURL);

          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setFullName(data.fullName || "Unnamed");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      });
    };

    fetchUserInfo();
  }, []);

  const options = [
    { name: "Upload your Book", icon: FaBook, path: "/upload" },
    { name: "Library", icon: FaBook, path: "/library" },
    { name: "Favorites", icon: FaHeart, path: "/favourites" },
    // { name: "Book Store", icon: FaBook },
    { name: "Uploded Content", icon: IoBookSharp, path: "/yourbooks" },
    { name: "Settings", icon: FaCog, path: "/settings" },
    { name: "Support", icon: FaQuestionCircle },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      height: "100vh",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      height: "100vh",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={`p-6 w-72 bg-[#16213e] fixed top-0 left-0 z-60 shadow-xl overflow-y-auto
                 md:relative md:block ${isOpen ? "block" : "hidden md:block"}`}
      style={{ height: "100vh" }}
      initial={false}
      animate={isOpen || window.innerWidth >= 768 ? "open" : "closed"}
      variants={sidebarVariants}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/">
          <h1 className="text-2xl font-bold text-white cursor-pointer">Bookstagram</h1>
        </Link>

        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white relative hidden md:block">
            <FaBell className="cursor-pointer size-5" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          <button
            className="text-gray-400 hover:text-white md:hidden"
            onClick={toggleSidebar}
          >
            <IoCloseSharp className="cursor-pointer size-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <img
          src={photoURL}
          loading="lazy"
          alt="Profile"
          className="w-24 h-24 rounded-full border-0 border-green-500 object-cover mb-3"
        />
        <h2 className="text-xl font-semibold text-white">{fullName}</h2>
        <p className="text-gray-400">@Bookstagram</p>
      </div>

      <hr className="border-gray-700 mb-4" />

      <div className="h-[calc(100vh-260px)] overflow-y-auto pr-2">
        <ul className="space-y-1">
          {options.map((option, index) => (
            <Link to={option.path || "#"} key={index}>
              <li
                key={index}
                className="flex items-center p-3 font-medium text-gray-300 hover:bg-[#3a3a5a] hover:text-white rounded-lg cursor-pointer transition-all duration-200"
              >
                <option.icon className="mr-3 text-lg" />
                <span>{option.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
