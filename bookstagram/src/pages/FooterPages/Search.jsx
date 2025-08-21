import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;
    setRecentSearches((prev) => [
      search,
      ...prev.filter((item) => item !== search).slice(0, 4),
    ]);
    setSearch("");
  };

  const handleRemove = (item) => {
    setRecentSearches((prev) => prev.filter((search) => search !== item));
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="sticky top-0 z-30 w-full bg-[#16213e] shadow-sm">
        <div className="max-w-md mx-auto flex items-center px-4 py-2.5">
          <button
            onClick={handleBack}
            className="text-white hover:bg-gray-100 rounded-full p-2 mr-2"
            title="Back to Home"
          >
            <IoArrowBack className=" text-2xl" />
          </button>

          <form onSubmit={handleSearch} className="flex-grow relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiSearch size={20} />
            </span>
            <input
              type="text"
              placeholder="Search books, authors, or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              autoFocus
            />
          </form>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {recentSearches.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Searches
              </h2>
              <button
                onClick={() => setRecentSearches([])}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
            <ul className="space-y-2">
              {recentSearches.map((item) => (
                <li
                  key={item}
                  className="flex justify-between items-center hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <span className="text-gray-700">{item}</span>
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch size={24} className="text-[#16213e]" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No recent searches
            </h3>
            <p className="text-gray-500">
              Search for books, authors, or categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
