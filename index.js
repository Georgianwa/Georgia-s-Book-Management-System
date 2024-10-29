const express = require("express");
const connectDB = require("./config/dbConfig")
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
connectDB();


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs", {title: "Home Page"});
});

app.get("/test", (req, res) => {
    res.send("Testing the routes");
});
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);




module.exports = app;