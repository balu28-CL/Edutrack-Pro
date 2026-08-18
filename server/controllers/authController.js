const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

// Register User
const registerUser = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage
};

res.status(201).json({
    message: "User Registered Successfully",
    user: userResponse
});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Login User
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }
        
const token = jwt.sign(
    {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

        const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage
};

res.status(200).json({
    message: "Login Successful",
    token,
    user: userResponse
});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get Logged-in User Profile
const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let profile = null;

        // STUDENT PROFILE
        if (user.role === "student") {

            profile = await Student.findOne({
                user: user._id
            });
        }

        // FACULTY PROFILE
        if (user.role === "faculty") {

            profile = await Faculty.findOne({
                user: user._id
            });
        }

        res.status(200).json({
            user,
            profile
        });

    } catch (error) {

        console.log("GET PROFILE ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};