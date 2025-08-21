const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  genre: String,
  rating: Number,
  coverImage: String,
  fileName: String,
  fileSize: Number,
  pdfPath: String, // path to PDF on disk
  // Add userId if you want to associate books with users
});

module.exports = mongoose.model('Book', bookSchema);