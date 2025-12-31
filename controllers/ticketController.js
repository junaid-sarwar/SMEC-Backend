// controllers/ticketController.js
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const Discount = require('../models/Discount');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const buyTicket = async (req, res) => {
  try {
    const { eventId, discountCode, teamMembers } = req.body;
    const userId = req.userId; 

    // 1. Parallel Database Checks (Faster than sequential)
    const [event, user] = await Promise.all([
        Event.findById(eventId),
        User.findById(userId)
    ]);

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.soldTickets >= event.totalTickets) {
      return res.status(400).json({ message: "Housefull! Sold Out." });
    }

    if (event.teamSize > 1) {
        if (!teamMembers || teamMembers.length === 0) {
            return res.status(400).json({ message: `This is a team event. Please add details for ${event.teamSize} members.` });
        }
    }

    // Calculate Price
    let finalPrice = event.price;
    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode, isActive: true });
      if (discount) {
        finalPrice = finalPrice - (finalPrice * (discount.percentage / 100));
      } else {
        return res.status(400).json({ message: "Invalid Discount Code" });
      }
    }

    const uniqueId = `SMEC-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create Ticket
    const ticket = await Ticket.create({
      user: userId,
      event: eventId,
      pricePaid: finalPrice,
      discountCode,
      serialNumber: uniqueId,
      teamMembers: teamMembers || []
    });

    // Update Event
    event.soldTickets += 1;
    await event.save();

    // =======================================================
    // 🚀 OPTIMIZATION: FIRE AND FORGET EMAIL LOGIC
    // Remove 'await' so the user gets a response immediately.
    // =======================================================
    
    const adminEmail = "team.smec2026@gmail.com"; 
    
    let membersHtml = '';
    if (teamMembers && teamMembers.length > 0) {
        membersHtml = `\nTeam Members:\n${teamMembers.map(m => `- ${m.fullName} (${m.universityName || 'N/A'})`).join('\n')}`;
    }

    const emailBody = `
      Hello ${user.fullName}, 
      
      Your Pass is Confirmed! 
      Event: ${event.title}
      Ticket ID: ${uniqueId}
      Time: ${event.time}
      Location: ${event.location}
      Price Paid: PKR ${finalPrice}
      ${membersHtml}

      Best of luck!
      Team SMEC
    `;

    const adminBody = `New Ticket Sold - ${event.title}\nUser: ${user.fullName}\nRevenue: ${finalPrice}`;

    // Send emails in background without holding up the request
    Promise.all([
        sendEmail(user.email, `Ticket Confirmation: ${uniqueId}`, emailBody),
        sendEmail(adminEmail, `New Sale: ${event.title}`, adminBody)
    ]).catch(err => console.error("Email sending failed (Background):", err));

    // Send Response Immediately
    res.status(200).json({ success: true, message: "Ticket Purchased!", ticket });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createDiscount = async (req, res) => {
    try {
        const { code, percentage, isActive } = req.body;
        const discount = await Discount.create({ code, percentage,isActive });
        res.status(201).json({success: true, discount});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
// [NEW] Get All Discounts
const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, discounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// [NEW] Toggle Discount Status
const toggleDiscountStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findById(id);
        if (!discount) return res.status(404).json({ message: "Not found" });

        discount.isActive = !discount.isActive; // Toggle
        await discount.save();
        
        res.status(200).json({ success: true, discount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE DISCOUNT CODE
const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        await Discount.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.userId })
            .populate('event') // Get Event details (Title, Time, etc.)
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, tickets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        // Run database queries in parallel for speed
        const [revenueAgg, totalTicketsSold, totalEvents, lowStockEvents] = await Promise.all([
            // 1. Revenue
            Ticket.aggregate([{ $group: { _id: null, total: { $sum: "$pricePaid" } } }]),
            // 2. Tickets Sold
            Ticket.countDocuments(),
            // 3. Events Count
            Event.countDocuments(),
            // 4. Low Stock (Using DB Query instead of JS Filter is faster)
            Event.find({ $expr: { $lt: [{ $subtract: ["$totalTickets", "$soldTickets"] }, 5] } })
        ]);

        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        res.status(200).json({ 
            success: true, 
            stats: {
                totalRevenue,
                totalTicketsSold,
                totalEvents,
                lowStockEvents
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { buyTicket, createDiscount,getAllDiscounts,toggleDiscountStatus, deleteDiscount, getMyTickets,getAdminStats };