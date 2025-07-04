
// Mapeamento de métodos para imagens específicas
export const methodImages = {
  "V60": "/lovable-uploads/V60.jpg",
  "Melita": "/lovable-uploads/Melita.jpg", 
  "French Press": "/lovable-uploads/French Press.jpg",
  "AeroPress": "/lovable-uploads/AeroPress.jpg",
  "Clever": "/lovable-uploads/Clever.jpg",
  "Chemex": "/lovable-uploads/Chemex.jpg",
  "Kalita": "/lovable-uploads/Kalita.jpg",
  "UFO Dripper": "/lovable-uploads/UFO Dripper.jpg",
  "Moka": "/lovable-uploads/Moka.jpg"
};

// Função para obter a imagem do método
export const getMethodImage = (method: string): string => {
  return methodImages[method as keyof typeof methodImages] || "/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png";
};

// Função para obter o nome alternativo da imagem
export const getMethodImageAlt = (method: string): string => {
  return `Método ${method} para preparo de café`;
};
