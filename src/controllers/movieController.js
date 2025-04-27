import Movie from '../models/Movie.js';

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
    const { movieId } = req.params;
    const showtime = req.query.time; // now a query parameter

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const showtimeObj = movie.showtimes.find(
      (s) => s.time.trim().toLowerCase() === showtime.trim().toLowerCase()
    );

    if (!showtimeObj) return res.status(404).json({ message: 'Showtime not found' });

    return res.json(showtimeObj.seats);
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