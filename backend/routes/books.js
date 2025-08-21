const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET all books (you can filter by userId if needed)
router.get("/", async (req, res) => {
  try {
    // If you want to filter by user, use: const userId = req.user.id;
    // const books = await Book.find({ userId });
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error fetching books");
  }
});

module.exports = router;