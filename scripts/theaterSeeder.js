import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve path to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

import Movie from '../src/models/Movie.js';
import Theater from '../src/models/Theater.js';

// Utility: Create seat matrix (8x10)
const generateSeats = () => Array(8).fill(null).map(() => Array(10).fill(false));

// Utility: Get next 'n' dates
function getDatesForNextDays(days = 3) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]); // yyyy-mm-dd format
  }
  return dates;
}

// Utility: Generate random seat price between min and max
function getRandomSeatPrice(min = 150, max = 250) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Theater.deleteMany({});
    console.log('🗑️ Existing Theaters cleared');

    const foundMovies = await Movie.find({});

    // Create Theaters with shows, dates, and random seat prices
    const theaters = [
      {
        name: "PVR Cinemas, Mumbai",
        location: "Mumbai, Maharashtra",
        shows: foundMovies.map((movie) => ({
          movieId: movie._id,
          dates: getDatesForNextDays().map((dateStr) => ({
            date: dateStr,
            showtimes: [
              {
                time: "10:00 AM",
                seats: generateSeats(),
                seatPrice: getRandomSeatPrice()
              },
              {
                time: "2:00 PM",
                seats: generateSeats(),
                seatPrice: getRandomSeatPrice()
              },
              {
                time: "6:00 PM",
                seats: generateSeats(),
                seatPrice: getRandomSeatPrice()
              }
            ]
          }))
        }))
      },
      {
        name: "INOX, Delhi",
        location: "Delhi, NCR",
        shows: foundMovies.map((movie) => ({
          movieId: movie._id,
          dates: getDatesForNextDays().map((dateStr) => ({
            date: dateStr,
            showtimes: [
              {
                time: "9:30 AM",
                seats: generateSeats(),
                seatPrice: getRandomSeatPrice()
              },
              {
                time: "1:30 PM",
                seats: generateSeats(),
                seatPrice: getRandomSeatPrice()
              },
              {
                time: "5:30 PM",
                seats: generateSeats(),
                seatPrice: getRandomSeatPrice()
              }
            ]
          }))
        }))
      }
    ];

    await Theater.insertMany(theaters);
    console.log('🏢 Inserted Theaters');

    await mongoose.disconnect();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
