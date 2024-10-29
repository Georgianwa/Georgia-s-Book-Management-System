const Book = require("../models/bookModel");

exports.addBook = async (req, res) => {
    try{
        const { title, author, genre, publish_date, description, rating } = req.body;
        const book = new Book({ title, author, genre, publish_date, description, rating, owner: req.user.id });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: "Internal server error occured"});
    }
};


exports.getBooks = async (req, res) => {
    try {
        const { search, author, genre, rating } = req.query;
        const filter = { owner: req.user.id };

        if (search) {
            filter.$or = [
                {title: { $regex: search, $options: "i" } },
                {author: { $regex: search, $options: "i" } }
            ];
        }

        if (author) filter.author = author;
        if (genre) filter.genre = genre;
        if (rating) filter.rating = rating;
        const books = await Book.find(filter);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.getBookbyId = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, owner: req.user.id });
        if(!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id }, 
            req.body, 
            { new: true }
        );
        if(!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ err: "Internal server error" });
    }
};


exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if(!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json({ message: "book deletion successful" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
