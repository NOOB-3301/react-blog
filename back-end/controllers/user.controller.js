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
    const { username, email, password, name, location, picture, dob } = req.body;
    console.log(req.body);

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

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // User creation with additional fields
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      location,
      picture,
      dob
    });

    await user.save();

    // Token generation
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    res.status(201).json({
      message: `User ${username} registered successfully.`,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        location: user.location,
        picture: user.picture,
        dob: user.dob,
        accountCreated: user.accountCreated,
        articlesPublished: user.articlesPublished
      }
    });

    console.log(`User ${username} registered successfully.`);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "An error occurred while registering the user." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { credential, password } = req.body;

    // Input validation
    if (!credential || !password) {
      console.error("Missing required fields: credential or password");
      return res.status(400).json({ error: "Both credential (email/username) and password are required" });
    }

    // Determine if credential is email or username
    const isEmail = credential.includes('@');
    
    // Fetch user from database based on either email or username
    const user = await User.findOne(
      isEmail ? { email: credential } : { username: credential }
    );

    if (!user) {
      console.error(`Login failed for credential: ${credential}. User not found.`);
      return res.status(404).json({ 
        error: `No user found with this ${isEmail ? 'email' : 'username'}` 
      });
    }

    // Password validation
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error(`Login failed for user: ${user.username}. Invalid password.`);
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    // Send successful response with token and user data
    res.json({ 
      token,
      username: user.username,
      email: user.email,
      name: user.name || '',
      picture: user.picture || '',
      location: user.location || ''
    });

    console.log(`User ${user.username} logged in successfully`);

  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ 
      error: "An error occurred during login. Please try again later." 
    });
  }
};
const getProfile = async (req, res) => {
  try {
    console.log("getProfile called");

    // Get the token from the authorization header
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

    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error(`User not found for token with userId: ${decoded.userId}.`);
      return res.status(404).json({ error: "User not found." });
    }

    // Send back detailed user profile data
    res.json({
      user
    });

    console.log(`Profile fetched successfully for user ${user.username}.`);
  } catch (error) {
    console.error("Error during profile retrieval:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    res.status(500).json({ error: "An error occurred while fetching the profile." });
  }
};


const editProfile = async (req, res) => {
  try {
    console.log("editProfile called");

    // Get the token from the authorization header
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

    let decoded;
    try {
      // Verify and decode the token
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      console.error("Error decoding token:", err.message);
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const userId = decoded.userId;

    // Extract fields to be updated from request body
    const { name, location, picture, dob, currentPassword, newPassword } = req.body;

    if (!name && !location && !picture && !dob && !currentPassword && !newPassword) {
      console.error("No fields provided for update.");
      return res.status(400).json({ error: "No fields to update." });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return res.status(404).json({ error: "User not found." });
    }

    // Handle password change
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        console.error("Both current and new passwords are required.");
        return res.status(400).json({ error: "Both current and new passwords are required to change the password." });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        console.error("Current password is incorrect.");
        return res.status(401).json({ error: "Current password is incorrect." });
      }

      if (newPassword.length < 8) {
        console.error("New password must be at least 8 characters long.");
        return res.status(400).json({ error: "New password must be at least 8 characters long." });
      }

      // Hash and update the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Update other fields if provided
    if (name) user.name = name;
    if (location) user.location = location;
    if (picture) user.picture = picture;
    if (dob) user.dob = dob;

    // Save the updated user
    await user.save();

    res.json({
      message: "Profile updated successfully.",
      user
    });

    console.log(`Profile updated successfully for user ${user.username}.`);
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ error: "An error occurred while updating the profile." });
  }
};

export { getProfile, registerUser, loginUser, editProfile };