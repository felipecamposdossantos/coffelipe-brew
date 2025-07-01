
const GRINDER_BRANDS_KEY = 'coffee_custom_grinders';

export const useCustomGrinders = () => {
  const getCustomGrinders = (): string[] => {
    try {
      const stored = localStorage.getItem(GRINDER_BRANDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveCustomGrinder = (grinderName: string) => {
    if (!grinderName.trim()) return;
    
    const existing = getCustomGrinders();
    if (!existing.includes(grinderName.trim())) {
      const updated = [...existing, grinderName.trim()];
      localStorage.setItem(GRINDER_BRANDS_KEY, JSON.stringify(updated));
    }
  };

  return { getCustomGrinders, saveCustomGrinder };
};
