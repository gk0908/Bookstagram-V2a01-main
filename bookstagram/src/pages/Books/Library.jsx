import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookPlaceholder from "../../assets/book.jpg";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Library.css";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    const favs = localStorage.getItem("favouriteBooks");
    return favs ? JSON.parse(favs) : [];
  });
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 state for search
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/library")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]));
  }, []);

  // Toggle favourite status
  const toggleFavourite = (bookId) => {
    let updatedFavourites;
    if (favourites.includes(bookId)) {
      updatedFavourites = favourites.filter((id) => id !== bookId);
    } else {
      updatedFavourites = [...favourites, bookId];
    }
    setFavourites(updatedFavourites);
    localStorage.setItem("favouriteBooks", JSON.stringify(updatedFavourites));
  };

  // 🔍 Filter books by search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="library-container">
      <Sidebar />
      <div className="library-content">
        <h1 className="library-title">Library</h1>

        {/* 🔍 Search Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search books or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        <div className="library-grid">
          {filteredBooks.length === 0 ? (
            <div className="library-empty">
              <div className="empty-icon">📚</div>
              {searchQuery ? (
                <>
                  <h3>No results found</h3>
                  <p>Try another title or author</p>
                </>
              ) : (
                <>
                  <h3>Your library is empty</h3>
                  <p>Add books to your library to get started</p>
                </>
              )}
            </div>
          ) : (
            filteredBooks.map((book, idx) => (
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
                      className={`italy-book-fav${
                        favourites.includes(book._id) ? " favourited" : ""
                      }`}
                      title="Favorite"
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleFavourite(book._id)}
                    >
                      {favourites.includes(book._id) ? "❤️" : "🤍"}
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
    </div>
  );
};

export default Library;
