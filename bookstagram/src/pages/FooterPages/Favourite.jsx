import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

const Favourite = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100">
      <nav className="bg-[#16213e] text-white shadow-lg">
        <div className="container mx-auto px-4 py-2.5 flex items-center">
          <button onClick={handleBackClick} className="p-2 rounded-full ">
            <HiArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold ml-4 md:text-center md:mx-auto">
            Favourite Books
          </h1>
        </div>
      </nav>
    </div>
  );
};

export default Favourite;
