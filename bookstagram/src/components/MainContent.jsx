// // MainContent.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { FiChevronDown, FiHeart, FiStar } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// /**
//  * Inline SVG placeholder as data URI to avoid external DNS errors.
//  * Small gray book-like rectangle with "No Cover" text.
//  */
// const svgPlaceholderDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
//   `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='440' viewBox='0 0 300 440'>
//     <rect width='100%' height='100%' fill='%23162A3A'/>
//     <rect x='14' y='20' width='272' height='400' rx='8' fill='%23304559' />
//     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-size='20' fill='%23cbd5e1'>No Cover</text>
//   </svg>`
// )}`;

// /* ---------- BookCard ---------- */
// const BookCard = ({ book, onClick, showGenre = true }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const toggleFavorite = (e) => {
//     e.stopPropagation();
//     setIsFavorite((s) => !s);
//   };

//   const imgSrc = book.coverImage || book.image || svgPlaceholderDataUri;

//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       whileTap={{ scale: 0.98 }}
//       className="bg-[#16213e] rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl w-full h-full flex flex-col"
//       onClick={() => onClick(book)}
//     >
//       <div className="relative flex-grow flex items-center justify-center h-44 sm:h-52 w-full overflow-hidden">
//         {!imageLoaded && <div className="absolute inset-0 bg-gray-700 animate-pulse" />}
//         <img
//           src={imgSrc}
//           alt={book.title}
//           loading="lazy"
//           className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
//           onLoad={() => setImageLoaded(true)}
//           onError={(e) => { e.target.src = svgPlaceholderDataUri; setImageLoaded(true); }}
//         />
//       </div>

//       <div className="p-3 sm:p-4">
//         <div className="font-bold text-white text-sm sm:text-base line-clamp-1">{book.title}</div>
//         <div className="text-gray-300 text-xs sm:text-sm line-clamp-1 mt-1">{book.author || "Unknown"}</div>

//         <div className="flex items-center justify-between mt-2">
//           <div className="flex items-center">
//             <FiStar className="text-yellow-400 mr-1 text-sm" />
//             <span className="text-xs text-white">{book.rating ?? "-"}</span>
//             {showGenre && <span className="mx-2 text-gray-400">|</span>}
//             {showGenre && <span className="text-xs text-gray-300">{book.genre ?? "—"}</span>}
//           </div>

//           <button onClick={toggleFavorite} className="text-gray-400 hover:text-red-500 transition-colors duration-200">
//             <FiHeart className={`text-sm ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
//           </button>
//         </div>

//         <div style={{ marginTop: 8 }}>
//           {(book.fileName || book.pdfUrl) ? (
//             <button
//               className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full font-bold"
//               onClick={(e) => { e.stopPropagation(); onClick(book); }}
//             >
//               Read
//             </button>
//           ) : (
//             <div className="text-xs text-gray-400 mt-2">No PDF available</div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// /* ---------- Helper: robust localStorage PDF finder ---------- */
// function getLocalPdfFromStorage(book) {
//   if (!book) return null;

//   const candidates = new Set();
//   const add = (k) => { if (k) candidates.add(k); };

//   if (book.fileName) {
//     add(`pdf_${book.fileName}`);
//     add(`book_pdf_${book.fileName}`);
//     add(book.fileName);
//   }
//   if (book.id) { add(`pdf_${book.id}`); add(`book_pdf_${book.id}`); add(String(book.id)); }
//   if (book._id) { add(`pdf_${book._id}`); add(`book_pdf_${book._id}`); add(String(book._id)); }
//   if (book.title) {
//     const slug = book.title.replace(/\s+/g, "_").replace(/[^\w_-]/g, "").toLowerCase();
//     add(`pdf_${slug}`);
//     add(slug);
//   }
//   add('pdf_base64');
//   add('book_pdf');
//   add('library_pdf');

//   for (const k of Array.from(candidates)) {
//     if (!k) continue;
//     try {
//       const raw = localStorage.getItem(k);
//       if (!raw) continue;

//       // already data URL
//       if (typeof raw === 'string' && raw.startsWith('data:application/pdf')) {
//         console.info('[getLocalPdfFromStorage] found data URL at', k);
//         return raw;
//       }

