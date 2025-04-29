import { Check, Ticket } from 'lucide-react';
import { BookingDetails } from '../types';

interface BookingSummaryProps {
  booking: BookingDetails;
  onClose: () => void;
  onViewBookings: () => void;
}

export default function BookingSummary({ booking, onClose, onViewBookings }: BookingSummaryProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Booking Confirmed!</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
            <span className="font-mono">{booking._id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Seats:</span>
            <span>{booking.seats.map(seat => `${seat.row}-${seat.column}`).join(', ')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span>₹{booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={onViewBookings}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Ticket className="h-5 w-5" />
            <span>View My Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
}