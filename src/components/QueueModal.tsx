import { Loader2 } from 'lucide-react';

interface QueueModalProps {
  position: number;
  estimatedTime: number;
}

export default function QueueModal({ position, estimatedTime }: QueueModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">You're in Queue</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Due to high demand, you've been placed in a queue.
        </p>
        <div className="space-y-2">
          <p>
            Position in queue: <span className="font-semibold">{position}</span>
          </p>
          <p>
            Estimated wait time:{' '}
            <span className="font-semibold">{estimatedTime} minutes</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Please don't close this window. We'll automatically proceed with your
          booking when it's your turn.
        </p>
      </div>
    </div>
  );
}