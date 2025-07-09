// Script to create the single admin user
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blog_app";

const adminData = {
  username: "admin",
  email: "admin@example.com",
  password: "admin123", // Change this after first login
  role: "admin",
};

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists.");
    } else {
      const admin = new User(adminData);
      await admin.save();
      console.log("Admin user created successfully.");
    }
    mongoose.disconnect();
  } catch (err) {
    console.error("Error creating admin user:", err);
    mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