//       // JSON-wrapped or array
//       if (typeof raw === 'string' && (raw.trim().startsWith('{') || raw.trim().startsWith('['))) {
//         try {
//           const parsed = JSON.parse(raw);
//           const candidateProps = ['data', 'base64', 'pdf', 'pdfBase64', 'pdfData'];
//           for (const p of candidateProps) {
//             if (parsed && typeof parsed[p] === 'string' && parsed[p].length > 100) {
//               const maybe = parsed[p];
//               const dataUrl = maybe.startsWith('data:') ? maybe : `data:application/pdf;base64,${maybe}`;
//               console.info('[getLocalPdfFromStorage] found JSON-wrapped base64 at', k, 'prop', p);
//               return dataUrl;
//             }
//           }
//           if (Array.isArray(parsed) && parsed.length > 100) {
//             const uint8 = new Uint8Array(parsed);
//             let binary = "";
//             for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
//             const b64 = btoa(binary);
//             console.info('[getLocalPdfFromStorage] converted array to dataURL from', k);
//             return `data:application/pdf;base64,${b64}`;
//           }
//         } catch (e) {
//           // ignore parse errors and treat as possible plain base64 below
//         }
//       }

//       // plain base64
//       if (typeof raw === 'string') {
//         const trimmed = raw.trim();
//         if (/^[A-Za-z0-9+/=\r\n]+$/.test(trimmed) && trimmed.length > 2000) {
//           console.info('[getLocalPdfFromStorage] found plain base64 at', k);
//           return `data:application/pdf;base64,${trimmed}`;
//         }
//       }
//     } catch (err) {
//       console.warn('[getLocalPdfFromStorage] error reading key', k, err);
//     }
//   }

//   return null;
// }

// /* ---------- Main component ---------- */
// const MainContent = ({ onBookSelect }) => {
//   const [libraryBooks, setLibraryBooks] = useState([]);
//   const [genreGroups, setGenreGroups] = useState([]);
//   const [featuredBooks, setFeaturedBooks] = useState([]);
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
//   const [showAllForGenre, setShowAllForGenre] = useState({});
//   const [isDistracted, setIsDistracted] = useState(false);
//   const [distractionCountdown, setDistractionCountdown] = useState(30);
//   const [eyeTrackingAvailable, setEyeTrackingAvailable] = useState(true);

//   const defaultLayoutPluginInstance = defaultLayoutPlugin();

//   // webgazer + timers
//   const wgInstance = useRef(null);
//   const distractionTimer = useRef(null);
//   const countdownInterval = useRef(null);

//   /* ---------- load library ---------- */
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/library");
//         const data = await res.json();
//         if (!mounted) return;
//         setLibraryBooks(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load library books", err);
//         setLibraryBooks([]);
//       }
//     })();
//     return () => { mounted = false; };
//   }, []);

//   /* ---------- group and featured ---------- */
//   useEffect(() => {
//     const map = {};
//     for (const b of libraryBooks) {
//       const genreKey = (b.genre || "Uncategorized").toString();
//       if (!map[genreKey]) map[genreKey] = [];
//       map[genreKey].push({
//         id: b._id || b.fileName || b.title,
//         title: b.title,
//         author: b.author,
//         coverImage: b.coverImage,
//         genre: genreKey,
//         rating: b.rating,
//         fileName: b.fileName,
//         pdfUrl: b.fileName ? `/files/${encodeURIComponent(b.fileName)}` : (b.pdfUrl || null),
//         featured: !!b.featured,
//         raw: b,
//       });
//     }
//     const groups = Object.keys(map).map((g) => ({ genre: g, books: map[g] }));
//     groups.sort((a, b) => a.genre.localeCompare(b.genre));
//     setGenreGroups(groups);

//     // featured (explicit or newest)
//     let featured = libraryBooks.filter(b => !!b.featured).map(b => ({
//       id: b._id || b.fileName || b.title,
//       title: b.title,
//       author: b.author,
//       coverImage: b.coverImage,
//       genre: b.genre,
//       fileName: b.fileName,
//       pdfUrl: b.fileName ? `/files/${encodeURIComponent(b.fileName)}` : (b.pdfUrl || null),
//       featured: !!b.featured,
//       raw: b,
//     }));
//     if (featured.length === 0) {
//       const sorted = [...libraryBooks].sort((a, b) => {
//         const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//         const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//         return tb - ta;
//       }).slice(0, 3);
//       featured = sorted.map(b => ({
//         id: b._id || b.fileName || b.title,
//         title: b.title,
//         author: b.author,
//         coverImage: b.coverImage,
//         genre: b.genre,
//         fileName: b.fileName,
//         pdfUrl: b.fileName ? `/files/${encodeURIComponent(b.fileName)}` : (b.pdfUrl || null),
//         featured: !!b.featured,
//         raw: b,
//       }));
//     } else {
//       featured = featured.slice(0, 3);
//     }
//     setFeaturedBooks(featured);
//   }, [libraryBooks]);

