import React, { useEffect, useState } from "react";
import bookPlaceholder from "../../assets/book.jpg";

const idOf = (book) => String(book?._id ?? book?.id ?? book?.fileName ?? "");

const YourBook = () => {
  const [books, setBooks] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favouriteBooks") || "[]").map(String);
    } catch {
      return [];
    }
  });

  useEffect(() => {
fetch("http://localhost:5000/api/library")
      .then((r) => r.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]));
  }, []);

  useEffect(() => {
    const onStorage = () => {
      try {
        setFavourites(JSON.parse(localStorage.getItem("favouriteBooks") || "[]").map(String));
      } catch {
        setFavourites([]);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("favourites-updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("favourites-updated", onStorage);
    };
  }, []);

  const removeFavourite = (bookId) => {
    const id = String(bookId);
    const updated = favourites.filter((x) => x !== id);
    setFavourites(updated);
    try {
      localStorage.setItem("favouriteBooks", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("favourites-updated", { detail: updated }));
    } catch {}
  };

  const favouriteBooks = books.filter((b) => favourites.includes(idOf(b)));

  if (favouriteBooks.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Favorites</h2>
        <p>No favorite books yet.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Favorites</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {favouriteBooks.map((book) => (
          <div
            key={idOf(book)}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <img
              src={book.coverImage || bookPlaceholder}
              alt={book.title}
              style={{ width: 56, height: 80, objectFit: "cover", borderRadius: 4 }}
              onError={(e) => (e.target.src = bookPlaceholder)}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{book.title}</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{book.author}</div>
            </div>
            <button
              onClick={() => removeFavourite(idOf(book))}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: "#ef4444",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourBook;