import { Star } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
          {movie.genre.map((g) => (
            <span
              key={g}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
            >
              {g}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>{movie.popularity.toFixed(1)}</span>
        </div>
        <button
          onClick={() => onSelect(movie)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
}