//   /* ---------- helper: set pdf source safely (revokes previous blob urls) ---------- */
//   const setPdfSource = (url) => {
//     console.info('[PDF] setting source ->', url);
//     // revoke previous object URL if we created one
//     try {
//       if (pdfBlobUrl && pdfBlobUrl.startsWith("blob:")) {
//         URL.revokeObjectURL(pdfBlobUrl);
//       }
//     } catch (e) {
//       // ignore
//     }
//     setPdfBlobUrl(url);
//     // also expose for quick debugging (optional)
//     try { window.__pdfBlobUrl = url; } catch (e) {}
//   };

//   /* ---------- attempt to fetch server path and validate content-type ---------- */
//   const fetchServerPdfToObjectUrl = async (serverPath) => {
//     try {
//       const resp = await fetch(serverPath, { method: "GET" });
//       if (!resp.ok) {
//         console.warn('[PDF] server returned non-OK for', serverPath, resp.status);
//         return null;
//       }
//       const ct = resp.headers.get('content-type') || '';
//       if (!ct.toLowerCase().includes('application/pdf')) {
//         console.warn('[PDF] server returned content-type not pdf:', ct, serverPath);
//         // still try to parse — maybe server forgot header — but proceed with blob
//       }
//       const blob = await resp.blob();
//       if (blob.size === 0) {
//         console.warn('[PDF] server returned empty body for', serverPath);
//         return null;
//       }
//       const url = URL.createObjectURL(blob);
//       return url;
//     } catch (err) {
//       console.error('[PDF] failed to fetch server PDF:', err, serverPath);
//       return null;
//     }
//   };

//   /* ---------- eye-tracking: start when modal opened and pdf ready ---------- */
//   useEffect(() => {
//     if (!selectedBook || !pdfBlobUrl) return;

//     let mounted = true;
//     const waitForWebgazer = (timeout = 7000) =>
//       new Promise((resolve) => {
//         const start = Date.now();
//         const check = () => {
//           if (window && window.webgazer) return resolve(window.webgazer);
//           if (Date.now() - start > timeout) return resolve(null);
//           setTimeout(check, 100);
//         };
//         check();
//       });

//     (async () => {
//       const wg = await waitForWebgazer(7000);
//       if (!mounted) return;
//       if (!wg) {
//         console.warn("webgazer not found. Eye-tracking disabled.");
//         setEyeTrackingAvailable(false);
//         return;
//       }
//       wgInstance.current = wg;
//       try {
//         wg.setRegression("ridge").setGazeListener((data) => {
//           if (!data) {
//             triggerDistraction();
//             return;
//           }
//           const ww = window.innerWidth;
//           const wh = window.innerHeight;
//           if (data.x >= 0 && data.y >= 0 && data.x <= ww && data.y <= wh) {
//             resetDistraction();
//           } else {
//             triggerDistraction();
//           }
//         });
//         await wg.begin();
//         console.info("webgazer started (MainContent)");
//         setEyeTrackingAvailable(true);
//       } catch (err) {
//         console.warn("webgazer failed to start (model/camera):", err);
//         setEyeTrackingAvailable(false);
//         try { wg.end(); } catch (e) {}
//       }
//     })();

//     return () => {
//       mounted = false;
//       try { (wgInstance.current || window.webgazer || {}).end(); } catch (e) {}
//       clearInterval(countdownInterval.current);
//       clearTimeout(distractionTimer.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedBook, pdfBlobUrl]);

//   const triggerDistraction = () => {
//     if (!distractionTimer.current) {
//       setIsDistracted(true);
//       setDistractionCountdown(30);

//       countdownInterval.current = setInterval(() => {
//         setDistractionCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(countdownInterval.current);
//             // close viewer
//             handleCloseModal();
//             alert("PDF closed due to prolonged distraction. Please focus on the screen to continue reading.");
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       distractionTimer.current = true;
//     }
//   };

//   const resetDistraction = () => {
//     if (distractionTimer.current) {
//       clearInterval(countdownInterval.current);
//       distractionTimer.current = null;
//       setIsDistracted(false);
//       setDistractionCountdown(30);
//     }
//   };

