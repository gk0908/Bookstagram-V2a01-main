
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
