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

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.soldTickets >= event.totalTickets) {
      return res.status(400).json({ message: "Housefull! Sold Out." });
    }

    if (event.teamSize > 1) {
        if (!teamMembers || teamMembers.length === 0) {
            return res.status(400).json({ message: `This is a team event. Please add details for ${event.teamSize} members.` });
        }
    }

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

    const ticket = await Ticket.create({
      user: userId,
      event: eventId,
      pricePaid: finalPrice,
      discountCode,
      serialNumber: uniqueId,
      teamMembers: teamMembers || []
    });

    event.soldTickets += 1;
    await event.save();

    const user = await User.findById(userId);
    const adminEmail = "team.smec2026@gmail.com"; 

    let membersHtml = '';
    if (teamMembers && teamMembers.length > 0) {
        membersHtml = `\nTeam Members:\n${teamMembers.map(m => `- ${m.fullName} (${m.universityName || 'N/A'})`).join('\n')}`;
    }

    const emailBody = `
      Hello ${user.fullName}, 
      
      Your Pass is Confirmed! 
      Event: ${event.title}
      Ticket ID: ${uniqueId}  <-- SHOW THIS AT ENTRY
      Time: ${event.time}
      Location: ${event.location}
      Price Paid: PKR ${finalPrice}
      ${membersHtml}

      Best of luck!
      Team SMEC
    `;

    // Email to Buyer
    await sendEmail(user.email, `Ticket Confirmation: ${uniqueId}`, emailBody);

    // Email to Admin
    await sendEmail(
      adminEmail,
      `New Sale: ${event.title}`,
      `User ${user.fullName} bought a ticket.\nTicket ID: ${uniqueId}\nRevenue: ${finalPrice}\n${membersHtml}`
    );

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

module.exports = { buyTicket, createDiscount,getAllDiscounts,toggleDiscountStatus };