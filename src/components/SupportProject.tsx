
import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedContainer } from '@/components/ui/animated-container';

export const SupportProject = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnimatedContainer animation="fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-4">
            Apoie o Projeto
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300 text-lg">
            Ajude a manter o TimerCoffee Brew funcionando e melhorando
          </p>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="slide-up" delay={200}>
        <Card className="bg-coffee-50 dark:bg-coffee-900/20 border-coffee-200 dark:border-coffee-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-coffee-800 dark:text-coffee-200">
              <Heart className="w-5 h-5 text-red-500" />
              Faça uma Doação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mensagem principal */}
            <div className="text-center">
              <p className="text-coffee-700 dark:text-coffee-300 mb-4">
                Se esse site está sendo útil para você, deixe sua contribuição para o projeto
              </p>
            </div>
            
            {/* Seção PIX */}
            <div className="bg-coffee-100 dark:bg-coffee-800/30 rounded-lg p-6 transition-colors duration-300">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-coffee-800 dark:text-coffee-200 mb-2">
                  Contribua via PIX
                </h3>
                <p className="text-coffee-600 dark:text-coffee-400">
                  Sua doação ajuda a manter o projeto ativo e gratuito
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src="/lovable-uploads/dc58db2b-85bb-421b-bfd2-4c1634090f2b.png" 
                    alt="QR Code PIX para doação" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-coffee-600 dark:text-coffee-400 mb-3">
                    ou use a chave PIX:
                  </p>
                  <div className="bg-coffee-200 dark:bg-coffee-700 px-4 py-3 rounded-lg hover:bg-coffee-300 dark:hover:bg-coffee-600 transition-colors duration-300">
                    <code className="text-coffee-800 dark:text-coffee-200 font-mono text-sm break-all">
                      felipe_campos_santos@hotmail.com.br
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="text-center text-sm text-coffee-600 dark:text-coffee-400 space-y-2">
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
