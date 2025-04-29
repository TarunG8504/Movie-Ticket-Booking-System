export interface Movie {
  _id: string;
  title: string;
  genre: string[];
  popularity: number;
  availableSeats: number;
  poster: string;
  showtimes: Showtime[];
  basePrice: number;
}

export interface Showtime {
  _id?: string;  // _id might not exist before saving to DB
  time: string;
  seats: boolean[][];
  seatPrice: number; // 🆕 Add this line
  date?: string; // optional, since you also have date separately
}

export interface Theater {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  totalSeats: number;
  shows: Show[];
  amenities: string[];
}

export interface Show {
  movieId: string;
  dates: ShowDate[];
}

export interface ShowDate {
  date: string;
  showtimes: Showtime[]; // 🆙 Showtime now includes seatPrice
}

export interface BookingDetails {
  _id: string;
  movieId: string;
  theaterId: string;
  theaterName: string;
  time: string;
  seats: {
    row: number;
    column: number;
    type: 'regular' | 'premium' | 'vip';
  }[];
  totalPrice: number;
  date: string;
  movieDetails?: {
    title: string;
    poster: string;
  };
}

export interface ShowtimeAvailability {
  time: string;
  date: string;
  isPast: boolean;
  availableSeats: number;
}
