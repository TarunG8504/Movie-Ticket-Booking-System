import jwt from 'jsonwebtoken'; // Make sure to import jwt if you're using it for token decoding
import Booking from '../models/Booking.js';
import Theater from '../models/Theater.js';
import { generateBookingId } from '../utils/helpers.js';

// POST /api/bookings
export const createBooking = async (req, res) => {
  const { movieId, theaterId, date, time, seats, totalPrice, theaterName } = req.body;

  try {
    // Extract userId from JWT token (assuming the token is in the Authorization header)
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token format
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Decode the token to get the userId
    const decoded = jwt.verify(token, 'your_jwt_secret_here'); // Replace with your secret
    const userId = decoded.id;

    // 1. Find the theater
    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: 'Theater not found' });

    // 2. Find the showtime directly by date and time
    const show = theater.shows.find(s => s.movieId.toString() === movieId);
    if (!show) return res.status(404).json({ message: 'Movie not shown in this theater' });

    const dateEntry = show.dates.find(d => d.date === date);
    if (!dateEntry) return res.status(404).json({ message: 'Date not available' });

    const showtime = dateEntry.showtimes.find(st => st.time === time);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // 3. Validate seats availability directly
    for (const seat of seats) {
      if (showtime.seats[seat.row][seat.column]) {
        return res.status(400).json({ message: 'One or more seats already booked' });
      }
    }

    // 4. Mark seats as booked
    for (const seat of seats) {
      showtime.seats[seat.row][seat.column] = true;
    }

    // 5. Save the updated theater document
    await theater.save();

    // 6. Generate a booking ID and create a new booking entry
    const bookingId = generateBookingId();
    const booking = await Booking.create({
      bookingId,
      userId,
      movieId,
      theaterId,
      theaterName,
      date,
      time,
      seats,
      totalPrice,
    });

    // 7. Return the booking details
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET /api/bookings/:bookingId
export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate('movieId', 'title poster')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user can only access their own booking
    if (booking.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/bookings
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Get authenticated user's ID
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
