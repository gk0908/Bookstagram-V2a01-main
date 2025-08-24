import React, { useState } from 'react';
import { Upload, Book, User, FileText, Star, Image, Hash, File } from 'lucide-react';
import { saveBook } from './localStorage';
import { createBook } from './book';
import axios from 'axios';

const BookUpload = ({ onBookUploaded, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    rating: 5,
    coverImage: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      if (errors.pdfFile) {
        setErrors(prev => ({
          ...prev,
          pdfFile: ''
        }));
      }
    } else {
      setPdfFile(null);
      setErrors(prev => ({
        ...prev,
        pdfFile: 'Please select a valid PDF file'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    if (!pdfFile) newErrors.pdfFile = 'PDF file is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUploading(true);
    
    try {
      // Convert PDF to base64 for storage
      const pdfBase64 = await convertFileToBase64(pdfFile);
      
      // Create book object
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        genre: formData.genre.trim(),
        rating: parseInt(formData.rating),
        coverImage: formData.coverImage.trim() || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        pdfData: pdfBase64,
        fileName: pdfFile.name,
        fileSize: pdfFile.size,
        uploadedAt: Date.now(),
        userId: localStorage.getItem("userId"), // <-- Add this line
      };
      
      await axios.post("http://localhost:5000/upload-files", book);
      
      const book = createBook(bookData);
      
      // Save to localStorage
      saveBook(book);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        description: '',
        genre: '',
        rating: 5,
        coverImage: ''
      });
      setPdfFile(null);
      
      // Notify parent component
      if (onBookUploaded) {
        onBookUploaded(book);
      }
      
      alert('Book uploaded successfully!');
      
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Error uploading book. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Upload New Book</h1>
                  <p className="text-blue-100">Add a PDF book to your digital library</p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* PDF File Upload */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <File className="w-4 h-4 mr-2 text-blue-600" />
                    PDF File *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    errors.pdfFile ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                  }`}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <File className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      {pdfFile ? (
                        <div>
                          <p className="text-green-600 font-medium">{pdfFile.name}</p>
                          <p className="text-gray-500 text-sm">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600">Click to upload PDF file</p>
                          <p className="text-gray-400 text-sm">or drag and drop</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.pdfFile && <p className="text-red-500 text-sm mt-1">{errors.pdfFile}</p>}
                </div>

                {/* Title */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Book className="w-4 h-4 mr-2 text-blue-600" />
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter book title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Author */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter author name"
                  />
                  {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                </div>

                {/* Genre */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-2 text-blue-600" />
                    Genre *
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.genre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Technical">Technical</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter book description or summary"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Rating */}
                {/* <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Star className="w-4 h-4 mr-2 text-blue-600" />
                    Rating (1-5)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      name="rating"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">{formData.rating}/5</span>
                    </div>
                  </div>
                  {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                </div> */}

                {/* Cover Image URL */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Image className="w-4 h-4 mr-2 text-blue-600" />
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://example.com/book-cover.jpg"
                  />
                  <p className="text-gray-500 text-xs mt-1">Leave empty to use default cover</p>
                </div>

                {/* Upload Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Upload Information</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• PDF files only are supported</li>
                    <li>• Maximum file size: 50MB</li>
                    <li>• Books are stored locally in your device</li>
                    {/* <li>• Reading progress is automatically tracked</li> */}
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isUploading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Book</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookUpload;