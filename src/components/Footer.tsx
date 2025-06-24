
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-coffee-800 text-cream-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-red-400" />
          Se esse site for útil para você compartilhe e fique à vontade em fazer sua contribuição
        </p>
      </div>
    </footer>
  );
};
