import { Router } from 'express';
import { getMovies, getSeats, getMovieById, getTheatersByMovie } from '../controllers/movieController.js';

const router = Router();

router.get('/', getMovies);
router.get('/:movieId', getMovieById);
router.get('/:movieId/seats', getSeats);
router.get('/:movieId/theaters', getTheatersByMovie);

export default router;