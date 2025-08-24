const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET /api/books?userId=123
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    let books;
    if (userId) {
      books = await Book.find({ userId });
    } else {
      books = await Book.find();
    }
    res.json(books);
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

module.exports = router;