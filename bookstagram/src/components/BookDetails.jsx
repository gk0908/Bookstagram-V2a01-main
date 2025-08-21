import React, { useState, useEffect } from "react";
import {
  FaRegCommentAlt,
  FaShareAlt,
  FaTrashAlt,
  FaBookOpen,
  FaHeart,
  FaUserCircle,
  FaArrowLeft,
  FaChevronUp,
} from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const BookDetails = ({ selectedBook, onClose }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    if (selectedBook) {
      setCurrentBook(selectedBook);
      setShowFullDescription(false);
    }
  }, [selectedBook]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (!currentBook) {
    return (
      <div className="w-full lg:w-1/4 h-screen bg-[#22223b] lg:sticky top-0 overflow-y-auto flex items-center justify-center">
        <div className="text-gray-400 text-center p-6">
          <h3 className="text-xl font-bold mb-2">No Book Selected</h3>
          <p className="text-sm">Click on a book to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/4 h-screen bg-[#22223b] lg:sticky top-0 overflow-y-auto">
      <div className="lg:hidden sticky top-0 z-10 bg-[#22223b] p-4 border-b border-gray-700">
        <div className="flex items-center">
          <button
            className="text-gray-300 hover:text-white transition-colors mr-4"
            onClick={onClose}
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h2 className="text-xl font-bold text-gray-300">About Books</h2>
        </div>
      </div>

      <div className="p-4 lg:p-4 flex flex-col items-center h-[calc(100vh-64px)] lg:h-full">
        <div className="hidden lg:block w-full mb-6">
          <h2 className="text-xl font-bold text-gray-300 text-center">
            About Books
          </h2>
        </div>

        <div className="bg-white rounded-sm shadow p-1 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-48 w-36 mb-5">
          <img
            src={currentBook.image}
            alt={currentBook.title}
            className="w-full h-full object-fit rounded-sm transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="text-center w-full">
          <h4 className="text-lg font-semibold mb-1 text-gray-300 hover:text-white transition-colors">
            {currentBook.title}
          </h4>
          <p className="text-gray-400 mb-3 hover:text-gray-300 transition-colors">
            {currentBook.author}
          </p>

          <div className="flex justify-center gap-4 text-gray-400 mb-4">
            <span className="flex items-center gap-1 text-sm hover:text-green-400 transition-colors">
              <FaBookOpen className="text-xs" /> {currentBook.pages}p
            </span>
            <span className="flex items-center gap-1 text-sm hover:text-green-400 transition-colors">
              <FaStar className="text-xs" /> {currentBook.rating}
            </span>
            <span className="flex items-center gap-1 text-sm hover:text-green-400 transition-colors">
              <FaHeart className="text-xs" /> {currentBook.genre}
            </span>
          </div>

          <div className="flex justify-center gap-6 text-gray-300 mb-4">
            <button className="hover:text-green-400 transition-colors group">
              <FaRegCommentAlt className="text-lg" />
              <span className="text-xs block mt-1 group-hover:text-green-400">
                Review
              </span>
            </button>
            <button className="hover:text-green-400 transition-colors group">
              <FaShareAlt className="text-lg" />
              <span className="text-xs block mt-1 group-hover:text-green-400">
                Share
              </span>
            </button>
            <button className="hover:text-red-400 transition-colors group">
              <FaTrashAlt className="text-lg" />
              <span className="text-xs block mt-1 group-hover:text-red-400">
                Delete
              </span>
            </button>
          </div>
        </div>

        <div className="w-full mb-4">
          <p className="text-sm text-gray-400 leading-relaxed hover:text-gray-300 transition-colors">
            {showFullDescription
              ? currentBook.description
              : `${currentBook.description.substring(0, 150)}...`}
          </p>
          {currentBook.description.length > 150 && (
            <button
              onClick={toggleDescription}
              className="text-green-400 text-xs mt-2 flex items-center hover:text-green-300 transition-colors"
            >
              {showFullDescription ? (
                <>
                  <span>Show Less</span>
                  <FaChevronUp className="ml-1" size={10} />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <FaChevronDown className="ml-1" size={10} />
                </>
              )}
            </button>
          )}
        </div>

        <div className="w-full mb-4">
          <h3 className="text-md font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">
            Recent Review
          </h3>

          <div className="bg-[#2d2d44] p-3 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FaUserCircle className="text-2xl text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Sarah Johnson
                </h4>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xs ${
                        i < 4 ? "text-amber-400" : "text-gray-500"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">4/5</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              "Changed my perspective on personal finance. The stories about
              wealth creation and preservation are particularly eye-opening.
              Highly recommended for anyone interested in the psychology behind
              financial decisions!"
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span>2 days ago</span>
              <button className="hover:text-green-400 transition-colors">
                Like
              </button>
              <button className="hover:text-green-400 transition-colors">
                Reply
              </button>
            </div>
          </div>
        </div>

        <div className="w-full mt-auto pt-3 flex flex-col gap-3">
          <button className="w-full p-3 bg-green-500 hover:bg-green-600 font-medium text-white rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Read Now
          </button>
          <button className="w-full p-3 bg-transparent border border-green-500 hover:bg-green-500/10 font-medium text-green-500 rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Add to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