//   /* ---------- handle book click: try localStorage -> server -> remote ---------- */
//   const handleBookClick = async (book) => {
//     const normalized = {
//       id: book.id || book._id || book.fileName || book.title,
//       title: book.title,
//       author: book.author,
//       coverImage: book.coverImage,
//       genre: book.genre,
//       rating: book.rating,
//       fileName: book.fileName,
//       pdfUrl: book.pdfUrl || (book.fileName ? `/files/${encodeURIComponent(book.fileName)}` : null),
//       featured: !!book.featured,
//       raw: book.raw || book,
//     };

//     setSelectedBook(normalized);

//     // 1) Try localStorage data first (fast & offline)
//     try {
//       let found = getLocalPdfFromStorage(normalized.raw || normalized);
//       if (found) {
//         // ensure prefix for plain base64 (getLocal already handles many cases)
//         if (!found.startsWith('data:application/pdf')) {
//           if (found.startsWith('data:')) {
//             console.warn('[PDF] data URL is present but not application/pdf:', found.slice(0, 80));
//           } else {
//             // if it looks like base64, prefix it
//             const trimmed = found.trim();
//             if (/^[A-Za-z0-9+/=\r\n]+$/.test(trimmed) && trimmed.length > 1000) {
//               found = `data:application/pdf;base64,${trimmed}`;
//             } else {
//               console.warn('[PDF] local data found but not recognized as PDF, falling back to server');
//               found = null;
//             }
//           }
//         }

//         if (found) {
//           try {
//             const resp = await fetch(found);
//             const blob = await resp.blob();
//             if (!blob || blob.size === 0) {
//               console.warn('[PDF] local data produced empty blob, fallback to server');
//             } else {
//               const url = URL.createObjectURL(blob);
//               setPdfSource(url);
//               console.info('[PDF] opened from localStorage');
//               return;
//             }
//           } catch (err) {
//             console.warn('[PDF] failed to convert local data to blob:', err);
//           }
//         }
//       }
//     } catch (err) {
//       console.warn('[PDF] error while checking local storage:', err);
//     }

//     // 2) Try server path (if fileName present)
//     if (normalized.fileName) {
//       const serverPath = `/files/${encodeURIComponent(normalized.fileName)}`;
//       const url = await fetchServerPdfToObjectUrl(serverPath);
//       if (url) {
//         setPdfSource(url);
//         console.info('[PDF] opened from server path', serverPath);
//         return;
//       }
//       console.warn('[PDF] server path failed, falling back to pdfUrl if any');
//     }

//     // 3) Try pdfUrl (remote)
//     if (normalized.pdfUrl) {
//       // attempt fetch to create object URL (CORS might block)
//       try {
//         const url = await fetchServerPdfToObjectUrl(normalized.pdfUrl);
//         if (url) {
//           setPdfSource(url);
//           console.info('[PDF] opened from remote pdfUrl');
//           return;
//         } else {
//           // last resort: give Viewer the remote URL directly (may fail due to CORS)
//           setPdfSource(normalized.pdfUrl);
//           console.info('[PDF] passed remote URL directly to viewer (CORS might block)');
//           return;
//         }
//       } catch (err) {
//         console.warn('[PDF] remote pdfUrl failed', err);
//       }
//     }

//     // 4) nothing found
//     setPdfSource(null);
//     console.error('[PDF] no PDF found for book', normalized);
//   };

//   /* ---------- close modal & cleanup ---------- */
//   const handleCloseModal = () => {
//     try {
//       if (pdfBlobUrl && pdfBlobUrl.startsWith("blob:")) URL.revokeObjectURL(pdfBlobUrl);
//     } catch (e) {}
//     setPdfSource(null);
//     setSelectedBook(null);
//     setIsDistracted(false);
//     setDistractionCountdown(30);
//     clearInterval(countdownInterval.current);
//     clearTimeout(distractionTimer.current);
//     distractionTimer.current = null;
//     countdownInterval.current = null;
//     try { (wgInstance.current || window.webgazer || {}).end(); } catch (e) {}
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:w-3/4">
//       {/* Featured */}
//       {featuredBooks.length > 0 && (
//         <section className="mb-8">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-2xl sm:text-3xl font-bold">Featured</h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//             {featuredBooks.map((book) => (
//               <BookCard key={book.id} book={book} onClick={handleBookClick} showGenre={false} />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Genre sections */}
//       {genreGroups.map((group) => {
//         const booksToShow = showAllForGenre[group.genre] ? group.books : group.books.slice(0, 4);
//         return (
//           <section key={group.genre} className="mb-6 sm:mb-8">
//             <div className="flex justify-between items-center mb-3 sm:mb-4">
//               <h3 className="text-xl sm:text-2xl font-semibold">{group.genre}</h3>
//               <button
//                 className="text-green-600 text-xs sm:text-sm flex font-semibold items-center"
//                 onClick={() => setShowAllForGenre(s => ({ ...s, [group.genre]: !s[group.genre] }))}
//               >
//                 {showAllForGenre[group.genre] ? "See Less" : "See All"}
//                 <FiChevronDown className={`ml-1 transition-transform ${showAllForGenre[group.genre] ? "rotate-180" : ""}`} />
//               </button>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
//               {booksToShow.map(book => (
//                 <BookCard key={book.id} book={book} onClick={handleBookClick} />
//               ))}
//               {booksToShow.length === 0 && <div className="text-gray-500">No books in this genre.</div>}
//             </div>
//           </section>
//         );
//       })}

