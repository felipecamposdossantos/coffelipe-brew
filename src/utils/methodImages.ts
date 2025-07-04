// Mapeamento de métodos para imagens específicas
export const methodImages = {
  // Imagens removidas - usando apenas fallback
};

// Função para obter a imagem do método
export const getMethodImage = (method: string): string => {
  return methodImages[method as keyof typeof methodImages] || "/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png";
};

// Função para obter o nome alternativo da imagem
export const getMethodImageAlt = (method: string): string => {
  return `Método ${method} para preparo de café`;
};
