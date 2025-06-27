
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
      const newDroplets = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 45 + Math.random() * 10, // Center the pour
        delay: Math.random() * 200
      }));
      setDroplets(newDroplets);

      // Create bubbles at water surface
      const newBubbles = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 10 + Math.random() * 20,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 1000
      }));
      setBubbles(newBubbles);
    } else {
      setDroplets([]);
      setBubbles([]);
    }
  }, [isPouring]);

  const progressPercent = Math.min((currentAmount / targetAmount) * 100, 100);

  return (
    <div className="relative w-full h-40 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 overflow-hidden shadow-inner">
      {/* Water level with wave effect */}
      <div 
        className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out"
        style={{ height: `${progressPercent}%` }}
      >
        {/* Main water body */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 opacity-80" />
        
        {/* Wave animation on water surface */}
        <div 
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 animate-pulse"
          style={{
            clipPath: 'polygon(0 50%, 25% 0%, 50% 50%, 75% 0%, 100% 50%, 100% 100%, 0% 100%)'
          }}
        />
        
        {/* Surface ripples when pouring */}
        {isPouring && (
          <div className="absolute top-0 left-0 w-full h-4">
            <Waves className="w-full h-full text-blue-300 opacity-60 animate-bounce" />
          </div>
        )}
      </div>

      {/* Pour stream */}
      {isPouring && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2">
          <div className="w-full h-full bg-gradient-to-b from-blue-400 to-transparent animate-pulse" />
        </div>
      )}
      
      {/* Water amount display */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white bg-opacity-95 px-4 py-2 rounded-full shadow-lg border border-blue-200">
          <span className="text-lg font-bold text-blue-800">
            {currentAmount}ml
          </span>
          <span className="text-sm text-blue-600 ml-1">
            / {targetAmount}ml
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
            top: '5px',
            animationDelay: `${droplet.delay}ms`,
          }}
        >
          <div className="animate-bounce">
            <Droplets 
              className="w-3 h-3 text-blue-500 drop-shadow-sm" 
              style={{
                animationDuration: '600ms',
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
          <div className="w-full h-full bg-white rounded-full opacity-70" />
        </div>
      ))}

      {/* Pouring indicator */}
      {isPouring && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 text-blue-700 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-md animate-pulse">
            <Droplets className="w-4 h-4" />
            <span className="text-sm font-medium">Despejando...</span>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="w-full bg-blue-200 rounded-full h-1.5 shadow-inner">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
