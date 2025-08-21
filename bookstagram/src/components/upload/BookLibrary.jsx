import React, { useState, useEffect } from 'react';
import { Book, Plus, Search, Filter, Trash2, BookOpen, Star, FileText, Bookmark } from 'lucide-react';
import { getBooks, deleteBook } from '../utils/localStorage';

const BookCard = ({ book, onRead, onDelete }) => {
  const progressPercentage = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg';
          }}
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          {book.genre}
        </div>
        {progressPercentage === 100 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Completed
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
          <FileText className="w-3 h-3" />
          <span>PDF</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2" title={book.author}>
          by {book.author}
        </p>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {book.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < book.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {book.totalPages > 0 ? `${book.totalPages} pages` : 'PDF'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {book.currentPage > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Last read: Page {book.currentPage}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onRead(book)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>{book.currentPage > 1 ? 'Continue' : 'Start'} Reading</span>
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const BookLibrary = ({ onReadBook, onUploadBook }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, selectedGenre, sortBy]);

  const loadBooks = () => {
    const userBooks = getBooks();
    setBooks(userBooks);
  };

  const filterAndSortBooks = () => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'rating':
          return b.rating - a.rating;
        case 'progress':
          const progressA = a.totalPages > 0 ? a.currentPage / a.totalPages : 0;
          const progressB = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
          return progressB - progressA;
        case 'dateAdded':
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

    setFilteredBooks(filtered);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      deleteBook(bookId);
      loadBooks();
    }
  };

  const genres = [...new Set(books.map(book => book.genre))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Digital Library</h1>
                <p className="text-gray-600">Read and manage your PDF books</p>
              </div>
            </div>
            <button
              onClick={onUploadBook}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span>Upload New Book</span>
            </button>
          </div>

          {/* Stats */}
          {books.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Book className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Total Books</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{books.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {books.filter(book => book.totalPages > 0 && book.currentPage >= book.totalPages).length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-600 font-medium">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900">
                  {books.filter(book => book.currentPage > 1 && book.currentPage < book.totalPages).length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {books.length > 0 ? (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1) : '0'}
                </p>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="dateAdded">Recently Added</option>
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
                <option value="rating">Highest Rated</option>
                <option value="progress">Most Progress</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {books.length === 0 ? 'No books in your library' : 'No books match your search'}
            </h3>
            <p className="text-gray-500 mb-6">
              {books.length === 0 
                ? 'Start building your digital library by uploading your first PDF book'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {books.length === 0 && (
              <button
                onClick={onUploadBook}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Upload Your First Book</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredBooks.length} of {books.length} books
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onRead={onReadBook}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookLibrary;