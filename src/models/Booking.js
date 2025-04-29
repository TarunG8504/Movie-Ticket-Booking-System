import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  row: Number,
  column: Number
});

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  theaterName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seats: [seatSchema],
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
