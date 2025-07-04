
import { Coffee, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainHeaderProps {
  theme: string;
  toggleTheme: () => void;
  onLogoClick: () => void;
  user: any;
  showPerformanceMonitor: boolean;
  onTogglePerformanceMonitor: () => void;
}

export const MainHeader = ({
  theme,
  toggleTheme,
  onLogoClick,
  user,
  showPerformanceMonitor,
  onTogglePerformanceMonitor
}: MainHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <AnimatedContainer animation="fade-in">
      <div className="text-center">
        {/* Logo - Compact for mobile */}
        <div 
          className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4 cursor-pointer hover:opacity-80 transition-opacity touch-target"
          onClick={onLogoClick}
        >
          <Coffee className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-coffee-600 dark:text-coffee-400 flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-coffee-800 dark:text-coffee-200 leading-tight">
            {isMobile ? "TimerCoffee" : "TimerCoffee Brew"}
          </h1>
        </div>

        {/* Subtitle - Responsive */}
        <p className="text-coffee-600 dark:text-coffee-300 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 px-2">
          {isMobile ? "Seu app completo para café" : "Seu aplicativo completo para preparo de café"}
        </p>
        
        {/* Controls - Mobile optimized */}
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={toggleTheme}
            className="gap-1 sm:gap-2 touch-target min-h-[44px] px-3 sm:px-4"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-xs sm:text-sm">
              {theme === 'dark' ? 'Claro' : 'Escuro'}
            </span>
          </Button>
          
          {process.env.NODE_ENV === 'development' && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePerformanceMonitor}
              className="touch-target"
            >
              Perf
            </Button>
          )}
        </div>

        {/* Performance Monitor - Desktop only */}
        {showPerformanceMonitor && !isMobile && (
          <div className="mt-4 flex justify-center">
            <PerformanceMonitor showDetails />
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};
