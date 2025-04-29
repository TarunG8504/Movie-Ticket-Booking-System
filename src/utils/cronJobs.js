import cron from 'node-cron';
import dotenv from 'dotenv';
import Theater from '../models/Theater.js';

// Load environment variables
dotenv.config();

// Utility function to remove today's date and add a date 3 days after today
async function updateTheaterData() {
  try {
    // Use today's date at midnight
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);  // Reset to midnight (00:00:00)

    const todayISOString = todayDate.toISOString().split('T')[0];  // Format as YYYY-MM-DD

    // Remove today's date from all theaters
    await Theater.updateMany(
      { "shows.dates.date": todayISOString },
      { $pull: { "shows.$.dates": { date: todayISOString } } }
    );
    console.log(`✅ Today's date ${todayISOString} removed from theaters`);

    // Calculate the date 3 days after today
    const futureDate = new Date(todayDate);
    futureDate.setDate(todayDate.getDate() + 3);  // Add 3 days to today's date
    const newDate = futureDate.toISOString().split('T')[0];  // Format as YYYY-MM-DD

    // Add the new date (3 days after today) to all theaters
    await Theater.updateMany(
      {},
      { $push: { "shows.$[].dates": { date: newDate, showtimes: [] } } }
    );
    console.log(`✅ Date 3 days after today, ${newDate}, added to theaters`);
  } catch (error) {
    console.error('❌ Error updating theater data:', error);
  }
}

// Schedule the cron job to run at 12:00 AM every day
cron.schedule('0 0 * * *', () => {
  console.log('⏰ Running the cron job to update theater data...');
  updateTheaterData();
});

console.log('Cron job is set up to run at midnight every day.');
