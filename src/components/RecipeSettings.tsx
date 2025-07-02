
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCoffeeBeans } from "@/hooks/useCoffeeBeans";
import { useFilterPapers } from "@/hooks/useFilterPapers";
import { GrinderSelector } from "./GrinderSelector";

interface RecipeSettingsProps {
  selectedCoffeeBeanId: string;
  selectedFilterPaperId: string;
  selectedPaper: string;
  selectedGrinder: string;
  selectedClicks: number;
  onCoffeeBeanChange: (id: string) => void;
  onFilterPaperChange: (id: string) => void;
  onPaperChange: (paper: string) => void;
  onGrinderChange: (grinder: string, clicks: number) => void;
}

export const RecipeSettings = ({
  selectedCoffeeBeanId,
  selectedFilterPaperId,
  selectedPaper,
  selectedGrinder,
  selectedClicks,
  onCoffeeBeanChange,
  onFilterPaperChange,
  onPaperChange,
  onGrinderChange
}: RecipeSettingsProps) => {
  const { coffeeBeans } = useCoffeeBeans();
  const { filterPapers } = useFilterPapers();

  return (
    <div className="space-y-4">
      {/* Coffee Bean Selection */}
      {coffeeBeans.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-coffee-700">Grão de Café</Label>
          <Select value={selectedCoffeeBeanId} onValueChange={onCoffeeBeanChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione seu grão de café" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Usar grão padrão</SelectItem>
              {coffeeBeans.map((bean) => (
                <SelectItem key={bean.id} value={bean.id}>
                  {bean.name} - {bean.brand} ({bean.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Filter Paper Selection */}
      {filterPapers.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-coffee-700">Papel de Filtro</Label>
          <Select value={selectedFilterPaperId} onValueChange={onFilterPaperChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione seu papel de filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Usar papel padrão</SelectItem>
              {filterPapers.map((paper) => (
                <SelectItem key={paper.id} value={paper.id}>
                  {paper.name} - {paper.brand} {paper.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Paper Brand Selection - fallback if no filter papers are registered */}
      {filterPapers.length === 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-coffee-700">Marca do Papel</Label>
          <Input
            value={selectedPaper}
            onChange={(e) => onPaperChange(e.target.value)}
            placeholder="Digite a marca do papel"
            className="w-full"
          />
        </div>
      )}

      {/* Grinder Selection */}
      <GrinderSelector
        selectedGrinder={selectedGrinder}
        selectedClicks={selectedClicks}
        onGrinderChange={onGrinderChange}
      />
    </div>
  );
};
