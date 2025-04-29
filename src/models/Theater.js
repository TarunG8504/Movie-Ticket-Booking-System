import mongoose from 'mongoose';

const seatSchema = [[Boolean]];

const showtimeSchema = new mongoose.Schema({
  time: { type: String, required: true },
  seats: { type: [[Boolean]], required: true },
  seatPrice: { type: Number, required: true } // << Added seatPrice
}, { _id: false });

const dateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  showtimes: [showtimeSchema]
}, { _id: false });

const showSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  dates: [dateSchema]
}, { _id: false });

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  shows: [showSchema]
}, { timestamps: true });

export default mongoose.model('Theater', theaterSchema);
