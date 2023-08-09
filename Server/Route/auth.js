var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../src/Database/SchemaModel/signupSchema");
const ProfileDetails = require("../src/Database/SchemaModel/profileDetailsSchema");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    console.log('object')
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user object
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    console.log(newUser);
    const proDetails = new ProfileDetails({
      nickName: "Your initial nickname",
      details: "Your initial details",
      UID: newUser._id,
      followers: [],
      followersCount: 0,
      following: [],
      followingCount: 0,
      posts: [],
      phone: "Your initial phone",
    });
    await proDetails.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    // Find the user by email
    var user = await User.findOne({ email: req.body.email });

    // If user does not exist, return an error
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // If passwords do not match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Store user information in session
    req.session.user = {
      id: user._id.toString(), // Convert mongoose ObjectId to string
      name: user.name,
      email: user.email,
    };

    // If the email and password are valid, return a success message
    res.status(200).json({ message: "Login successful" + req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('sessionId'); // Clear the session cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
