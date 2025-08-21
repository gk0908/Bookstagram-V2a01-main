import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookPlaceholder from "../../assets/book.jpg";
import axios from "axios";

const RecentBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        // Show the 4 most recent books (you can change the number)
        const sorted = Array.isArray(res.data)
          ? [...res.data].reverse().slice(0, 4)
          : [];
        setBooks(sorted);
      })
      .catch(() => setBooks([]));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Recently Uploaded Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {books.length === 0 ? (
          <p className="col-span-full text-gray-500 text-center">No recent books.</p>
        ) : (
          books.map((book) => (
            <div
              key={book._id}
              className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 shadow hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/pdf/${encodeURIComponent(book.fileName)}`)}
            >
              <img
                src={book.coverImage || bookPlaceholder}
                alt={book.title}
                className="w-24 h-36 object-cover rounded mb-3 shadow"
                onError={(e) => (e.target.src = bookPlaceholder)}
              />
              <h3 className="font-semibold text-lg text-center truncate w-full">{book.title}</h3>
              <p className="text-gray-500 text-sm text-center truncate w-full">{book.author}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBooks;