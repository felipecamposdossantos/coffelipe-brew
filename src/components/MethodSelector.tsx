
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface MethodSelectorProps {
  selectedMethods: string[];
  availableMethods: string[];
  onMethodsChange: (methods: string[]) => void;
}

export const MethodSelector = ({ selectedMethods, availableMethods, onMethodsChange }: MethodSelectorProps) => {
  const handleMethodToggle = (method: string) => {
    if (selectedMethods.includes(method)) {
      onMethodsChange(selectedMethods.filter(m => m !== method));
    } else {
      onMethodsChange([...selectedMethods, method]);
    }
  };

  const handleSelectAll = () => {
    onMethodsChange(availableMethods);
  };

  const handleClearAll = () => {
    onMethodsChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-coffee-600" />
        <span className="text-sm font-medium text-coffee-700">Filtrar por Método:</span>
      </div>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleSelectAll}
          className="text-xs px-2 py-1 bg-coffee-100 text-coffee-700 rounded hover:bg-coffee-200 transition-colors"
        >
          Todos
        </button>
        <button
          onClick={handleClearAll}
          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Limpar
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableMethods.map((method) => (
          <Badge
            key={method}
            variant={selectedMethods.includes(method) ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedMethods.includes(method)
                ? "bg-coffee-600 hover:bg-coffee-700 text-white"
                : "border-coffee-300 text-coffee-600 hover:bg-coffee-50"
            }`}
            onClick={() => handleMethodToggle(method)}
          >
            {method}
          </Badge>
        ))}
      </div>

      {selectedMethods.length > 0 && (
        <div className="text-xs text-coffee-600">
          {selectedMethods.length} de {availableMethods.length} métodos selecionados
        </div>
      )}
    </div>
  );
};
