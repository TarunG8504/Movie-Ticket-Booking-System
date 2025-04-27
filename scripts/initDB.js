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

const movies = [
  {
    title: "Inception",
    genre: ["Sci-Fi", "Action", "Thriller"],
    popularity: 9.2,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=240&w=600",
    availableSeats: 240,
    showtimes: [
      { time: "10:00 AM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "2:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "6:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    popularity: 9.5,
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=240&w=600",
    availableSeats: 240,
    showtimes: [
      { time: "11:00 AM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "3:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "7:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "Pulp Fiction",
    genre: ["Crime", "Drama"],
    popularity: 9.0,
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=240&w=600",
    availableSeats: 240,
    showtimes: [
      { time: "12:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "4:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "8:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "The Shawshank Redemption",
    genre: ["Drama"],
    popularity: 9.8,
    poster: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&q=240&w=600",
    availableSeats: 240,
    showtimes: [
      { time: "1:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "5:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "9:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "Interstellar",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    popularity: 9.3,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    availableSeats: 240,
    showtimes: [
      { time: "10:30 AM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "2:30 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "6:30 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "Avengers: Endgame",
    genre: ["Action", "Adventure", "Sci-Fi"],
    popularity: 9.1,
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    availableSeats: 240,
    showtimes: [
      { time: "11:00 AM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "3:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "7:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "Joker",
    genre: ["Crime", "Drama", "Thriller"],
    popularity: 8.9,
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    availableSeats: 240,
    showtimes: [
      { time: "12:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "4:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "8:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "Parasite",
    genre: ["Thriller", "Drama"],
    popularity: 9.0,
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    availableSeats: 240,
    showtimes: [
      { time: "1:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "5:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "9:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  },
  {
    title: "Fight Club",
    genre: ["Drama", "Thriller"],
    popularity: 9.1,
    poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    availableSeats: 240,
    showtimes: [
      { time: "10:00 AM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "2:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) },
      { time: "6:00 PM", seats: Array(8).fill().map(() => Array(10).fill(false)) }
    ]
  }
];

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    console.log('🗑️ Existing movies cleared');

    // Insert new movies
    const inserted = await Movie.insertMany(movies);
    console.log('🎉 Sample movies inserted:', inserted.map(m => m._id.toString()));

    await mongoose.disconnect();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
