import { Router } from 'express';
import { getMovies, getSeats, getMovieById } from '../controllers/movieController.js';

const router = Router();

router.get('/', getMovies);
router.get('/:movieId', getMovieById);
router.get('/:movieId/seats', getSeats);

export default router;