
import { Button } from "@/components/ui/button";
import { AutoBrewingProcess } from "@/components/AutoBrewingProcess";
import { ManualBrewingProcess } from "@/components/ManualBrewingProcess";
import { ExpertBrewingProcess } from "@/components/ExpertBrewingProcess";
import { FocusMode } from "@/components/FocusMode";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Recipe } from "@/pages/Index";
import { useBrewingTimer } from "@/hooks/useBrewingTimer";

interface BrewingInterfaceProps {
  recipe: Recipe;
  brewingMode: 'auto' | 'manual' | 'expert';
  onBrewingModeChange: (mode: 'auto' | 'manual' | 'expert') => void;
  onComplete: () => void;
  focusModeActive: boolean;
  onToggleFocusMode: () => void;
}

export const BrewingInterface = ({
  recipe,
  brewingMode,
  onBrewingModeChange,
  onComplete,
  focusModeActive,
  onToggleFocusMode
}: BrewingInterfaceProps) => {
  // Move the brewing timer logic here to share between all components
  const timerState = useBrewingTimer(recipe);

  const handleComplete = () => {
    // Make sure to finish the timer before completing
    if (timerState.isRunning) {
      timerState.handleFinish();
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto py-8">
        <AnimatedContainer animation="fade-in">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
                Preparando: {recipe.name}
              </h1>
              <div className="flex gap-2">
                <Button
                  variant={brewingMode === 'auto' ? 'default' : 'outline'}
                  onClick={() => onBrewingModeChange('auto')}
                  className={brewingMode === 'auto' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                  size="sm"
                >
                  Automático
                </Button>
                <Button
                  variant={brewingMode === 'manual' ? 'default' : 'outline'}
                  onClick={() => onBrewingModeChange('manual')}
                  className={brewingMode === 'manual' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                  size="sm"
                >
                  Manual
                </Button>
                <Button
                  variant={brewingMode === 'expert' ? 'default' : 'outline'}
                  onClick={() => onBrewingModeChange('expert')}
                  className={brewingMode === 'expert' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                  size="sm"
                >
                  Especialista
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleComplete}
              variant="outline"
              size="sm"
            >
              Voltar
            </Button>
          </div>
        </AnimatedContainer>
        
        {brewingMode === 'auto' ? (
          <AutoBrewingProcess 
            recipe={recipe} 
            onComplete={handleComplete}
            timerState={timerState}
          />
        ) : brewingMode === 'manual' ? (
          <ManualBrewingProcess 
            recipe={recipe} 
            onComplete={handleComplete}
            timerState={timerState}
          />
        ) : (
          <ExpertBrewingProcess 
            recipe={recipe} 
            onComplete={handleComplete}
            timerState={timerState}
          />
        )}

        <FocusMode
          recipe={recipe}
          isActive={focusModeActive}
          onToggle={onToggleFocusMode}
          timerState={timerState}
        />
      </div>
    </div>
  );
};