//       {/* PDF viewer modal */}
//       {selectedBook && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[90vh] relative flex flex-col">
//             <button className="absolute top-2 right-2 text-gray-700 text-3xl font-bold z-40" onClick={handleCloseModal}>×</button>

//             {/* Floating status (eye-tracking) */}
//             {selectedBook && (
//               <div style={{ position: "absolute", left: 16, top: 16, zIndex: 60 }}>
//                 <div
//                   style={{
//                     background: "rgba(255,255,255,0.95)",
//                     padding: "8px 12px",
//                     borderRadius: 10,
//                     boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
//                     display: "flex",
//                     gap: 10,
//                     alignItems: "center",
//                     borderLeft: isDistracted ? "4px solid #ff5252" : "4px solid #4caf50",
//                   }}
//                 >
//                   <div style={{ width: 10, height: 10, borderRadius: "50%", background: isDistracted ? "#ff5252" : "#4caf50", animation: "blink 1.5s infinite" }} />
//                   <div style={{ fontWeight: 600 }}>{isDistracted ? `⚠️ Distracted` : `👁️ Reading`}</div>
//                   {isDistracted && <div style={{ marginLeft: 10, color: "#ff5252" }}>Closing in: {distractionCountdown}s</div>}
//                 </div>
//               </div>
//             )}

//             <div className="flex-1 overflow-auto">
//               <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//                 <div style={{ width: "100%", height: "100%" }}>
//                   {pdfBlobUrl ? (
//                     <Viewer fileUrl={pdfBlobUrl} plugins={[defaultLayoutPluginInstance]} />
//                   ) : (
//                     <div style={{ padding: 20 }}>
//                       <p>No PDF available or still preparing the viewer. Check console logs.</p>
//                     </div>
//                   )}
//                 </div>
//               </Worker>
//             </div>

//             <div className="p-4 border-t">
//               <h4 className="text-lg font-bold mb-1">{selectedBook.title}</h4>
//               <div className="text-sm text-gray-700">{selectedBook.author}</div>
//               <div className="text-xs text-gray-500 mt-1">Genre: {selectedBook.genre}</div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.4; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MainContent;



import React, { useState } from "react";
import { FiSearch, FiChevronDown ,FiHeart} from "react-icons/fi";
import { FiStar } from "react-icons/fi";
import { motion } from "framer-motion";


