const express = require("express");
const { createUser, loginUser, getUser, updateUser, deleteUser } = require("../services/userService");
const router = express.Router();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).send("Access denied.");
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send("Token is invalid");
    }
};

module.exports = { router, auth };
