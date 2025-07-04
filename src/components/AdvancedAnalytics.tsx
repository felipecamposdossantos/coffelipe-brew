
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Award, Users, Coffee, Target } from 'lucide-react';
import { useBrewHistory } from '@/hooks/useBrewHistory';
import { useUserRecipes } from '@/hooks/useUserRecipes';

interface AnalyticsData {
  dailyBrews: Array<{ date: string; count: number; methods: string[] }>;
  monthlyCosts: Array<{ month: string; cost: number; brews: number }>;
  methodDistribution: Array<{ method: string; count: number; percentage: number }>;
  performanceMetrics: {
    totalBrews: number;
    averageDaily: number;
    consistencyScore: number;
    varietyScore: number;
    efficiencyScore: number;
  };
  monthlyTrends: Array<{
    month: string;
    quality: number;
    satisfaction: number;
    innovation: number;
  }>;
  benchmarks: {
    userRank: number;
    totalUsers: number;
    averageBrewsPerWeek: number;
    topMethod: string;
  };
}

const COLORS = ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460', '#D2B48C'];

export const AdvancedAnalytics = () => {
  const { brewHistory } = useBrewHistory();
  const { userRecipes } = useUserRecipes();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    generateAnalytics();
  }, [brewHistory, timeframe]);

  const generateAnalytics = () => {
    if (!brewHistory.length) return;

    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      quarter: 90
    };

    const days = periods[timeframe];
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const recentBrews = brewHistory.filter(brew => 
      new Date(brew.brewed_at) >= startDate
    );

    // Preparos diários
    const dailyBrews = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayBrews = recentBrews.filter(brew => 
        new Date(brew.brewed_at).toDateString() === date.toDateString()
      );
      
      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        count: dayBrews.length,
        methods: [...new Set(dayBrews.map(b => b.grinder_brand || 'Método não especificado'))]
      };
    });

    // Custos mensais (simulado)
    const monthlyCosts = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthBrews = brewHistory.filter(brew => {
        const brewDate = new Date(brew.brewed_at);
        return brewDate.getMonth() === month.getMonth() && 
               brewDate.getFullYear() === month.getFullYear();
      });
      
      return {
        month: month.toLocaleDateString('pt-BR', { month: 'short' }),
        cost: monthBrews.length * 2.5, // R$ 2,50 por preparo
        brews: monthBrews.length
      };
    }).reverse();

    // Distribuição de métodos
    const methodCounts = recentBrews.reduce((acc, brew) => {
      const method = brew.grinder_brand || 'Método não especificado';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const methodDistribution = Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count,
      percentage: Math.round((count / recentBrews.length) * 100)
    }));

    // Métricas de performance
    const totalBrews = recentBrews.length;
    const averageDaily = totalBrews / days;
    const uniqueMethods = new Set(recentBrews.map(b => b.grinder_brand)).size;
    const consistencyScore = Math.min(100, (averageDaily / 2) * 100); // Meta: 2 preparos/dia
    const varietyScore = Math.min(100, (uniqueMethods / 5) * 100); // Meta: 5 métodos diferentes
    const efficiencyScore = Math.round((consistencyScore + varietyScore) / 2);

    // Tendências mensais (simulado)
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: month.toLocaleDateString('pt-BR', { month: 'short' }),
        quality: 70 + Math.random() * 25,
        satisfaction: 65 + Math.random() * 30,
        innovation: 60 + Math.random() * 35
      };
    }).reverse();

    // Benchmarks (simulado)
    const benchmarks = {
      userRank: Math.floor(Math.random() * 100) + 1,
      totalUsers: 1247,
      averageBrewsPerWeek: totalBrews / (days / 7),
      topMethod: methodDistribution[0]?.method || 'V60'
    };

    setAnalytics({
      dailyBrews,
      monthlyCosts,
      methodDistribution,
      performanceMetrics: {
        totalBrews,
        averageDaily: Math.round(averageDaily * 10) / 10,
        consistencyScore: Math.round(consistencyScore),
        varietyScore: Math.round(varietyScore),
        efficiencyScore
      },
      monthlyTrends,
      benchmarks
    });
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Coffee className="w-12 h-12 mx-auto text-coffee-600 animate-pulse mb-4" />
          <p className="text-coffee-600 dark:text-coffee-300">Analisando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-coffee-100 to-coffee-200 dark:from-coffee-800 dark:to-coffee-700 border-coffee-300 dark:border-coffee-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-600 dark:text-coffee-300 text-sm font-medium">
                  Total de Preparos
                </p>
                <p className="text-2xl font-bold text-coffee-800 dark:text-coffee-100">
                  {analytics.performanceMetrics.totalBrews}
                </p>
              </div>
              <Coffee className="w-8 h-8 text-coffee-600 dark:text-coffee-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-300 text-sm font-medium">
                  Média Diária
                </p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-100">
                  {analytics.performanceMetrics.averageDaily}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                  Score Eficiência
                </p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                  {analytics.performanceMetrics.efficiencyScore}%
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">
                  Ranking
                </p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                  #{analytics.benchmarks.userRank}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Última Semana</TabsTrigger>
          <TabsTrigger value="month">Último Mês</TabsTrigger>
          <TabsTrigger value="quarter">Último Trimestre</TabsTrigger>
        </TabsList>

        <TabsContent value={timeframe} className="space-y-6">
          {/* Gráficos Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preparos por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyBrews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8B4513" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custos Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.monthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Custo']} />
                    <Bar dataKey="cost" fill="#D2691E" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição de Métodos e Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Preparo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.methodDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ method, percentage }) => `${method} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.methodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Consistência</span>
                    <Badge variant="outline">
                      {analytics.performanceMetrics.consistencyScore}%
                    </Badge>
                  </div>
                  <Progress value={analytics.performanceMetrics.consistencyScore} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Variedade</span>
                    <Badge variant="outline">
                      {analytics.performanceMetrics.varietyScore}%
                    </Badge>
                  </div>
                  <Progress value={analytics.performanceMetrics.varietyScore} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Eficiência Geral</span>
                    <Badge variant="outline">
                      {analytics.performanceMetrics.efficiencyScore}%
                    </Badge>
                  </div>
                  <Progress value={analytics.performanceMetrics.efficiencyScore} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Benchmarks</h4>
                  <div className="text-sm space-y-1">
                    <p>Ranking: #{analytics.benchmarks.userRank} de {analytics.benchmarks.totalUsers}</p>
                    <p>Preparos/semana: {Math.round(analytics.benchmarks.averageBrewsPerWeek * 10) / 10}</p>
                    <p>Método favorito: {analytics.benchmarks.topMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tendências Mensais */}
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Qualidade</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quality" stroke="#8B4513" name="Qualidade" />
                  <Line type="monotone" dataKey="satisfaction" stroke="#D2691E" name="Satisfação" />
                  <Line type="monotone" dataKey="innovation" stroke="#CD853F" name="Inovação" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
