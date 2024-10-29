const mongoose = require("mongoose");


const bookSchema = new mongoose.Schema({
    id: {type: String, unique:true},
    title: { 
        type: String,
        required: true,
        unique:true,
        min: 10,
        max: 200
    },
    author: { 
        type: String,
        required: true,
        min: 3,
        max: 120
    },
    genre:  { 
        type: String,
        required: true
    },
    publish_date: { 
        type: Date,
        required: true
    },
    description: { 
        type: String,
        required: true,
        max: 1000
    },
    rating: { 
        type: String,
        min: 1,
        max: 5
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
