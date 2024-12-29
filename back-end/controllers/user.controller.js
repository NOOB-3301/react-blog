import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';

const registerUser = async (req,res) => {
try {
    const { username, email, password } = req.body;
    if (!username || !email ||!password) {
        return res.status(400).send({error:"no username or email or password received from req.body"})
    }
    console.log(username,email,password)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user =new User({ username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, "this is secret key", { expiresIn: '1h' });
    res.json({ token });
    // return res.status(200).send({success:"user created successfully"}) 
} catch (error) {
    console.error("error while crreating user ")
    console.log(error)
}
}

const loginUser = async (req,res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, "this is secret key", { expiresIn: '1h' });
    res.json({ token });
}


const getProfile = async (req,res) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    console.log(req.headers)
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    // const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    const token = authHeader //do not need to splid as the token is only one and we need to use that token only
    try {
      const decoded = jwt.verify(token, "this is secret key");
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ username: user.username });
    } catch (error) {
      console.error('Error in /api/profile:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
}


export {getProfile, registerUser ,loginUser}