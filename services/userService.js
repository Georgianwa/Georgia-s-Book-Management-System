const mongoose = require("mongoose");
const User = require("../models/userModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv");
const { response } = require("express");
dotenv.config();


id = 1200;

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, age, email, password } = req.body;
        if (age < 16) {
            return res.status(400).json({ message: "You must be up to 16 years of age!" });
        }
        const hashedPassword = await argon2.hash(password, 8);
        const name = `${firstName} ${lastName}`;
        

        const user = new User ({
            id: id+=1,
            firstName,
            lastName,
            name,
            username,
            age,
            email,
            password: hashedPassword
        });
        await user.save();


        const emailTemplate = path.join("../views/welcomeEmail.ejs");
        ejs.renderFile(emailTemplate, { firstName }, (err, data) => {
            if (err) {
                return res.status(500).send("Email template error");
            }
            const mailOptions = {
                from: process.env.EMAIL,
                to:email,
                subject: "Welcome to Georgia's book management system",
                html: data
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return res.status(500).send("Error sending email");
                }
                res.status(201).json({ message: "User registration successful", user: user });
            });
        });
    } catch (err) {
        res.status(500).json({ err: "Internal server error occurred" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid username or email"});

        const isMatch = await argon2.compare(password, user.password);
        if (!user) return res.status(400).json({ message: "Your password is incorrect"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "90s" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ err: "Internal server error" });
    }
};

exports.getUser = async (req, res) =>{
    try {
        const user =await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ err: "Internal server error" });
    }
};

exports.updateUser = async (req, res) =>{
    try {
        const { username, email, firstName, lastName, password } = req.body;
        const updatedFields = {};

        if (username) updatedFields.username =username;
        if (email) updatedFields.email = email;
        if (firstName) updatedFields.firstName = firstName;
        if (lastName) updatedFields.lastName = lastName;

        if (password) {
            const hashedPassword = await argon2.hash(password, 8);
            updatedFields.password = hashedPassword;
        }
        const user = await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true }).select("-password");
        if (!user) return res.staus(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ err: "Internal server error" });
    }
};


exports.deleteUser = async (req, res) =>{
    try {
        const user =await User.findByIdAndDelete(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ err: "Internal server error" });
    }
};
