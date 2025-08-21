import React, { useState } from "react";
import { motion } from "framer-motion";
import YourBooks from "../../pages/Books/YourBooks";
import MainContent from "../../components/MainContent";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("For You");

  return (
    <div className="block md:hidden w-full fixed top-15 bg-white z-50">
  
      <div className="border-b">
        <div className="flex relative">
          <motion.div
            className="absolute bottom-0 h-1 bg-red-500 rounded-full"
            initial={{ width: "50%", x: activeTab === "For You" ? "0%" : "100%" }}
            animate={{ width: "50%", x: activeTab === "For You" ? "0%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
          <button
            className={`flex-1 p-3 text-lg font-medium text-center ${
              activeTab === "For You" ? "text-red-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("For You")}
          >
            For You
          </button>
          <button
            className={`flex-1 p-3 text-lg font-medium text-center ${
              activeTab === "Your Books" ? "text-red-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Your Books")}
          >
            Your Books
          </button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: "calc(100vh - 110px)" }}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "For You" ? (
            <MainContent />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="p-2 bg-gray-100 rounded">
                <YourBooks />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;


