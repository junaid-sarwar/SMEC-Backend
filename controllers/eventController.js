// controllers/eventController.js
const Event = require("../models/Event");
const Category = require("../models/Category");

// 1. Create Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Event (Updated with teamSize)
const createEvent = async (req, res) => {
  try {
    console.log("--- ATTEMPTING TO CREATE EVENT ---");
    console.log("Body:", req.body);

    const { title, description, category, date, time, location, price, totalTickets, teamSize } = req.body;

    // 1. Enum Match Fix: Frontend se agar "Geeks (Coding)" aaye to usey "Geeks" karo
    let finalCategory = category;
    if (category === "Geeks (Coding)") finalCategory = "Geeks";

    const image = req.file ? req.file.path : null;

    // 2. Direct Create (Bina Category ID ke jhamele ke)
    const event = await Event.create({
      title,
      description,
      category: finalCategory, // Strictly String (E-Games, Geeks, or General Games)
      date,
      time,
      location,
      price: Number(price), 
      totalTickets: Number(totalTickets),
      image: image,
      teamSize: Number(teamSize) || 1,
    });

    console.log("✅ SUCCESS: Event Created in DB");
    res.status(201).json({ success: true, message: "Event Created!", event });

  } catch (error) {
    console.error("❌ BACKEND ERROR:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. Get All Events (For Buyer)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createCategory, createEvent, getAllEvents, deleteEvent };
