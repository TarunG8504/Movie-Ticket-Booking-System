import { Clock } from 'lucide-react';
import { Showtime } from '../types';

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  selectedShowtimeId: string | null;
  onSelectShowtime: (time: string) => void; // CHANGED: from Showtime to string
}

export default function ShowtimeSelector({
  showtimes,
  selectedShowtimeId,
  onSelectShowtime,
}: ShowtimeSelectorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold">Select Showtime</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {showtimes.map((showtime) => (
          <button
            key={showtime.time} // use time as key (it should be unique)
            onClick={() => onSelectShowtime(showtime.time)} // CHANGED
            className={`py-2 px-4 rounded-md text-center transition-colors ${
              selectedShowtimeId === showtime.time
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {showtime.time}
          </button>
        ))}
      </div>
    </div>
  );
}
