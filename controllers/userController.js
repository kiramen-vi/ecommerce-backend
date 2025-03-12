const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// ✅ Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("🔹 Registering user:", email);

    // ✅ Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create new user (no manual hashing, handled by `pre("save")`)
    const user = await User.create({
      name,
      email,
      password, // Save as plain text, hashing will be done automatically
    });

    if (user) {
      console.log("✅ User registered successfully:", user.email);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log("❌ User creation failed");
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("❌ Error in Register:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔹 Logging in user:", email);

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);

    // ✅ Compare hashed password using the `matchPassword` method
    const isMatch = await user.matchPassword(password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Error in Login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export both functions
module.exports = { registerUser, loginUser };
