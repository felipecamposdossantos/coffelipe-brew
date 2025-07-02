
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";

const grinderOptions = [
  { brand: "Comandante", defaultClicks: 18 },
  { brand: "1Zpresso JX-Pro", defaultClicks: 15 },
  { brand: "Baratza Encore", defaultClicks: 30 },
  { brand: "Hario Mini Mill Slim", defaultClicks: 12 },
  { brand: "Timemore C2", defaultClicks: 20 },
  { brand: "Timemore C3", defaultClicks: 18 },
  { brand: "Porlex Mini", defaultClicks: 10 },
  { brand: "Mazzer Mini", defaultClicks: 8 },
  { brand: "Fellow Ode", defaultClicks: 5 },
  { brand: "Wilfa Uniform", defaultClicks: 12 }
];

interface GrinderSelectorProps {
  selectedGrinder: string;
  selectedClicks: number;
  onGrinderChange: (grinder: string, clicks: number) => void;
}

export const GrinderSelector = ({ selectedGrinder, selectedClicks, onGrinderChange }: GrinderSelectorProps) => {
  const [customGrinder, setCustomGrinder] = useState("");
  const [customClicks, setCustomClicks] = useState(15);
  const [useCustomGrinder, setUseCustomGrinder] = useState(false);

  const handleGrinderChange = (value: string) => {
    if (value === "custom") {
      setUseCustomGrinder(true);
      onGrinderChange("", customClicks);
    } else {
      setUseCustomGrinder(false);
      const grinder = grinderOptions.find(g => g.brand === value);
      if (grinder) {
        onGrinderChange(value, grinder.defaultClicks);
      }
    }
  };

  const handleCustomGrinderChange = (grinder: string) => {
    setCustomGrinder(grinder);
    onGrinderChange(grinder, customClicks);
  };

  const handleCustomClicksChange = (clicks: number) => {
    setCustomClicks(clicks);
    onGrinderChange(useCustomGrinder ? customGrinder : selectedGrinder, clicks);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-coffee-700">Moedor</Label>
      <Select value={useCustomGrinder ? "custom" : selectedGrinder || "none"} onValueChange={handleGrinderChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione seu moedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Nenhum moedor selecionado</SelectItem>
          {grinderOptions.map((grinder) => (
            <SelectItem key={grinder.brand} value={grinder.brand}>
              {grinder.brand} ({grinder.defaultClicks} clicks)
            </SelectItem>
          ))}
          <SelectItem value="custom">Moedor personalizado</SelectItem>
        </SelectContent>
      </Select>
      
      {useCustomGrinder && (
        <div className="space-y-2">
          <Input
            value={customGrinder}
            onChange={(e) => handleCustomGrinderChange(e.target.value)}
            placeholder="Nome do seu moedor"
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Label className="text-sm">Clicks:</Label>
            <Input
              type="number"
              value={customClicks}
              onChange={(e) => handleCustomClicksChange(Number(e.target.value))}
              className="w-20"
              min="1"
              max="50"
            />
          </div>
        </div>
      )}
      
      {(selectedGrinder || useCustomGrinder) && (
        <div className="flex items-center gap-2 text-sm text-coffee-600">
          <Settings className="w-4 h-4" />
          <span>Clicks: {useCustomGrinder ? customClicks : selectedClicks}</span>
        </div>
      )}
    </div>
  );
};
