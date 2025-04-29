import { useEffect } from 'react';

interface SeatSelectorProps {
  seats: boolean[][];  // Matrix of seat availability
  selectedSeats: string[];  // List of selected seats
  onSeatSelect: (seatId: string) => void;  // Callback to handle seat selection
  onConfirmBooking: () => void;  // Callback to handle booking confirmation
  setTotalPrice: (price: number) => void;
  seatPrice: number;  // Price per seat
}

export default function SeatSelector({
  seats,
  selectedSeats,
  onSeatSelect,
  onConfirmBooking,
  setTotalPrice,
  seatPrice
}: SeatSelectorProps) {

  useEffect(() => {
    // Whenever selectedSeats changes, update the total price
    setTotalPrice(selectedSeats.length * seatPrice);  // Corrected total price calculation
  }, [selectedSeats, seatPrice, setTotalPrice]); // dependencies

  function toggleSeat(row: number, column: number) {
    const seatId = `${row}-${column}`;
    if (seats[row][column]) return;  // Already booked

    onSeatSelect(seatId);  // Update the selected seats via the callback
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Select Your Seats</h2>

      <div className="flex justify-center mb-5">
        <div className="grid grid-cols-10 gap-3">
          {seats.map((row, rowIndex) =>
            row.map((seat, colIndex) => {
              const isSelected = selectedSeats.includes(`${rowIndex}-${colIndex}`);
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                  disabled={seat}  // Disable if the seat is booked
                  className={`w-8 h-8 rounded ${seat ? 'bg-red-400 cursor-not-allowed' : isSelected ? 'bg-green-500' : 'bg-yellow-500 hover:bg-yellow-400'}`}
                />
              );
            })
          )}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="text-center">
          <p className="mb-2">Selected Seats: {selectedSeats.length}</p>
          <button
            onClick={onConfirmBooking}  // Handle booking on button click
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Total Price (₹{selectedSeats.length * seatPrice})
          </button>
        </div>
      )}
    </div>
  );
}
