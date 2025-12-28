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
    // teamSize body se nikaal rahe hain (Default 1 agar na ho)
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      price,
      totalTickets,
      teamSize,
    } = req.body;

    const image = req.file ? req.file.path : null;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      price,
      totalTickets,
      image,
      teamSize: teamSize || 1,
    });

    res.status(201).json({ success: true, message: "Event Created!", event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
