import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Thermometer, Scale, Clock, Coffee, ChevronDown, ChevronUp } from 'lucide-react';
import { Recipe } from '@/pages/Index';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExpertBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
  timerState: any; // Shared timer state from useBrewingTimer
}

export const ExpertBrewingProcess = ({ recipe, onComplete, timerState }: ExpertBrewingProcessProps) => {
  const [stepTemperatures, setStepTemperatures] = useState<number[]>([]);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [extractionData, setExtractionData] = useState({
    totalTime: 0,
    waterUsed: 0,
    extractionRate: 0,
    strength: 3
  });
  const [tastingNotes, setTastingNotes] = useState({
    aroma: '',
    taste: '',
    body: '',
    acidity: 3,
    bitterness: 3,
    sweetness: 3,
    overall: 3
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTastingNotes, setShowTastingNotes] = useState(false);

  useEffect(() => {
    // Inicializar temperaturas para cada etapa
    const temps = recipe.steps.map(() => recipe.waterTemperature || 94);
    setStepTemperatures(temps);
  }, [recipe]);

  // Acompanhar tempo total decorrido
  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused) {
      const interval = setInterval(() => {
        setTotalElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerState.isRunning, timerState.isPaused]);

  const currentStepData = recipe.steps[timerState.currentStep];
  const isLastStep = timerState.currentStep === recipe.steps.length - 1;
  const progress = ((timerState.currentStep + 1) / recipe.steps.length) * 100;

  const handleStepComplete = () => {
    if (isLastStep && (timerState.completedSteps.includes(timerState.currentStep) || timerState.isOvertime)) {
      // Calcular dados de extração
      const totalWater = recipe.steps.reduce((sum, step) => sum + (step.waterAmount || 0), 0);
      setExtractionData(prev => ({
        ...prev,
        totalTime: totalElapsedTime,
        waterUsed: totalWater,
        extractionRate: Math.round((totalWater / (recipe.coffeeRatio * 10)) * 100) / 100
      }));
      setShowTastingNotes(true);
    } else {
      timerState.handleNextStep();
    }
  };

  const handleTemperatureChange = (stepIndex: number, temperature: number) => {
    const newTemps = [...stepTemperatures];
    newTemps[stepIndex] = temperature;
    setStepTemperatures(newTemps);
  };

  const handleTastingNotesChange = (field: string, value: any) => {
    setTastingNotes(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteBrewing = () => {
    timerState.handleFinish();
    onComplete();
  };

  if (showTastingNotes) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Análise de Extração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-coffee-50 dark:bg-coffee-900/50 rounded-lg">
                <div className="text-2xl font-bold text-coffee-800 dark:text-coffee-200">
                  {timerState.formatTime(extractionData.totalTime)}
                </div>
                <div className="text-sm text-coffee-600 dark:text-coffee-400">Tempo Total</div>
              </div>
              <div className="text-center p-3 bg-coffee-50 dark:bg-coffee-900/50 rounded-lg">
                <div className="text-2xl font-bold text-coffee-800 dark:text-coffee-200">
                  {extractionData.waterUsed}ml
                </div>
                <div className="text-sm text-coffee-600 dark:text-coffee-400">Água Usada</div>
              </div>
              <div className="text-center p-3 bg-coffee-50 dark:bg-coffee-900/50 rounded-lg">
                <div className="text-2xl font-bold text-coffee-800 dark:text-coffee-200">
                  {extractionData.extractionRate}:1
                </div>
                <div className="text-sm text-coffee-600 dark:text-coffee-400">Taxa Extração</div>
              </div>
              <div className="text-center p-3 bg-coffee-50 dark:bg-coffee-900/50 rounded-lg">
                <div className="text-2xl font-bold text-coffee-800 dark:text-coffee-200">
                  {extractionData.strength}/5
                </div>
                <div className="text-sm text-coffee-600 dark:text-coffee-400">Força</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas de Degustação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Aroma</label>
                <Textarea
                  value={tastingNotes.aroma}
                  onChange={(e) => handleTastingNotesChange('aroma', e.target.value)}
                  placeholder="Descreva o aroma..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sabor</label>
                <Textarea
                  value={tastingNotes.taste}
                  onChange={(e) => handleTastingNotesChange('taste', e.target.value)}
                  placeholder="Descreva o sabor..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Acidez: {tastingNotes.acidity}/5
                  </label>
                  <Slider
                    value={[tastingNotes.acidity]}
                    onValueChange={(value) => handleTastingNotesChange('acidity', value[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Amargor: {tastingNotes.bitterness}/5
                  </label>
                  <Slider
                    value={[tastingNotes.bitterness]}
                    onValueChange={(value) => handleTastingNotesChange('bitterness', value[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Doçura: {tastingNotes.sweetness}/5
                  </label>
                  <Slider
                    value={[tastingNotes.sweetness]}
                    onValueChange={(value) => handleTastingNotesChange('sweetness', value[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Avaliação Geral: {tastingNotes.overall}/5
                  </label>
                  <Slider
                    value={[tastingNotes.overall]}
                    onValueChange={(value) => handleTastingNotesChange('overall', value[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Corpo/Textura</label>
              <Textarea
                value={tastingNotes.body}
                onChange={(e) => handleTastingNotesChange('body', e.target.value)}
                placeholder="Descreva o corpo e textura..."
                className="min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleCompleteBrewing} className="flex-1">
            Finalizar e Salvar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-coffee-600 dark:text-coffee-400">
              {timerState.currentStep + 1} de {recipe.steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {currentStepData?.name}
            </CardTitle>
            <Badge variant="outline">Etapa {timerState.currentStep + 1}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-coffee-600 dark:text-coffee-400">{currentStepData?.instruction}</p>
          
          {/* Timer */}
          <div className="text-center">
            <div className="text-4xl font-bold text-coffee-800 dark:text-coffee-200 mb-4">
              {timerState.formatOvertimeDisplay()}
            </div>
            <div className="flex justify-center gap-2">
              {!timerState.hasStarted ? (
                <Button 
                  onClick={timerState.handleStart}
                  variant="default"
                >
                  Iniciar
                </Button>
              ) : (
                <Button onClick={timerState.handlePause} variant="outline">
                  {timerState.isPaused ? 'Retomar' : 'Pausar'}
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Controls */}
          <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center gap-2">
                {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                Controles Avançados
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4" />
                    Temperatura: {stepTemperatures[timerState.currentStep] || recipe.waterTemperature}°C
                  </label>
                  <Slider
                    value={[stepTemperatures[timerState.currentStep] || recipe.waterTemperature || 94]}
                    onValueChange={(value) => handleTemperatureChange(timerState.currentStep, value[0])}
                    max={100}
                    min={70}
                    step={1}
                    className="w-full"
                  />
                </div>
                {currentStepData?.waterAmount && (
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Scale className="w-4 h-4" />
                      Água: {currentStepData.waterAmount}ml
                    </label>
                    <div className="p-2 bg-coffee-50 dark:bg-coffee-900/50 rounded text-center">
                      {currentStepData.waterAmount}ml
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button 
            onClick={handleStepComplete}
            className="w-full"
            size="lg"
          >
            {isLastStep ? 'Finalizar Preparo' : 'Próxima Etapa'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
