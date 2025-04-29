import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
  time: String,
  seats: [[Boolean]]
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [{ type: String, required: true }],
  poster: { type: String, required: true },
  description: { type: String },
  duration: { type: Number }, // e.g., 148 minutes
  releaseDate: { type: Date },
  popularity: { type: Number, default: 0 }
}, { timestamps: true });


// Text index for search functionality
movieSchema.index({ title: 'text', 'genre': 'text' });

// Calculate available seats before saving
movieSchema.pre('save', function(next) {
  let totalAvailable = 0;
  this.showtimes.forEach(showtime => {
    showtime.seats.forEach(row => {
      totalAvailable += row.filter(seat => !seat).length;
    });
  });
  this.availableSeats = totalAvailable;
  next();
});

export default mongoose.model('Movie', movieSchema);