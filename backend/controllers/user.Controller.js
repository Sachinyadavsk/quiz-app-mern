import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const TOKEN_SECRET = process.env.TOKEN_SECRET
const TOKEN_EXPIRES_IN = '24h';
const JWT_SECRET = "your_jwt_secret_key";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (name.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 3 characters long"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }
        const emailExists = await User.findOne({ email }).lean();
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }
        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(500).json({
                success: false,
                message: "Error in password hashing"
            });
        }
        const user = new User({
            _id: newId,
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");
        const token = jwt.sign(
            { id: newId.toString() }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN }
        );
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");
        const token = jwt.sign(
            { id: user._id.toString() }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN }
        );
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        });



    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
