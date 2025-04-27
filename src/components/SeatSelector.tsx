interface SeatSelectorProps {
  seats: boolean[][];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  desiredSeats: number;
}

export default function SeatSelector({
  seats,
  selectedSeats,
  onSeatSelect,
  desiredSeats,
}: SeatSelectorProps) {
  const getSeatColor = (seatId: string, isBooked: boolean) => {
    if (isBooked) return 'bg-red-500';
    if (selectedSeats.includes(seatId)) return 'bg-yellow-500';
    return 'bg-green-500 hover:bg-green-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Screen</h3>
        <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="grid gap-2 justify-center">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {row.map((isBooked, colIndex) => {
              const seatId = `${rowIndex}-${colIndex}`;
              return (
                <button
                  key={seatId}
                  onClick={() => onSeatSelect(seatId)}
                  disabled={isBooked}
                  className={`w-8 h-8 rounded ${getSeatColor(seatId, isBooked)} transition-colors ${
                    isBooked ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  title={`Seat ${seatId}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>
    </div>
  );
}
