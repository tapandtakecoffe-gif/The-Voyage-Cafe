import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetTime: Date;
  onComplete?: () => void;
}

export const CountdownTimer = ({ targetTime, onComplete }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeRemaining(0);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setTimeRemaining(difference);
      setIsComplete(false);
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete]);

  const formatTime = (ms: number): string => {
    if (ms <= 0) return 'Ready now!';

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (isComplete) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-semibold">
        <Clock className="h-4 w-4" />
        <span>Ready now!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-primary">
      <Clock className="h-4 w-4" />
      <span className="font-medium">{formatTime(timeRemaining)}</span>
    </div>
  );
};




