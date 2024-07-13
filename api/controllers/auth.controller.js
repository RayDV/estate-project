import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Controller function for user sign-up
export const signup = async (req, res, next) => {
  // Extract username, email, and password from the request body
  const { username, email, password } = req.body;

  // Hash the password using bcryptjs
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user instance with the provided and hashed data
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json('User created successfully!');

  } catch (error) {
    // Pass any errors to the next middleware (error handler)
    next(error);
  }
};

// Controller function for user sign-in
export const signin = async (req, res, next) => {
  // Extract email and password from the request body
  const { email, password } = req.body;
  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    // Compare the provided password with the stored hashed password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    // Generate a JWT token with the user's ID
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // Destructure the user object to exclude the password from the response
    const { password: pass, ...rest } = validUser._doc;
    // Set the token as an HTTP-only cookie and respond with the user data
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Controller function for Google OAuth
export const google = async (req, res, next) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      // If user exists, generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // Destructure the user object to exclude the password from the response
      const { password: pass, ...rest } = user._doc;
      // Set the token as an HTTP-only cookie and respond with the user data
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // If user does not exist, generate a random password
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      // Hash the generated password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      // Create a new user instance with the provided and hashed data
      const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , email: req.body.email, password: hashedPassword, avatar: req.body.photo });
      // Save the new user to the database
      await newUser.save();
      // Generate a JWT token with the new user's ID
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      // Destructure the user object to exclude the password from the response
      const { password: pass, ...rest } = newUser._doc;
      // Set the token as an HTTP-only cookie and respond with the user data
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
      
    }
  } catch (error) {
    next(error)
  }
}