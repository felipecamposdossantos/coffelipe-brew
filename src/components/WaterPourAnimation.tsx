
import { useEffect, useState } from "react";
import { Droplets, Waves } from "lucide-react";

interface WaterPourAnimationProps {
  isPouring: boolean;
  currentAmount: number;
  targetAmount: number;
}

export const WaterPourAnimation = ({ isPouring, currentAmount, targetAmount }: WaterPourAnimationProps) => {
  const [droplets, setDroplets] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    if (isPouring) {
      // Create flowing droplets
      const newDroplets = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 45 + Math.random() * 10, // Center the pour
        delay: Math.random() * 200
      }));
      setDroplets(newDroplets);

      // Create bubbles at water surface
      const newBubbles = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 5 + Math.random() * 15,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 1000
      }));
      setBubbles(newBubbles);
    } else {
      setDroplets([]);
      setBubbles([]);
    }
  }, [isPouring]);

  // Ensure we don't divide by zero and round the percentage
  const progressPercent = targetAmount > 0 ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100) : 0;
  
  // Round the displayed amounts to avoid decimal places
  const displayCurrentAmount = Math.round(currentAmount);
  const displayTargetAmount = Math.round(targetAmount);

  return (
    <div className="relative w-full max-w-xs h-32 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 overflow-hidden shadow-inner mx-auto">
      {/* Water level with wave effect */}
      <div 
        className="absolute bottom-0 left-0 w-full transition-all duration-500 ease-out"
        style={{ height: `${progressPercent}%` }}
      >
        {/* Main water body */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 dark:from-blue-600 dark:via-blue-500 dark:to-blue-400 opacity-80" />
        
        {/* Wave animation on water surface */}
        {progressPercent > 0 && (
          <div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-blue-400 dark:via-blue-300 dark:to-blue-400 animate-pulse"
            style={{
              clipPath: 'polygon(0 50%, 25% 0%, 50% 50%, 75% 0%, 100% 50%, 100% 100%, 0% 100%)'
            }}
          />
        )}
        
        {/* Surface ripples when pouring */}
        {isPouring && progressPercent > 0 && (
          <div className="absolute top-0 left-0 w-full h-2">
            <Waves className="w-full h-full text-blue-300 dark:text-blue-400 opacity-60 animate-bounce" />
          </div>
        )}
      </div>

      {/* Pour stream */}
      {isPouring && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1">
          <div className="w-full h-6 bg-gradient-to-b from-blue-400 dark:from-blue-500 to-transparent animate-pulse" />
        </div>
      )}
      
      {/* Water amount display */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-90 px-3 py-1 rounded-full shadow-md border border-blue-200 dark:border-blue-600">
          <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
            {displayCurrentAmount}ml
          </span>
          <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">
            / {displayTargetAmount}ml
          </span>
        </div>
      </div>

      {/* Animated droplets during pouring */}
      {isPouring && droplets.map((droplet) => (
        <div
          key={droplet.id}
          className="absolute"
          style={{
            left: `${droplet.x}%`,
            top: '2px',
            animationDelay: `${droplet.delay}ms`,
          }}
        >
          <div className="animate-bounce">
            <Droplets 
              className="w-2 h-2 text-blue-500 dark:text-blue-400 drop-shadow-sm" 
              style={{
                animationDuration: '800ms',
                animationIterationCount: 'infinite'
              }}
            />
          </div>
        </div>
      ))}

      {/* Surface bubbles */}
      {isPouring && bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute animate-ping"
          style={{
            left: `${bubble.x}%`,
            bottom: `${progressPercent + bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}ms`,
            animationDuration: '2s'
          }}
        >
          <div className="w-full h-full bg-white dark:bg-blue-200 rounded-full opacity-70" />
        </div>
      ))}

      {/* Pouring indicator */}
      {isPouring && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-2 py-0.5 rounded-full shadow-md animate-pulse">
            <Droplets className="w-3 h-3" />
            <span className="text-xs font-medium">Despejando...</span>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-1 left-1 right-1">
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1 shadow-inner">
          <div 
            className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
