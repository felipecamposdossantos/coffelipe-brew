
export interface RecipeStep {
  name: string;
  instruction: string;
  duration: number;
  waterAmount?: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  method: string;
  coffeeRatio: number;
  waterRatio: number;
  steps: RecipeStep[];
  waterTemperature?: number;
  grinderBrand?: string;
  grinderClicks?: number;
  paperBrand?: string;
  coffeeBeanId?: string;
  isPublic?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrewingMode {
  mode: 'auto' | 'manual' | 'expert';
}
