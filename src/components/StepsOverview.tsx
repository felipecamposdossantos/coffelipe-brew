
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/pages/Index";

interface StepsOverviewProps {
  recipe: Recipe;
  currentStep: number;
  completedSteps: number[];
  getCumulativeWaterAmount: (stepIndex: number) => number;
  formatTime: (time: number) => string;
}

export const StepsOverview = ({
  recipe,
  currentStep,
  completedSteps,
  getCumulativeWaterAmount,
  formatTime
}: StepsOverviewProps) => {
  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-sm sm:text-base text-coffee-800">Todas as Etapas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {recipe.steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border text-sm ${
                index === currentStep 
                  ? 'bg-coffee-100 border-coffee-300' 
                  : completedSteps.includes(index)
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                completedSteps.includes(index)
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-coffee-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {completedSteps.includes(index) ? '✓' : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-coffee-800 truncate">{step.name}</div>
                <div className="text-xs sm:text-sm text-coffee-600 flex flex-wrap gap-2">
                  <span>{formatTime(step.duration)}</span>
                  {step.waterAmount && (
                    <span>• <strong>{step.waterAmount}ml</strong> (Total: <strong>{getCumulativeWaterAmount(index)}ml</strong>)</span>
                  )}
                </div>
              </div>
              {index === currentStep && (
                <Badge className="bg-coffee-600 text-white text-xs">
                  Atual
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
