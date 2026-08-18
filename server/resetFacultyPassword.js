require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const resetPassword = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash(
            "Faculty@123",
            10
        );

        const user = await User.findOneAndUpdate(
            { email: "faculty@example.com" },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log("Faculty user not found");
            return;
        }

        console.log("Password reset successfully!");
        console.log("Email:", user.email);
        console.log("New password: Faculty@123");

    } catch (error) {

        console.error(error);

    } finally {

        await mongoose.disconnect();

    }
};

resetPassword();    