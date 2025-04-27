export interface Movie {
  _id: string;
  title: string;
  genre: string[];
  popularity: number;
  availableSeats: number;
  poster: string;
  showtimes: Showtime[];
}

export interface Seat {
  id: string;
  row: number;
  column: number;
  status: 'available' | 'booked' | 'selected';
}

export interface Showtime {
  _id: string;
  time: string;
  date: string
  seats: Seat[][];
}

export interface BookingDetails {
  _id: string;            // derived from _id
  movieId: string;
  showtime: string;
  seats: { row: number; column: number }[];
  totalPrice: number;
}

export interface ShowtimeAvailability {
  time: string;
  date: string;
  isPast: boolean;
  availableSeats: number;
}