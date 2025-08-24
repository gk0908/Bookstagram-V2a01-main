const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Increase the payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookstagram', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import Book model from models/Book.js
const Book = require('./models/Book');

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload-files', async (req, res) => {
  const { title, author, description, genre, rating, coverImage, pdfData, fileName, fileSize, userId } = req.body;

  // Save PDF to disk
  const base64String = pdfData.replace(/^data:application\/pdf;base64,/, "");
  const pdfBuffer = Buffer.from(base64String, 'base64');
  const pdfPath = path.join(__dirname, 'uploads', fileName);

  try {
    fs.writeFileSync(pdfPath, pdfBuffer);

    const book = new Book({
      title,
      author,
      description,
      genre,
      // rating: parseInt(rating),
      coverImage: coverImage || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      fileName,
      fileSize,
      pdfPath, // Save path instead of pdfData
      userId, 
    });

    await book.save();
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).send('Error saving book');
  }
});

app.get('/get-files', async (req, res) => {
  try {
    const books = await Book.find();
    res.json( books );
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});

app.get('/files/:fileName', async (req, res) => {
  try {
    const book = await Book.findOne({ fileName: req.params.fileName });
    if (!book || !book.pdfPath) {
      return res.status(404).send('PDF not found');
    }
    const pdfPath = book.pdfPath;
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).send('PDF file not found on disk');
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${book.fileName}"`,
    });
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).send('Error serving PDF');
  }
});

const booksRouter = require('./routes/books');
app.use('/api/books', booksRouter);

// Return all books for the library page
app.get('/api/library', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching library books:', error);
    res.status(500).send('Error fetching library books');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});