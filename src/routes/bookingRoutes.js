import { Router } from 'express';
import { createBooking, getAllBookings, getBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createBooking);
router.get('/', protect, getAllBookings);
router.get('/:bookingId', protect, getBooking);

export default router;
