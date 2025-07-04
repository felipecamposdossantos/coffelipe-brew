
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, Target, Settings, CheckCircle } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface OnboardingFlowProps {
  open: boolean;
  onComplete: () => void;
}

export const OnboardingFlow = ({ open, onComplete }: OnboardingFlowProps) => {
  const { updatePreferences } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    coffee_intensity: 3,
    acidity_preference: 3,
    bitterness_preference: 3,
    preferred_method: 'V60',
    daily_coffee_goal: 2
  });

  const steps = [
    {
      title: "Bem-vindo ao TimerCoffee Brew!",
      subtitle: "Vamos personalizar sua experiência",
      icon: Coffee
    },
    {
      title: "Suas Preferências de Sabor",
      subtitle: "Nos conte sobre seu paladar",
      icon: Settings
    },
    {
      title: "Método Preferido",
      subtitle: "Qual seu método de preparo favorito?",
      icon: Coffee
    },
    {
      title: "Meta Diária",
      subtitle: "Quantos cafés você pretende preparar por dia?",
      icon: Target
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const success = await updatePreferences({
      ...preferences,
      onboarding_completed: true
    });
    
    if (success) {
      onComplete();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-4">
            <Coffee className="h-16 w-16 mx-auto text-coffee-600" />
            <p className="text-lg text-muted-foreground">
              Vamos configurar suas preferências para oferecer a melhor experiência personalizada.
            </p>
            <p className="text-sm text-muted-foreground">
              Isso levará apenas alguns minutos e você poderá alterar tudo depois.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Intensidade do Café (1-5)</Label>
              <Slider
                value={[preferences.coffee_intensity]}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, coffee_intensity: value[0] }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Suave</span>
                <span>Intenso</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferência de Acidez (1-5)</Label>
              <Slider
                value={[preferences.acidity_preference]}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, acidity_preference: value[0] }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Baixa</span>
                <span>Alta</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferência de Amargor (1-5)</Label>
              <Slider
                value={[preferences.bitterness_preference]}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, bitterness_preference: value[0] }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Baixo</span>
                <span>Alto</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label>Método de Preparo Preferido</Label>
            <Select value={preferences.preferred_method} onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_method: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="V60">V60</SelectItem>
                <SelectItem value="Melita">Melita</SelectItem>
                <SelectItem value="French Press">French Press</SelectItem>
                <SelectItem value="AeroPress">AeroPress</SelectItem>
                <SelectItem value="Clever">Clever</SelectItem>
                <SelectItem value="Chemex">Chemex</SelectItem>
                <SelectItem value="Kalita">Kalita</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Este será usado para recomendações personalizadas. Você pode alterar depois.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label>Meta Diária de Cafés</Label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((goal) => (
                <Button
                  key={goal}
                  variant={preferences.daily_coffee_goal === goal ? "default" : "outline"}
                  onClick={() => setPreferences(prev => ({ ...prev, daily_coffee_goal: goal }))}
                  className="h-16 flex flex-col"
                >
                  <span className="text-xl font-bold">{goal}</span>
                  <span className="text-xs">café{goal !== 1 ? 's' : ''}</span>
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Isso nos ajuda a acompanhar seu progresso diário.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const IconComponent = steps[currentStep].icon;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <IconComponent className="h-6 w-6 text-coffee-600" />
            <DialogTitle>{steps[currentStep].title}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {steps[currentStep].subtitle}
          </p>
        </DialogHeader>
        
        <div className="py-4">
          {renderStepContent()}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded ${
                  index <= currentStep 
                    ? 'bg-coffee-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Voltar
              </Button>
            )}
            <Button onClick={handleNext} className="bg-coffee-600 hover:bg-coffee-700">
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar
                </>
              ) : (
                'Próximo'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
