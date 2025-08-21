import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import MainContent from "../../components/MainContent";
import BookDetails from "../../components/BookDetails";
import Notification from "../../pages/Notification/Notification";
import { FiMenu, FiBell } from "react-icons/fi";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 flex justify-between bg-[#16213e] shadow-md lg:hidden md:hidden items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-2xl focus:outline-none text-white hover:text-gray-300"
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>

          <div className="text-2xl font-serif font-semibold text-white">
            📚bo<span className="text-[#f9a826]">OK</span>stagram
          </div>

          <div className="relative z-60">
            <button
              onClick={toggleNotifications}
              className="text-2xl focus:outline-none relative text-white hover:text-gray-300"
              aria-label="Notifications"
            >
              <FiBell />
              <span className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                8
              </span>
            </button>

            <Notification
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </header>
        <div className="flex flex-col lg:flex-row overflow-auto">
          <MainContent onBookSelect={handleBookSelect} />
          {showDetails && (
            <BookDetails
              selectedBook={selectedBook}
              onClose={handleCloseDetails}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
