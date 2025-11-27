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

  if (!selectedBook) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={selectedBook.image}
          alt={selectedBook.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{selectedBook.title}</h2>
        <p className="text-gray-700 mb-2">{selectedBook.author}</p>
        <p className="text-gray-600 mb-4">
          {showFullDescription
            ? selectedBook.description
            : selectedBook.description?.slice(0, 120)}
          {selectedBook.description &&
            selectedBook.description.length > 120 && (
              <button
                className="text-blue-500 ml-2"
                onClick={() => setShowFullDescription((v) => !v)}
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            )}
        </p>
        {selectedBook.readUrl && (
          <a
            href={selectedBook.readUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white text-center py-2 rounded font-bold"
          >
            Read Book
          </a>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
