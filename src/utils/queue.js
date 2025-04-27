class BookingQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  enqueue(booking) {
    this.queue.push(booking);
    if (!this.processing) {
      this.processQueue();
    }
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  getPosition() {
    return this.queue.length;
  }  

  async processQueue() {
    if (this.isEmpty() || this.processing) {
      return;
    }

    this.processing = true;
    while (!this.isEmpty()) {
      const booking = this.dequeue();
      try {
        await this.processBooking(booking);
      } catch (error) {
        console.error('Error processing booking:', error);
        // Add back to queue if failed
        this.queue.unshift(booking);
        break;
      }
    }
    this.processing = false;
  }

  async processBooking(booking) {
    // Implement actual booking logic here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    return booking;
  }
}


export const bookingQueue = new BookingQueue();