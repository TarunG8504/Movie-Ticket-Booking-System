import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Theater, Showtime } from '../types';
import { formatDateLabel, combineDateTime } from '../utils/dateUtils';
import { isBefore } from 'date-fns';

interface ShowtimeSelectorProps {
  movieId: string;
  theaters: Theater[];
  onProceed: (selectedTheater: Theater, selectedDate: string, selectedShowtime: Showtime) => void;
}

export default function ShowtimeSelector({ movieId, theaters, onProceed }: ShowtimeSelectorProps) {
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [availableShowtimes, setAvailableShowtimes] = useState<Showtime[]>([]);

  // Set default theater and date when theaters or movieId change
  useEffect(() => {
    if (theaters.length > 0) {
      const firstTheater = theaters[0];
      setSelectedTheater(firstTheater);

      const firstDate = firstTheater.shows.find((s) => s.movieId === movieId)?.dates[0]?.date || null;
      if (firstDate) {
        setSelectedDate(firstDate);
      }
    }
  }, [theaters, movieId]);

  // Refresh available showtimes when theater or date changes
  useEffect(() => {
    if (selectedTheater && selectedDate) {
      const show = selectedTheater.shows.find((s) => s.movieId === movieId);
      if (show) {
        const dateShowtimes = show.dates.find((d) => d.date === selectedDate)?.showtimes || [];

        const filteredShowtimes = dateShowtimes.filter((showtime) => {
          const showtimeDate = combineDateTime(selectedDate, showtime.time);
          return !isBefore(showtimeDate, new Date());
        });

        setAvailableShowtimes(filteredShowtimes);

        if (!filteredShowtimes.some((showtime) => showtime._id === selectedShowtime?._id)) {
          setSelectedShowtime(filteredShowtimes[0] || null);
        }
      }
    }
  }, [selectedTheater, selectedDate, movieId, selectedShowtime?._id]);

  // Handle Theater selection
  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setAvailableShowtimes([]);
  };

  // Handle Date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedShowtime(null);
    setAvailableShowtimes([]);
  };

  // Handle Showtime selection
  const handleShowtimeSelect = (showtime: Showtime) => {
    console.log('Selected Showtime:', showtime);
    setSelectedShowtime(showtime);
  };

  // Proceed to seat selection
  const handleProceed = () => {
    if (selectedTheater && selectedDate && selectedShowtime) {
      onProceed(selectedTheater, selectedDate, selectedShowtime);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Theater & Showtime</h2>

      <div className="space-y-6">
        {/* Theater Selection */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
            <MapPin className="text-indigo-600" /> Select Theater
          </h3>
          <div className="flex flex-wrap gap-3">
            {theaters.map((theater) => (
              <button
                key={theater._id}
                onClick={() => handleTheaterSelect(theater)}
                className={`px-4 py-2 rounded-lg ${
                  selectedTheater?._id === theater._id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200'
                }`}
              >
                {theater.name}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        {selectedTheater && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 mt-4">
              <Calendar className="text-indigo-600" /> Select Date
            </h3>
            <div className="flex flex-wrap gap-3">
              {(selectedTheater.shows.find((s) => s.movieId === movieId)?.dates || []).map((dateInfo) => (
                <button
                  key={dateInfo.date}
                  onClick={() => handleDateSelect(dateInfo.date)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedDate === dateInfo.date
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200'
                  }`}
                >
                  {formatDateLabel(dateInfo.date)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Showtime Selection */}
        {availableShowtimes.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 mt-4">
              <Clock className="text-indigo-600" /> Select Showtime
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableShowtimes.map((showtime, index) => (
                <button
                  key={showtime._id || `${showtime.time}-${index}`}
                  onClick={() => handleShowtimeSelect(showtime)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedShowtime && (
                      selectedShowtime._id
                        ? selectedShowtime._id === showtime._id
                        : selectedShowtime.time === showtime.time
                    )                    
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showtime.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proceed Button */}
        {selectedTheater && selectedDate && selectedShowtime && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleProceed}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Proceed to Seat Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
