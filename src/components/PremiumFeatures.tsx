
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Cloud, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap,
  Coffee,
  Users,
  ShoppingCart,
  Store
} from 'lucide-react';

export const PremiumFeatures = () => {
  const [isPremium] = useState(false); // TODO: Implementar verificação real

  const premiumFeatures = [
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Backup na Nuvem",
      description: "Sincronização automática de todas suas receitas e dados",
      status: "premium"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Receitas Exclusivas",
      description: "Acesso a receitas de baristas profissionais renomados",
      status: "premium"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics Avançados",
      description: "Insights preditivos e análises detalhadas de performance",
      status: "premium"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Suporte Prioritário",
      description: "Atendimento exclusivo e resolução rápida de problemas",
      status: "premium"
    }
  ];

  const partnerRecommendations = [
    {
      name: "Café Especial Premium",
      description: "Grãos selecionados de fazendas brasileiras",
      price: "R$ 45,00",
      rating: 4.8,
      image: "/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png"
    },
    {
      name: "Filtro V60 Profissional",
      description: "Filtro oficial Hario V60 tamanho 02",
      price: "R$ 89,90",
      rating: 4.9,
      image: "/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png"
    },
    {
      name: "Moedor Manual Premium",
      description: "Moedor de rebarbas cônicas de precisão",
      price: "R$ 299,00",
      rating: 4.7,
      image: "/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-coffee-800 dark:text-coffee-200">
            TimerCoffee Premium
          </h1>
        </div>
        <p className="text-coffee-600 dark:text-coffee-400 text-lg max-w-2xl mx-auto">
          Eleve sua experiência de preparo de café com recursos exclusivos e parcerias especiais
        </p>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Recursos Premium</TabsTrigger>
          <TabsTrigger value="products">Produtos Recomendados</TabsTrigger>
          <TabsTrigger value="partners">Torrefações Parceiras</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {!isPremium && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  Upgrade para Premium
                </CardTitle>
                <CardDescription>
                  Desbloqueie todos os recursos avançados e tenha a melhor experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  R$ 19,90<span className="text-lg font-normal">/mês</span>
                </div>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Premium
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className={`relative ${!isPremium ? 'opacity-75' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-coffee-100 dark:bg-coffee-800 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </CardHeader>
                {!isPremium && (
                  <div className="absolute inset-0 bg-gray-900/10 rounded-lg flex items-center justify-center">
                    <Button variant="outline">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Necessário
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Produtos Recomendados</h2>
            <p className="text-coffee-600 dark:text-coffee-400">
              Equipamentos e grãos selecionados para melhorar seu café
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerRecommendations.map((product, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-coffee-100 dark:bg-coffee-800 flex items-center justify-center">
                  <Coffee className="w-16 h-16 text-coffee-400" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-coffee-800 dark:text-coffee-200">
                      {product.price}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-coffee-600 hover:bg-coffee-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ver Produto
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Torrefações Parceiras</h2>
            <p className="text-coffee-600 dark:text-coffee-400">
              Descubra grãos especiais de torrefações locais e renomadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Torra Clara Especiais", location: "São Paulo, SP", specialty: "Microlotes" },
              { name: "Café do Cerrado", location: "Minas Gerais, MG", specialty: "Tradicional" },
              { name: "Bean Coffee Roasters", location: "Rio de Janeiro, RJ", specialty: "Artesanal" },
              { name: "Fazenda Santa Mônica", location: "Espírito Santo, ES", specialty: "Orgânico" },
              { name: "Coffee Lab", location: "Curitiba, PR", specialty: "Experimental" },
              { name: "Café Gourmet Premium", location: "Brasília, DF", specialty: "Premium" }
            ].map((partner, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-coffee-100 dark:bg-coffee-800 rounded-lg">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <CardDescription>{partner.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="mb-4">
                    {partner.specialty}
                  </Badge>
                  <Button variant="outline" className="w-full">
                    <Coffee className="w-4 h-4 mr-2" />
                    Ver Grãos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
