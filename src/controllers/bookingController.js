import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import { bookingQueue } from '../utils/queue.js';
import { generateBookingId } from '../utils/helpers.js';

export const createBooking = async (req, res) => {
  try {
    const { movieId, showtime, seats } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const showtimeObj = movie.showtimes.find(s => s.time === showtime);
    if (!showtimeObj) return res.status(404).json({ message: 'Showtime not found' });

    const seatMap = showtimeObj.seats;

    for (const seatStr of seats) {
      const [rowStr, colStr] = seatStr.split('-');
      const row = parseInt(rowStr);
      const col = parseInt(colStr);

      if (seatMap[row]?.[col]) {
        return res.status(400).json({ message: `Seat ${seatStr} is already booked` });
      }
    }

    let selectedSeats = [];
    for (const seatStr of seats) {
      const [rowStr, colStr] = seatStr.split('-');
      const row = parseInt(rowStr);
      const col = parseInt(colStr);

      seatMap[row][col] = true;
      selectedSeats.push({ row, column: col });
    }

    await movie.save();

    const booking = new Booking({
      movieId,
      userId: req.user.id, // ✅ Attach logged-in user
      showtime,
      seats: selectedSeats,
      totalPrice: seats.length * (movie.price || 199),
    });

    await booking.save();

    res.json({
      _id: booking._id,
      movieId,
      showtime,
      seats: selectedSeats, // ✅ matches the interface
      totalPrice: booking.totalPrice
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate('movieId', 'title poster')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // ✅ Ensure user can only access their own booking
    if (booking.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Get authenticated user's ID
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
