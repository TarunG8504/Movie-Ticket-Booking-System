import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import ShowtimeSelector from './components/ShowtimeSelector';
import SeatSelector from './components/SeatSelector';
import BookingSummary from './components/BookingSummary';
import MyBookings from './components/MyBookings';
import { Movie, BookingDetails, Theater, Showtime } from './types';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<'main' | 'bookings'>('main');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  const [seats, setSeats] = useState<boolean[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [desiredSeats, setDesiredSeats] = useState(2);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [hasProceed, setHasProceed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [seatPrice, setSeatPrice] = useState<number>(0);

  const handleAuthSuccess = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    resetSelections();
    setView('main');
  };

  const resetSelections = () => {
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedDate('');
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setSeatPrice(0);
    setTotalPrice(0);
    setHasProceed(false);
    setBooking(null);
  };

  const handleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else if (selectedSeats.length < desiredSeats) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (!token || !selectedMovie || !selectedTheater || !selectedShowtime || !selectedDate) {
      alert('Please fill all the required fields');
      return;
    }

    try {
      const formattedSeats = selectedSeats.map(seatId => {
        const [row, column] = seatId.split('-').map(Number);
        return { row, column };
      });

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        
        body: JSON.stringify({
          movieId: selectedMovie._id,
          theaterId: selectedTheater._id,
          theaterName: selectedTheater.name,
          date: selectedDate.split('T')[0],
          time: selectedShowtime.time,
          seats: formattedSeats,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Booking failed';
        } catch {
          errorMessage = errorText || 'Booking failed';
        }
        throw new Error(errorMessage);
      }

      const bookingDetails = await response.json();
      setBooking(bookingDetails);
      resetSelections();
      setView('main');
      setSelectedMovie(null);
      alert('Booking successful!');

    } catch (error) {
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (token) {
      fetch('/api/movies', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setMovies)
        .catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    if (selectedMovie && token) {
      fetch(`/api/movies/${selectedMovie._id}/theaters`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setTheaters)
        .catch((err) => {
          console.error('Error loading theaters:', err.message);
          setTheaters([]);
        });
    }
  }, [selectedMovie, token]);

  useEffect(() => {
    if (selectedMovie && selectedShowtime && selectedTheater && selectedDate && token && hasProceed) {
      fetch(`/api/movies/${selectedMovie._id}/seats?theaterId=${selectedTheater._id}&showtime=${selectedShowtime.time}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: boolean[][]) => {
          setSeats(data);
          setSelectedSeats([]);
        })
        .catch(console.error);
    }
  }, [selectedMovie, selectedShowtime, selectedTheater, selectedDate, token, hasProceed]);

  // Update selectedSeats when desiredSeats is changed and is less than the current selection
  useEffect(() => {
    if (desiredSeats < selectedSeats.length) {
      setSelectedSeats([]); // Reset selectedSeats if desiredSeats is smaller
    }
  }, [desiredSeats, selectedSeats.length]);

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

        <main className="container mx-auto px-4 py-8">
          {view === 'bookings' ? (
            <MyBookings
              token={token}
              setView={setView}
            />
          ) : !selectedMovie ? (
            <>
              {/* My Bookings / Back Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setView(view === 'main' ? 'bookings' : 'main')}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {view === 'main' ? 'My Bookings' : 'Back to Home'}
                </button>
              </div>
              <MovieList
                movies={movies}
                onSelectMovie={(movie) => {
                  resetSelections();
                  setSelectedMovie(movie);
                }}
              />
            </>
          ) : !hasProceed ? (
            <div>
              {/* ✅ Updated: Buttons on same line */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  ← Back to Movies
                </button>
                <button
                  onClick={() => setView(view === 'main' ? 'bookings' : 'main')}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {view === 'main' ? 'My Bookings' : 'Back to Home'}
                </button>
              </div>
              <ShowtimeSelector
                movieId={selectedMovie._id}
                theaters={theaters}
                onProceed={(theater, date, showtime) => {
                  setSelectedTheater(theater);
                  setSelectedDate(date);
                  setSelectedShowtime(showtime);
                  setSeatPrice(showtime.seatPrice || 0);
                  setHasProceed(true);
                }}
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => {
                    setHasProceed(false);
                    setSelectedShowtime(null);
                  }}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  ← Back to Showtimes
                </button>
                <button
                  onClick={() => setView(view === 'main' ? 'bookings' : 'main')}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {view === 'main' ? 'My Bookings' : 'Back to Home'}
                </button>
              </div>

              <div>
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
                  onConfirmBooking={handleBooking}
                  setTotalPrice={setTotalPrice}
                  seatPrice={seatPrice}
                />
              </div>
            </div>
          )}
        </main>

        {booking && (
          <BookingSummary
            booking={booking}
            onClose={() => {
              setBooking(null);
              resetSelections();
            }}
            onViewBookings={() => {
              setBooking(null);
              resetSelections();
              setView('bookings');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
