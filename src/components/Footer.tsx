
import { Heart, QrCode } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-coffee-800 text-cream-200 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Mensagem principal */}
          <p className="flex items-center justify-center gap-2 text-sm text-center">
            <Heart className="w-4 h-4 text-red-400" />
            Se esse site for útil para você compartilhe e fique à vontade em fazer sua contribuição
          </p>
          
          {/* Seção PIX */}
          <div className="bg-coffee-700 rounded-lg p-6 max-w-sm mx-auto">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-cream-100 mb-2">Apoie o projeto</h3>
              <p className="text-sm text-cream-300">Faça uma doação via PIX</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-3 rounded-lg">
                <img 
                  src="/lovable-uploads/dc58db2b-85bb-421b-bfd2-4c1634090f2b.png" 
                  alt="QR Code PIX para doação" 
                  className="w-32 h-32"
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-cream-300 mb-2">ou use a chave PIX:</p>
                <code className="bg-coffee-600 px-3 py-1 rounded text-xs text-cream-200">
                  felipe_campos_santos@hotmail.com.br
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
