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

const movieList = [
    {
      title: "Inception",
      genre: "Sci-Fi, Action",
      releaseYear: 2010,
      director: "Christopher Nolan",
      description: "A skilled thief is given a chance to have his criminal record erased if he can successfully perform an inception.",
      imageUrl: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"
    },
    {
      title: "Pulp Fiction",
      genre: "Crime, Drama",
      releaseYear: 1994,
      director: "Quentin Tarantino",
      description: "The lives of several criminals intertwine in four stories involving violence, drugs, and redemption.",
      imageUrl: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SL1000_.jpg"
    },
    {
      title: "The Shawshank Redemption",
      genre: "Drama",
      releaseYear: 1994,
      director: "Frank Darabont",
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      imageUrl: "https://image.tmdb.org/t/p/w500/q6Nfu73Q9S9Kwb9m9y5Xfr7cypq.jpg"
    },
    {
      title: "The Dark Knight",
      genre: "Action, Crime, Drama",
      releaseYear: 2008,
      director: "Christopher Nolan",
      description: "Batman faces his toughest challenge yet when the Joker, a criminal mastermind, emerges to destroy Gotham City.",
      imageUrl: "https://image.tmdb.org/t/p/w500/r7T0HYHf3uOFubEVeXjt44NEk2b.jpg"
    },
    {
      title: "Forrest Gump",
      genre: "Drama, Romance",
      releaseYear: 1994,
      director: "Robert Zemeckis",
      description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an incredible true story.",
      imageUrl: "https://image.tmdb.org/t/p/w500/1d8Jj64d4F8FTyxy1swVBe4hwl3.jpg"
    },
    {
      title: "The Godfather",
      genre: "Crime, Drama",
      releaseYear: 1972,
      director: "Francis Ford Coppola",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      imageUrl: "https://image.tmdb.org/t/p/w500/5bK0qlglJ9dhMIgR3oiDfyOLxyT.jpg"
    },
    {
      title: "The Matrix",
      genre: "Action, Sci-Fi",
      releaseYear: 1999,
      director: "The Wachowskis",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      imageUrl: "https://image.tmdb.org/t/p/w500/jrM35yFTXnGybOw6o7lg9nrzruH.jpg"
    },
    {
      title: "The Lord of the Rings: The Return of the King",
      genre: "Adventure, Drama, Fantasy",
      releaseYear: 2003,
      director: "Peter Jackson",
      description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
      imageUrl: "https://image.tmdb.org/t/p/w500/a8q9mJ4eGyfmf1Pa3k3UlDni1F6.jpg"
    },
    {
      title: "Gladiator",
      genre: "Action, Adventure, Drama",
      releaseYear: 2000,
      director: "Ridley Scott",
      description: "A betrayed Roman general seeks revenge against the corrupt emperor who murdered his family and sent him into slavery.",
      imageUrl: "https://image.tmdb.org/t/p/w500/9SgiAghwUt7QfLgLptg6bA9NRFi.jpg"
    },
    {
      title: "Fight Club",
      genre: "Drama",
      releaseYear: 1999,
      director: "David Fincher",
      description: "An insomniac office worker and a soap salesman form an underground fight club that evolves into much more.",
      imageUrl: "https://image.tmdb.org/t/p/w500/4yKM4oKFb4jx3BoOrODQGSQ5KtK.jpg"
    }
  ];

  async function initializeDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
  
      // Clear old data
      await Movie.deleteMany({});
      console.log('🗑️ Existing Movies cleared');
  
      // Insert Movies
      const insertedMovies = await Movie.insertMany(movieList);
      console.log('🎥 Inserted Movies');
  
      await mongoose.disconnect();
      console.log('✅ Database initialization complete');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      process.exit(1);
    }
  }

  initializeDatabase();
  