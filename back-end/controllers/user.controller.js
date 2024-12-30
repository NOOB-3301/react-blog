import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';


dotenv.config({ path: './.env' });
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  console.error("Error: SECRET_KEY is not defined in the environment variables.");
  process.exit(1);
}

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      console.error("Missing required fields: username, email, or password.");
      return res.status(400).json({ error: "All fields (username, email, password) are required." });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`User with email ${email} already exists.`);
      return res.status(409).json({ error: "Email already in use." });
    }

    // Password hashing and user creation
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Token generation
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    res.status(201).json({ token });
    console.log(`User ${username} registered successfully.`);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "An error occurred while registering the user." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      console.error("Missing required fields: username or password.");
      return res.status(400).json({ error: "Both username and password are required." });
    }

    // Fetch user from database
    const user = await User.findOne({ username });
    if (!user) {
      console.error(`Login failed for username: ${username}. User not found.`);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Password validation
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error(`Login failed for username: ${username}. Incorrect password.`);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Token generation
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
    console.log(`User ${username} logged in successfully.`);
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "An error occurred while logging in the user." });
  }
};

const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error("Authorization header is missing.");
      return res.status(401).json({ error: "No token provided." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error("Bearer token is missing.");
      return res.status(401).json({ error: "Invalid token format." });
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error(`User not found for token with userId: ${decoded.userId}.`);
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ username: user.username });
    console.log(`Profile fetched successfully for user ${user.username}.`);
  } catch (error) {
    console.error("Error during profile retrieval:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    res.status(500).json({ error: "An error occurred while fetching the profile." });
  }
};

export { getProfile, registerUser, loginUser };
