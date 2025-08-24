import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import bookPlaceholder from "../../assets/book.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiArrowLeft } from "react-icons/hi";

// ---- Book Card ----
const ProgressBook = ({
  title,
  author,
  image = bookPlaceholder,
  fileName,
  onRead,
}) => {
  const navigate = useNavigate();

  const handleRead = () => {
    if (onRead) onRead(fileName);
    navigate(`/pdf/${encodeURIComponent(fileName)}`);
  };

  return (
    <div className="bg-[#16213e] rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 flex flex-col hover:shadow-2xl hover:-translate-y-1 w-full">
      {/* Book image */}
      <div className="relative flex-grow flex items-center justify-center h-48 sm:h-56 w-full overflow-hidden bg-gray-700">
        <img
          src={image}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = bookPlaceholder;
          }}
        />
      </div>

      {/* Book content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3
          className="font-bold text-white text-sm sm:text-base truncate group-hover:text-emerald-500 transition-colors"
          title={title}
        >
          {title}
        </h3>
        <p
          className="text-gray-300 text-xs sm:text-sm mt-1 truncate group-hover:text-gray-400 transition-colors"
          title={author}
        >
          {author}
        </p>

        {/* Read button */}
        <button
          className="mt-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md font-semibold text-sm hover:from-blue-600 hover:to-indigo-700 transition-all shadow"
          onClick={handleRead}
        >
          Read
        </button>
      </div>
    </div>
  );
};

ProgressBook.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  image: PropTypes.string,
  fileName: PropTypes.string,
  onRead: PropTypes.func,
};

// ---- Books Grid with Navbar ----
const YourBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

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

  const handleRead = (fileName) => {
    console.log("Reading:", fileName);
  };

  const handleBackClick = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-[#16213e] text-white shadow-lg">
        <div className="container mx-auto px-4 py-2.5 flex items-center">
          <button onClick={handleBackClick} className="p-2 rounded-full">
            <HiArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold ml-4 md:text-center md:mx-auto">
           Uploaded Books
          </h1>
        </div>
      </nav>

      {/* Books Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
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
              fileName={book.fileName}
              onRead={handleRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default YourBooks;
