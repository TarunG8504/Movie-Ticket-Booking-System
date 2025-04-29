import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';
import mongoose from 'mongoose';

export const getMovies = async (req, res) => {
  try {
    const { sort = 'popularity', search } = req.query;
    
    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }

    const sortOptions = {
      popularity: { popularity: -1 },
      seats: { availableSeats: -1 }
    };

    const movies = await Movie.find(query)
      .sort(sortOptions[sort] || sortOptions.popularity);

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getSeats = async (req, res) => {
  try {
    const { movieId } = req.params;  // Get movieId from route parameter
    const { theaterId, showtime } = req.query;  // Get theaterId and showtime from query string

    // Validate input parameters
    if (!movieId || !theaterId || !showtime) {
      return res.status(400).json({ message: 'Missing required parameters: movieId, theaterId, or showtime' });
    }

    // Find the theater by ID
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    // Check if shows exist in the theater
    if (!theater.shows || theater.shows.length === 0) {
      return res.status(404).json({ message: 'No shows available in this theater' });
    }

    // Find the show for the movie in the theater
    const show = theater.shows.find(show => show.movieId.toString() === movieId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found for this movie in the selected theater' });
    }

    // Check if dates exist for the show
    const dateObj = show.dates.find(d => d.showtimes.some(st => st.time === showtime));
    if (!dateObj) {
      return res.status(404).json({ message: 'No available dates for this movie in the selected theater' });
    }

    // Find the showtime object in the selected date
    const showtimeObj = dateObj.showtimes.find(s => s.time === showtime);
    if (!showtimeObj) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Return the seats for the showtime
    if (!showtimeObj.seats || showtimeObj.seats.length === 0) {
      return res.status(404).json({ message: 'No seats available for this showtime' });
    }

    return res.json(showtimeObj.seats);  // Return the seats available for this showtime
  } catch (error) {
    console.error('Error fetching seats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTheatersByMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(400).json({ message: 'Movie ID is required' });
  }

  try {
    const theaters = await Theater.aggregate([
      {
        $match: {
          "shows.movieId": new mongoose.Types.ObjectId(movieId)
        }
      },
      {
        $addFields: {
          shows: {
            $filter: {
              input: "$shows",
              as: "show",
              cond: { $eq: ["$$show.movieId", new mongoose.Types.ObjectId(movieId)] }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          shows: {
            movieId: 1,
            dates: 1,
            seatPrice : 1
          }
        }
      }
    ]);

    if (!theaters || theaters.length === 0) {
      return res.status(404).json({ message: 'No theaters found for this movie' });
    }
    res.json(theaters);
  } catch (error) {
    console.error('Error fetching theaters by movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
};