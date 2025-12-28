// cron/cronJobs.js
const cron = require('node-cron');
const Event = require('../models/Event');
const sendEmail = require('../utils/sendEmail');

const startCronJobs = () => {
  // Run every day at midnight (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running Cron Job: Checking Low Sales...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find events happening tomorrow
    // Logic: Database date match karni hai
    const startOfTomorrow = new Date(tomorrow.setHours(0,0,0,0));
    const endOfTomorrow = new Date(tomorrow.setHours(23,59,59,999));

    try {
      const events = await Event.find({
        date: { $gte: startOfTomorrow, $lte: endOfTomorrow }
      });

      for (const event of events) {
        if (event.soldTickets <= 3) { // User condition: 3 ya usse kam
            const adminEmail = "team.smec2026@gmail.com";
            await sendEmail(
                adminEmail,
                `⚠️ WARNING: Low Sales for ${event.title}`,
                `Alert! The event "${event.title}" is scheduled for tomorrow but has only sold ${event.soldTickets} tickets.`
            );
            console.log(`Alert sent for ${event.title}`);
        }
      }
    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });
};

module.exports = startCronJobs;