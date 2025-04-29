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

// Utility to create seat map (8 rows × 10 columns)
const generateSeats = () => Array(8).fill().map(() => Array(10).fill(false));

// Movies to insert
const movieList = [
  {
    title: "Inception",
    genre: ["Sci-Fi", "Action", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    popularity: 9.2,
    description: "A mind-bending thriller where dreams are real.",
    duration: 148,
    releaseDate: "2010-07-16"
  },
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    popularity: 9.5,
    description: "Batman faces the Joker in Gotham.",
    duration: 152,
    releaseDate: "2008-07-18"
  },
  {
    title: "Pulp Fiction",
    genre: ["Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg",
    popularity: 9.0,
    description: "Iconic tales of crime intertwined.",
    duration: 154,
    releaseDate: "1994-10-14"
  },
  {
    title: "The Shawshank Redemption",
    genre: ["Drama"],
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    popularity: 9.8,
    description: "Hope and friendship in a prison.",
    duration: 142,
    releaseDate: "1994-09-23"
  },
  {
    title: "Interstellar",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    popularity: 9.3,
    description: "Saving humanity through interstellar travel.",
    duration: 169,
    releaseDate: "2014-11-07"
  },
  {
    title: "Avengers: Endgame",
    genre: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    popularity: 9.1,
    description: "Avengers assemble for the final battle.",
    duration: 181,
    releaseDate: "2019-04-26"
  },
  {
    title: "Joker",
    genre: ["Crime", "Drama", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    popularity: 8.9,
    description: "The origin story of the Joker.",
    duration: 122,
    releaseDate: "2019-10-04"
  },
  {
    title: "Parasite",
    genre: ["Thriller", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    popularity: 9.0,
    description: "Two families, two different worlds collide.",
    duration: 132,
    releaseDate: "2019-05-30"
  },
  {
    title: "Fight Club",
    genre: ["Drama", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    popularity: 9.1,
    description: "An underground fight club evolves into something bigger.",
    duration: 139,
    releaseDate: "1999-10-15"
  }
];

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear old data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    console.log('🗑️ Existing Movies and Theaters cleared');

    // Insert Movies
    const insertedMovies = await Movie.insertMany(movieList);
    console.log('🎥 Inserted Movies');

    // Create Theaters
    const theaters = [
      {
        name: "PVR Cinemas, Mumbai",
        location: "Mumbai, Maharashtra",
        shows: insertedMovies.map((movie) => ({
          movieId: movie._id,
          showtimes: [
            { time: "10:00 AM", seats: generateSeats() },
            { time: "2:00 PM", seats: generateSeats() },
            { time: "6:00 PM", seats: generateSeats() },
            { time: "11:00 AM", seats: generateSeats() }, // For tomorrow, etc. based on your requirement
            { time: "3:00 PM", seats: generateSeats() },
            { time: "7:00 PM", seats: generateSeats() }
          ]
        }))
      },
      {
        name: "INOX, Delhi",
        location: "Delhi, NCR",
        shows: insertedMovies.map((movie) => ({
          movieId: movie._id,
          showtimes: [
            { time: "9:30 AM", seats: generateSeats() },
            { time: "1:30 PM", seats: generateSeats() },
            { time: "5:30 PM", seats: generateSeats() }
          ]
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
