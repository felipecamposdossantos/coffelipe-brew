
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useState, useEffect } from 'react';

export const UserPreferencesPanel = () => {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const [localPrefs, setLocalPrefs] = useState({
    coffee_intensity: 3,
    acidity_preference: 3,
    bitterness_preference: 3,
    preferred_method: 'V60',
    daily_coffee_goal: 2
  });

  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        coffee_intensity: preferences.coffee_intensity,
        acidity_preference: preferences.acidity_preference,
        bitterness_preference: preferences.bitterness_preference,
        preferred_method: preferences.preferred_method,
        daily_coffee_goal: preferences.daily_coffee_goal
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    await updatePreferences(localPrefs);
  };

  if (loading || !preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando preferências...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Suas Preferências de Café
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Intensidade do Café (1-5)</Label>
          <Slider
            value={[localPrefs.coffee_intensity]}
            onValueChange={(value) => setLocalPrefs(prev => ({ ...prev, coffee_intensity: value[0] }))}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Suave</span>
            <span>Atual: {localPrefs.coffee_intensity}</span>
            <span>Intenso</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferência de Acidez (1-5)</Label>
          <Slider
            value={[localPrefs.acidity_preference]}
            onValueChange={(value) => setLocalPrefs(prev => ({ ...prev, acidity_preference: value[0] }))}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Baixa</span>
            <span>Atual: {localPrefs.acidity_preference}</span>
            <span>Alta</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferência de Amargor (1-5)</Label>
          <Slider
            value={[localPrefs.bitterness_preference]}
            onValueChange={(value) => setLocalPrefs(prev => ({ ...prev, bitterness_preference: value[0] }))}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Baixo</span>
            <span>Atual: {localPrefs.bitterness_preference}</span>
            <span>Alto</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Método Preferido</Label>
          <Select 
            value={localPrefs.preferred_method} 
            onValueChange={(value) => setLocalPrefs(prev => ({ ...prev, preferred_method: value }))}
          >
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
        </div>

        <div className="space-y-3">
          <Label>Meta Diária</Label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((goal) => (
              <Button
                key={goal}
                variant={localPrefs.daily_coffee_goal === goal ? "default" : "outline"}
                onClick={() => setLocalPrefs(prev => ({ ...prev, daily_coffee_goal: goal }))}
                className="h-12 flex flex-col"
              >
                <span className="font-bold">{goal}</span>
                <span className="text-xs">café{goal !== 1 ? 's' : ''}</span>
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-coffee-600 hover:bg-coffee-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar Preferências
        </Button>
      </CardContent>
    </Card>
  );
};
