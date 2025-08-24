import React, { useState, useEffect } from 'react';
import { Upload, Book, User, FileText, Image, Hash, File } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import './upload.css';
const UploadPDF = ({ onBookUploaded, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    coverImage: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [allFiles, setAllFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    // Convert PDF to base64
    const base64 = await convertFileToBase64(pdfFile);

    // Prepare book object
    const book = {
      ...formData,
      pdfData: base64,
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
      uploadedAt: Date.now(),
    };

    try {
      await axios.post("http://localhost:5000/upload-files", book);
      // Optionally fetch books again here
    } catch (e) {
      alert("Upload failed: " + e.message);
    }
    setIsUploading(false);
    setPdfFile(null);
    setFormData({ title: '', author: '', description: '', genre: '', coverImage: '' });
    if (onBookUploaded) onBookUploaded();
  };

  const fetchPdfs = async () => {
    try {
      const result = await axios.get('http://localhost:5000/get-files');
      setAllFiles(result.data.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <nav className="bg-[#16213e] text-white shadow-lg">
        <div className="container mx-auto px-4 py-2.5 flex items-center">
          <button className="p-2 rounded-full" onClick={handleBackClick}>
            <HiArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold ml-4 md:text-center md:mx-auto">Books & Documents</h1>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <File className="w-4 h-4 mr-2 text-blue-600" />
                    PDF File *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${errors.pdfFile ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter book title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter author name"
                  />
                  {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-2 text-blue-600" />
                    Genre *
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.genre ? 'border-red-500' : 'border-gray-300'}`}
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
              <div className="space-y-6">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter book description or summary"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Upload Information</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• PDF files only are supported</li>
                    <li>• Maximum file size: 50MB</li>
                    <li>• Books are stored locally in your browser</li>
                    <li>• Reading progress is automatically tracked</li>
                  </ul>
                </div>
              </div>
            </div>
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

export default UploadPDF;