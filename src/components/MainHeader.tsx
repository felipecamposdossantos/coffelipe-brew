
import { Coffee, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeExportImport } from "@/components/RecipeExportImport";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { AnimatedContainer } from "@/components/ui/animated-container";

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
  return (
    <AnimatedContainer animation="fade-in">
      <div className="text-center mb-8">
        <div 
          className="flex items-center justify-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onLogoClick}
        >
          <Coffee className="w-10 h-10 sm:w-12 sm:h-12 text-coffee-600 dark:text-coffee-400" />
          <h1 className="text-3xl sm:text-4xl font-bold text-coffee-800 dark:text-coffee-200">TimerCoffee Brew</h1>
        </div>
        <p className="text-coffee-600 dark:text-coffee-300 text-base sm:text-lg">
          Seu aplicativo completo para preparo de café
        </p>
        
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="gap-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          </Button>
          
          {user && <RecipeExportImport />}
          
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePerformanceMonitor}
            >
              Perf
            </Button>
          )}
        </div>

        {showPerformanceMonitor && (
          <div className="mt-4 flex justify-center">
            <PerformanceMonitor showDetails />
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};
