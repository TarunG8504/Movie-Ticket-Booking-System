import { Search, SlidersHorizontal } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../types';
import { useState } from 'react';

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieList({ movies, onSelectMovie}: MovieListProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'alphabetical'>('popularity');

  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortBy === 'popularity'
        ? b.popularity - a.popularity
        : a.title.localeCompare(b.title)
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies or genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black dark:text-gray-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'popularity' | 'alphabetical')}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black dark:text-gray-900"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="alphabetical">Sort by Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} onSelect={onSelectMovie} />
        ))}
      </div>
    </div>
  );
}
