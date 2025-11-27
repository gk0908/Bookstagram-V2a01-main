import React, { useEffect, useState, useRef } from "react";
import bookPlaceholder from "../../assets/book.jpg";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Library.css";

import { useNavigate } from "react-router-dom";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    const favs = localStorage.getItem("favouriteBooks");
    try {
      return favs ? JSON.parse(favs).map((id) => id?.toString?.() ?? String(id)) : [];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBook, setActiveBook] = useState(null);
  const [isDistracted, setIsDistracted] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [distractionCountdown, setDistractionCountdown] = useState(30);
  // NEW: track whether eye-tracking successfully started
  const [eyeTrackingAvailable, setEyeTrackingAvailable] = useState(true);
  const wgInstance = useRef(null);
  const distractionTimer = useRef(null);
  const countdownInterval = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/library")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]));
  }, []);

  const toggleFavourite = (bookId) => {
    const idStr = (bookId ?? "").toString();
    let updatedFavourites = favourites.includes(idStr)
      ? favourites.filter((id) => id !== idStr)
      : [...favourites, idStr];
    setFavourites(updatedFavourites);
    try {
      localStorage.setItem("favouriteBooks", JSON.stringify(updatedFavourites));
    } catch (e) {
      console.warn("Failed to save favourites:", e);
    }
  };

  // Eye tracking when reading PDF (replaces previous effect)
  useEffect(() => {
    if (!showPDF || !activeBook) return;

    let mounted = true;

    // Wait for the external script to attach window.webgazer
    const waitForWebgazer = (timeout = 7000) =>
      new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          if (window && window.webgazer) return resolve(window.webgazer);
          if (Date.now() - start > timeout) return resolve(null);
          setTimeout(check, 100);
        };
        check();
      });

    (async () => {
      const wg = await waitForWebgazer(7000);
      if (!mounted) return;
      if (!wg) {
        console.warn("webgazer script not found or not loaded in time.");
        setEyeTrackingAvailable(false);
        return;
      }

      wgInstance.current = wg;

      try {
        wg.setRegression("ridge").setGazeListener((data) => {
          if (!data) {
            handleDistraction();
            return;
          }

          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          if (
            data.x >= 0 &&
            data.y >= 0 &&
            data.x <= windowWidth &&
            data.y <= windowHeight
          ) {
            resetDistraction();
          } else {
            handleDistraction();
          }
        });

        // Await begin() so we can catch model/camera errors (prevents uncaught promise)
        await wg.begin();
        console.info("webgazer started");
        setEyeTrackingAvailable(true);
      } catch (err) {
        // model load (403) or camera permission error
        console.warn("webgazer failed to start (model/camera):", err);
        setEyeTrackingAvailable(false);
        try { wg.end(); } catch (e) {}
      }
    })();

    return () => {
      mounted = false;
      try { (wgInstance.current || window.webgazer || {}).end(); } catch (e) {}
      clearInterval(countdownInterval.current);
      clearTimeout(distractionTimer.current);
    };
  }, [showPDF, activeBook]);

  const handleDistraction = () => {
    if (!distractionTimer.current) {
      setIsDistracted(true);
      setDistractionCountdown(30);
      
      // Start countdown
      countdownInterval.current = setInterval(() => {
        setDistractionCountdown((prev) => {
          if (prev <= 1) {
            // Time's up - close PDF
            clearInterval(countdownInterval.current);
            handleClosePDF();
            alert("PDF closed due to prolonged distraction. Please stay focused while reading!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      distractionTimer.current = true;
    }
  };

  const resetDistraction = () => {
    if (distractionTimer.current) {
      clearInterval(countdownInterval.current);
      distractionTimer.current = null;
      setIsDistracted(false);
      setDistractionCountdown(30);
    }
  };

  const handleReadBook = (book) => {
    setActiveBook(book);
    setShowPDF(true);
    setIsDistracted(false);
  };

  const handleClosePDF = () => {
    setShowPDF(false);
    setActiveBook(null);
    setIsDistracted(false);
    setDistractionCountdown(30);
    clearInterval(countdownInterval.current);
    clearTimeout(distractionTimer.current);
    distractionTimer.current = null;
    countdownInterval.current = null;
    try { (wgInstance.current || window.webgazer || {}).end(); } catch (e) { /* ignore */ }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="library-container">
      <Sidebar />
      <div className="library-content">
        {/* Floating Reading Status Widget */}
        {showPDF && activeBook && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              padding: "12px 20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 9999,
              backdropFilter: "blur(10px)",
              borderLeft: isDistracted ? "4px solid #ff5252" : "4px solid #4caf50",
              minWidth: "180px",
              animation: isDistracted ? "pulse 2s infinite" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: isDistracted ? "#ff5252" : "#4caf50",
                  animation: "blink 1.5s infinite",
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>
                {isDistracted ? "⚠️ Distracted" : "👁️ Reading"}
              </span>
            </div>
            {isDistracted && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#666",
                  paddingTop: "8px",
                  borderTop: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: "600", color: "#ff5252", fontSize: "16px", marginBottom: "4px" }}>
                  Closing in: {distractionCountdown}s
                </div>
                <div>Focus on the screen to continue reading</div>
              </div>
            )}
          </div>
        )}

        {showPDF && activeBook ? (
          // PDF Viewer
          <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 30px",
                background: "white",
                borderBottom: "1px solid #e0e0e0",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              <button
                onClick={handleClosePDF}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f0f0f0",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ← Back to Library
              </button>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  margin: 0,
                  flex: 1,
                  textAlign: "center",
                  padding: "0 20px",
                }}
              >
                {activeBook.title}
              </h2>
              <div style={{ width: "120px" }} />
            </div>

            {/* PDF Embed */}
            <div style={{ flex: 1, width: "100%", overflow: "hidden", background: "#525659" }}>
              <iframe
                src={`/pdf/${encodeURIComponent(activeBook.fileName)}`}
                title="PDF Viewer"
                style={{ width: "100%", height: "100%", border: "none" }}
                frameBorder="0"
              />
            </div>
          </div>
        ) : (
          // Library View
          <>
            <h1 className="library-title">Library</h1>

            {/* Search Bar */}
            <div style={{ display: "flex", marginBottom: "20px" }}>
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

            {/* Book Grid */}
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
                            favourites.includes(String(book._id)) ? " favourited" : ""
                          }`}
                          title="Favorite"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleFavourite(book._id)}
                        >
                          {favourites.includes(String(book._id)) ? "❤️" : "🤍"}
                        </span>
                      </div>
                      <button
                        className="italy-read-btn"
                        onClick={() => handleReadBook(book)}
                      >
                        Read
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Add CSS animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            50% {
              box-shadow: 0 4px 20px rgba(255, 82, 82, 0.4);
            }
          }

          @keyframes blink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Library;