const books = [
  {
    id: 1,
    title: "Italy: Coffee Table Book for Nomads",
    author: "Jacqueline Melgren",
    image: "https://c.media-amazon.com/images/I/51X-G8wKSuL._SX342_SY445_.jpg",
    pages: 178,
    progress: 50,
    rating: 4.5,
    genre: "Travel",
    description:
      "Exploring the strange ways people think about money and teaching how to make better sense of this important topic.",
  },
  {
    id: 2,
    title: "Great Trees of India",
    author: "Ruskin BondRuskin Bond",
    image: "https://c.media-amazon.com/images/I/51JpsvCaWTL._SY445_SX342_.jpg",
    pages: 150,
    progress: 60,
    rating: 4.2,
    genre: "Nature",
    description:
      "A collection of poetry that takes you on an epic adventure through love, loss and healing.",
  },
  {
    id: 3,
    title: "Trees Of South India",
    author: "Paul Blanchflower",
    image: "https://c.media-amazon.com/images/I/61RZX8ZLGzL._SY445_SX342_.jpg",
    pages: 125,
    progress: 70,
    rating: 4.7,
    genre: "Nature",
    description:
      "A collection of poetry and prose about survival, violence, abuse, love, loss, and femininity.",
  },
  {
    id: 4,
    title: "Birds of India - A Pictorial Field Guide ",
    author: "Bikram GrewalBikram Grewal",
    image: "https://c.media-amazon.com/images/I/61p5vJUeXrL._SX342_SY445_.jpg",
    pages: 210,
    progress: 30,
    rating: 4.8,
    genre: "Wildlife",
    description:
      "Examines the nature of innovation and why it flourishes in certain environments.",
  },
  {
    id: 5,
    title: "A Photographic Guide to the Wildlife of India",
    author: "Bikram GrewalBikram Grewal",
    image: "https://c.media-amazon.com/images/I/71xUnuDN07L._SY425_.jpg",
    pages: 95,
    progress: 80,
    rating: 4.6,
    genre: "Wildlife",
    description:
      "A poetry collection exploring the depths of human emotions and relationships.",
  },
  {
    id: 6,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image: "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
    pages: 180,
    progress: 45,
    rating: 4.3,
    genre: "Nature",
    description:
      "A portrait of the Jazz Age in all of its decadence and excess.",
  },
];


const BookCard = ({
  book,
  onClick,
  showProgress = false,
  showRating = true,
  showGenre = true,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-[#16213e] rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl w-full h-full flex flex-col"
      onClick={() => onClick(book)} 
    >
      <div className="relative flex-grow flex items-center justify-center h-48 sm:h-56 w-full overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
        )}
        <img
          src={book.image}
          alt={book.title}
          loading="lazy"
          className={`w-full h-full object-fit transition-transform duration-300 hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-green-600 transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm line-clamp-1 mt-1 group-hover:text-gray-400 transition-colors duration-200">
          {book.author}
        </p>

        {(showRating || showGenre) && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              {showRating && (
                <>
                  <FiStar className="text-yellow-400 mr-1 text-sm" />
                  <span className="text-xs text-white">{book.rating}</span>
                </>
              )}
              {showRating && showGenre && (
                <span className="mx-2 text-gray-400">|</span>
              )}
              {showGenre && (
                <span className="text-xs text-gray-300">{book.genre}</span>
              )}
            </div>
            
           
            <button 
              onClick={toggleFavorite}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <FiHeart 
                className={`text-sm ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            </button>
          </div>
        )}

        {showProgress && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {book.progress}% completed
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MainContent = ({ onBookSelect }) => {
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const displayedPopularBooks = showAllPopular ? books : books.slice(0, 4);
  const displayedRecentBooks = showAllRecent
    ? books.slice().reverse()
    : books.slice(-4).reverse();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleBookClick = (book) => {
    if (onBookSelect) {
      onBookSelect(book);
    }

    
    if (window.innerWidth < 1024) {
      
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:w-3/4">
      
      <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:mb-6 lg:sm:mb-8 lg:mt-4">
       
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search books or authors"
            className="pl-10 pr-4 py-2.5 border rounded-full w-md text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

       
        <div className="flex-shrink-0">
          <span className="font-bold text-gray-800 whitespace-nowrap">
            {new Date().toUTCString().slice(0, 16)}
          </span>
        </div>
      </div>

      
      {searchQuery && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
            Search Results
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={handleBookClick}/>
            ))}
            {filteredBooks.length === 0 && (
              <p className="text-gray-500 col-span-2 sm:col-span-4">
                No books found matching your search.
              </p>
            )}
          </div>
        </div>
      )}

      
      {!searchQuery && (
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-3xl font-bold">Popular Books</h2>
            <button
              className="text-green-600 text-xs sm:text-sm flex font-semibold  items-center"
              onClick={() => setShowAllPopular(!showAllPopular)}
            >
              {showAllPopular ? "See Less" : "See All"}
              <FiChevronDown
                className={`ml-1 transition-transform ${
                  showAllPopular ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {displayedPopularBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={handleBookClick} />
            ))}
          </div>
        </div>
      )}

      
      {!searchQuery && (
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-3xl font-bold">Recent Books</h2>
            <button
              className="text-green-600 text-xs sm:text-sm font-semibold flex items-center"
              onClick={() => setShowAllRecent(!showAllRecent)}
            >
              {showAllRecent ? "See Less" : "See All"}
              <FiChevronDown
                className={`ml-1 transition-transform ${
                  showAllRecent ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {displayedRecentBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={handleBookClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
