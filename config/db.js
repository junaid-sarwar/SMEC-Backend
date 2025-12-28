// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require("bcryptjs");
const cronJobs = require('../cron/cronJobs')

dotenv.config();

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        .then(()=>{
            console.log("✅ MongoDB connected Successfully");
            createAdminByDefault();
            cronJobs();
        })
    } catch (error) {
        console.log("MONGO NOT CONNECTED",error)
    }
}

async function createAdminByDefault() {
  const User = require("../models/User.js");

  try {
    const adminExist = await User.findOne({ role: "admin" });

    if (!adminExist) {
      const hashPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        fullName: "President",
        email: "admin.smec2026@gmail.com",
        password: hashPassword,
        phoneNumber: 303123456,
        role: "admin",
      });
      await admin.save();
      console.log("admin Created Successfully");
      console.log("admin Email: admin.smec2026@gmail.com");
      console.log("admin Password: admin123");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;