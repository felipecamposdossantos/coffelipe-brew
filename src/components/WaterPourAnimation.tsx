
import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";

interface WaterPourAnimationProps {
  isPouring: boolean;
  currentAmount: number;
  targetAmount: number;
}

export const WaterPourAnimation = ({ isPouring, currentAmount, targetAmount }: WaterPourAnimationProps) => {
  const [droplets, setDroplets] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isPouring) {
      const newDroplets = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 500
      }));
      setDroplets(newDroplets);
    } else {
      setDroplets([]);
    }
  }, [isPouring]);

  const progressPercent = Math.min((currentAmount / targetAmount) * 100, 100);

  return (
    <div className="relative w-full h-32 bg-blue-50 rounded-lg border-2 border-blue-200 overflow-hidden">
      {/* Water level */}
      <div 
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-1000 ease-out"
        style={{ height: `${progressPercent}%` }}
      />
      
      {/* Water amount text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-blue-800">
            {currentAmount}ml / {targetAmount}ml
          </span>
        </div>
      </div>

      {/* Animated droplets when pouring */}
      {isPouring && droplets.map((droplet) => (
        <div
          key={droplet.id}
          className="absolute animate-bounce"
          style={{
            left: `${droplet.x}%`,
            top: '10px',
            animationDelay: `${droplet.delay}ms`,
            animationDuration: '800ms'
          }}
        >
          <Droplets className="w-4 h-4 text-blue-500" />
        </div>
      ))}

      {/* Pour indication */}
      {isPouring && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 text-blue-600 animate-pulse">
            <Droplets className="w-5 h-5" />
            <span className="text-sm font-medium">Despejando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
