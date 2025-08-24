import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import bookPlaceholder from "../../assets/book.jpg";
import "./../../pages/Books/Library.css";

const Favourite = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    const favs = localStorage.getItem("favouriteBooks");
    return favs ? JSON.parse(favs) : [];
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/library")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]));
  }, []);

  const favouriteBooks = books.filter((book) => favourites.includes(book._id));

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
      <div className="library-grid" style={{ padding: "2rem" }}>
        {favouriteBooks.length === 0 ? (
          <div className="library-empty">
            <div className="empty-icon">🤍</div>
            <h3>No favourite books yet</h3>
            <p>Mark books as favourite to see them here.</p>
          </div>
        ) : (
          favouriteBooks.map((book, idx) => (
            <div className="italy-book-card" key={book._id || idx}>
              <div className="italy-book-img-wrap">
                <img
                  className="italy-book-img"
                  src={book.coverImage || bookPlaceholder}
                  alt={book.title}
                  onError={(e) => (e.target.src = bookPlaceholder)}
                />
              </div>
              <div className="italy-book-content">
                <div className="italy-book-title">{book.title}</div>
                <div className="italy-book-author">{book.author}</div>
                <div className="italy-book-meta">
                  <span className="italy-book-genre">{book.genre}</span>
                  <span
                    className="italy-book-fav favourited"
                    title="Favourite"
                  >
                    ❤️
                  </span>
                </div>
                <button
                  className="italy-read-btn"
                  onClick={() =>
                    navigate(`/pdf/${encodeURIComponent(book.fileName)}`)
                  }
                >
                  Read
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favourite;
