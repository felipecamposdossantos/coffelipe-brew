
import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedContainer } from '@/components/ui/animated-container';

export const SupportProject = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <AnimatedContainer animation="fade-in">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-3 sm:mb-4">
            Apoie o Projeto
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300 text-base sm:text-lg px-2">
            Ajude a manter o TimerCoffee Brew funcionando e melhorando
          </p>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="slide-up" delay={200}>
        <Card className="bg-coffee-50 dark:bg-coffee-900/20 border-coffee-200 dark:border-coffee-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-coffee-800 dark:text-coffee-200 text-lg sm:text-xl">
              <Heart className="w-5 h-5 text-red-500" />
              Faça uma Doação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mensagem principal */}
            <div className="text-center px-2">
              <p className="text-coffee-700 dark:text-coffee-300 mb-4 text-sm sm:text-base">
                Se esse site está sendo útil para você, deixe sua contribuição para o projeto
              </p>
            </div>
            
            {/* Seção PIX */}
            <div className="bg-coffee-100 dark:bg-coffee-800/30 rounded-lg p-4 sm:p-6 transition-colors duration-300">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-coffee-800 dark:text-coffee-200 mb-2">
                  Contribua via PIX
                </h3>
                <p className="text-coffee-600 dark:text-coffee-400 text-sm sm:text-base">
                  Sua doação ajuda a manter o projeto ativo e gratuito
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-xs">
                  <img 
                    src="/lovable-uploads/dc58db2b-85bb-421b-bfd2-4c1634090f2b.png" 
                    alt="QR Code PIX para doação" 
                    className="w-full h-auto max-w-[200px] mx-auto"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Erro ao carregar QR Code');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                
                <div className="text-center w-full">
                  <p className="text-xs sm:text-sm text-coffee-600 dark:text-coffee-400 mb-3">
                    ou use a chave PIX:
                  </p>
                  <div className="bg-coffee-200 dark:bg-coffee-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-coffee-300 dark:hover:bg-coffee-600 transition-colors duration-300 break-all">
                    <code className="text-coffee-800 dark:text-coffee-200 font-mono text-xs sm:text-sm">
                      felipe_campos_santos@hotmail.com.br
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="text-center text-xs sm:text-sm text-coffee-600 dark:text-coffee-400 space-y-2 px-2">
              <p>
                Toda contribuição é muito bem-vinda e ajuda a manter o projeto funcionando!
              </p>
              <p>
                Obrigado pelo seu apoio! ☕
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>
    </div>
  );
};
