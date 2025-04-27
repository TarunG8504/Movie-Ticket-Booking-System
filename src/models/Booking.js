import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    //required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  showtime: {
    type: String,
    required: true
  },
  seats: [{
    row: Number,
    column: Number
  }],
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);