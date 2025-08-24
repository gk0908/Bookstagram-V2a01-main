import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import bookPlaceholder from "../../assets/book.jpg";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Modern, card-style book component
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
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row items-center p-6 mb-8 border border-blue-100 group">
      <div className="relative">
        <img
          src={image}
          alt={`Cover of ${title}`}
          className="w-28 h-40 object-cover rounded-xl shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = bookPlaceholder;
          }}
        />
        {/* Menu removed */}
      </div>
      <div className="flex-1 min-w-0 mt-4 md:mt-0 md:ml-8 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-bold text-xl text-blue-900 truncate" title={title}>
            {title}
          </h3>
          <p className="text-blue-600 text-sm mb-2 truncate" title={author}>
            by {author}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2 mb-1">
          <div
            className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {pagesRead} of {totalPages} pages • {progressPercentage}%
          </span>
          <button
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-semibold"
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
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      });
  }, []);

  const handleProgressUpdate = (fileName, newPagesRead) => {
    const updatedBooks = books.map((book) =>
      book.fileName === fileName
        ? { ...book, pagesRead: newPagesRead }
        : book
    );
    setBooks(updatedBooks);
  };

  return (
    <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6">
      {books.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">
          No books uploaded yet.
        </p>
      ) : (
        books.map((book, idx) => (
          <ProgressBook
            key={book._id || book.fileName || idx}
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