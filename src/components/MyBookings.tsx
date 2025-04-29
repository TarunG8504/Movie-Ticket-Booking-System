import { useEffect, useState } from 'react';
import { BookingDetails } from '../types';

interface MyBookingsProps {
  token: string;
  setView: (view: 'main' | 'bookings') => void;
}

export default function MyBookings({ token, setView }: MyBookingsProps) {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        const bookingsWithMovieDetails = await Promise.all(
          data.map(async (b: BookingDetails) => {
            const movieRes = await fetch(`/api/movies/${b.movieId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const movieData = await movieRes.json();

            return {
              ...b,
              movieDetails: {
                title: movieData.title,
                poster: movieData.poster
              }
            };
          })
        );

        setBookings(bookingsWithMovieDetails);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 mb-6">
        <p className="text-gray-600 dark:text-gray-400">No bookings found</p>
        <button
          onClick={() => {
            // resetSelections();  // This resets selectedMovie and more
            setView('main');
          }}
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <button
          onClick={() => {
            // resetSelections();  // This resets selectedMovie and more
            setView('main');
          }}
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Go Back
        </button>
      </div>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                {booking.movieDetails?.poster && (
                  <img
                    src={booking.movieDetails.poster}
                    alt={booking.movieDetails.title}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Movie</p>
                <p className="font-semibold">{booking.movieDetails?.title || booking.movieId}</p>

                <p className="text-sm text-gray-500 dark:text-gray-400">Theater</p>
                <p className="font-semibold">{booking?.theaterName || booking.theaterId}</p>

                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-semibold">{booking.date.toString().split('T')[0]}</p>

                <p className="text-sm text-gray-500 dark:text-gray-400">Showtime</p>
                <p>{booking.time}</p>

                <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
                <p>{booking.seats.map(seat => `R${seat.row + 1}-C${seat.column + 1}`).join(', ')}</p>

                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p>₹{booking.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
