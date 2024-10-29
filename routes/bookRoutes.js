const express = require("express");
const bookService = require("../services/bookService");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/books", bookService.getBooks);
router.get("/books/:id", bookService.getBookbyId);
router.post("/books", bookService.addBook);
router.put("/books/:id", auth, bookService.updateBook);
router.delete("/books/:id", auth, bookService.deleteBook);

module.exports = router;
