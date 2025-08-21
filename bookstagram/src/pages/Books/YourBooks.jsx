import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import bookPlaceholder from "../../assets/book.jpg";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProgressBook = ({
  title,
  author,
  image = bookPlaceholder,
  pagesRead = 0,
  totalPages = 1,
  fileName,
  onProgressUpdate,
}) => {
  const progressPercentage = Math.round((pagesRead / totalPages) * 100);
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (action) => {
    setShowMenu(false);
    console.log(`${action} action for: ${title}`);
  };

  // Simulate reading progress update
  const handleRead = () => {
    if (pagesRead < totalPages) {
      onProgressUpdate(fileName, pagesRead + 1);
    }
    navigate(`/pdf/${encodeURIComponent(fileName)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-200 relative">
      <img
        src={image}
        alt={`Cover of ${title}`}
        className="w-16 h-24 object-cover border rounded"
        onError={(e) => {
          e.target.src = bookPlaceholder;
        }}
      />
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate" title={title}>
            {title}
          </h3>
          <div className="relative" ref={menuRef}>
            <button
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleMenuToggle}
            >
              <FiMoreVertical />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleAction("Share")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleAction("Edit")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleAction("Remove")}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-500 text-sm truncate" title={author}>
          {author}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          {pagesRead} of {totalPages} pages • {progressPercentage}%
        </p>
        <div className="flex items-center mt-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            onClick={handleRead}
          >
            Read
          </button>
        </div>
      </div>
    </div>
  );
};

ProgressBook.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  image: PropTypes.string,
  pagesRead: PropTypes.number,
  totalPages: PropTypes.number,
  fileName: PropTypes.string,
  onProgressUpdate: PropTypes.func,
};

const YourBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from backend API
    axios
      .get("http://localhost:5000/api/books") // <-- use full URL
      .then((res) => {
        console.log("Books API response:", res.data);
        setBooks(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      });
  }, []);

  // Update progress and persist to localStorage
  const handleProgressUpdate = (fileName, newPagesRead) => {
    const updatedBooks = books.map((book) =>
      book.fileName === fileName
        ? { ...book, pagesRead: newPagesRead }
        : book
    );
    setBooks(updatedBooks);
  };

  return (
    <div className="overflow-y-auto lg:grid grid-cols-2 gap-x-4 lg:mt-4">
      {books.length === 0 ? (
        <p className="text-gray-500 text-center">No books uploaded yet.</p>
      ) : (
        books.map((book, idx) => (
          <ProgressBook
            key={book.fileName ? book.fileName : idx}
            title={book.title}
            author={book.author}
            image={book.coverImage}
            pagesRead={book.pagesRead || 0}
            totalPages={book.totalPages || 1}
            fileName={book.fileName}
            onProgressUpdate={handleProgressUpdate}
          />
        ))
      )}
    </div>
  );
};

export default YourBooks;
