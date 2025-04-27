import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import ShowtimeSelector from './components/ShowtimeSelector';
import SeatSelector from './components/SeatSelector';
import BookingSummary from './components/BookingSummary';
import QueueModal from './components/QueueModal';
import MyBookings from './components/MyBookings';
import { Movie, BookingDetails } from './types';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [desiredSeats, setDesiredSeats] = useState(2);
  const [isInQueue, setIsInQueue] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [seats, setSeats] = useState<boolean[][]>([]);
  const [view, setView] = useState<'main' | 'bookings'>('main');

  const handleAuthSuccess = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setBooking(null);
    setView('main');
  };

  useEffect(() => {
    if (token) {
      fetch('/api/movies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then(setMovies)
        .catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    if (selectedMovie && selectedShowtime && token) {
      fetch(`/api/movies/${selectedMovie._id}/seats?time=${encodeURIComponent(selectedShowtime)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(error.message || 'Failed to fetch seats');
          }
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setSeats(data);
          } else {
            throw new Error('Invalid seat data');
          }
        })
        .catch((err) => {
          console.error('Error loading seats:', err.message);
          setSeats([]); // Prevent .map crash
        });
    }
  }, [selectedMovie, selectedShowtime, token]);  
  

  const handleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else if (selectedSeats.length < desiredSeats) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (!token) return;

    try {
      setIsInQueue(true);
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: selectedMovie?._id,
          showtime: selectedShowtime,
          seats: selectedSeats,
        }),
      });
      const bookingDetails = await response.json();
      setIsInQueue(false);
      setBooking(bookingDetails);
    } catch (error) {
      console.error('Booking failed:', error);
      setIsInQueue(false);
    }
  };

  if (!token) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onLogout={handleLogout}
        />

        <div className="flex justify-end px-6 py-4">
          <button
            onClick={() => setView(view === 'main' ? 'bookings' : 'main')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {view === 'main' ? 'My Bookings' : 'Back to Home'}
          </button>
        </div>

        <main className="container mx-auto px-4 py-8">
          {view === 'bookings' ? (
            <MyBookings token={token} />
          ) : !selectedMovie ? (
            <MovieList movies={movies} onSelectMovie={setSelectedMovie} />
          ) : !selectedShowtime ? (
            <div>
              <button
                onClick={() => setSelectedMovie(null)}
                className="mb-4 text-indigo-600 dark:text-indigo-400"
              >
                ← Back to Movies
              </button>
              <ShowtimeSelector
                showtimes={selectedMovie.showtimes}
                selectedShowtimeId={selectedShowtime}
                onSelectShowtime={setSelectedShowtime}
              />
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedShowtime(null)}
                className="mb-4 text-indigo-600 dark:text-indigo-400"
              >
                ← Back to Showtimes
              </button>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm">Number of seats:</label>
                  <select
                    value={desiredSeats}
                    onChange={(e) => setDesiredSeats(Number(e.target.value))}
                    className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <SeatSelector
                  seats={seats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelection}
                  desiredSeats={desiredSeats}
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length !== desiredSeats}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {isInQueue && <QueueModal position={3} estimatedTime={5} />}
        {booking && (
          <BookingSummary
            booking={booking}
            onClose={() => {
              setBooking(null);
              setSelectedMovie(null);
              setSelectedShowtime(null);
              setSelectedSeats([]);
            }}
            onViewBookings={() => {
              setBooking(null);
              setSelectedMovie(null);
              setSelectedShowtime(null);
              setSelectedSeats([]);
              setView('bookings');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;