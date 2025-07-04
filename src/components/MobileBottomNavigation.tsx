
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Home, 
  Coffee, 
  Timer as TimerIcon, 
  User, 
  MoreHorizontal,
  BarChart3, 
  Lightbulb, 
  Filter, 
  History, 
  Settings, 
  Calendar,
  Package,
  TrendingUp,
  Zap,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedContainer } from '@/components/ui/animated-container';

interface MobileBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMoreMenuSelect: (value: string) => void;
  isAuthenticated: boolean;
}

export const MobileBottomNavigation = ({ 
  activeTab, 
  onTabChange, 
  onMoreMenuSelect, 
  isAuthenticated 
}: MobileBottomNavigationProps) => {
  const isMobile = useIsMobile();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  if (!isMobile) return null;

  const tabs = [
    ...(isAuthenticated ? [{ id: 'dashboard', icon: Home, label: 'Home' }] : []),
    { id: 'recipes', icon: Coffee, label: 'Receitas' },
    { id: 'timer', icon: TimerIcon, label: 'Timer' },
    ...(isAuthenticated ? [{ id: 'my-recipes', icon: User, label: 'Minhas' }] : []),
    { id: 'more', icon: MoreHorizontal, label: 'Mais' }
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'more') {
      setIsMoreMenuOpen(true);
      return;
    }
    onTabChange(tabId);
  };

  const handleMoreMenuItemClick = (value: string) => {
    onMoreMenuSelect(value);
    setIsMoreMenuOpen(false);
  };

  const moreMenuItems = [
    ...(isAuthenticated ? [
      { id: 'analytics', icon: BarChart3, label: 'Analytics Básico', category: 'Analytics' },
      { id: 'advanced-analytics', icon: TrendingUp, label: 'Reports Avançados', category: 'Analytics' },
      { id: 'suggestions', icon: Lightbulb, label: 'Sugestões', category: 'IA e Sugestões' },
      { id: 'smart-rec', icon: Zap, label: 'Recomendações IA', category: 'IA e Sugestões' },
      { id: 'comparison', icon: BarChart3, label: 'Comparar Receitas', category: 'IA e Sugestões' },
      { id: 'coffee-beans', icon: Coffee, label: 'Grãos de Café', category: 'Gerenciamento' },
      { id: 'filter-papers', icon: Filter, label: 'Filtros', category: 'Gerenciamento' },
      { id: 'stock', icon: Package, label: 'Estoque', category: 'Gerenciamento' },
      { id: 'scheduler', icon: Calendar, label: 'Agenda', category: 'Outros' },
      { id: 'history', icon: History, label: 'Histórico', category: 'Outros' },
      { id: 'advanced', icon: Settings, label: 'Configurações', category: 'Outros' },
      { id: 'support', icon: Heart, label: 'Apoie o Projeto', category: 'Apoio' }
    ] : [
      { id: 'support', icon: Heart, label: 'Apoie o Projeto', category: 'Apoio' },
      { id: 'auth', icon: User, label: 'Login', category: 'Conta' }
    ])
  ];

  const groupedItems = moreMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof moreMenuItems>);

  return (
    <>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto px-2 py-3">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <AnimatedContainer
                key={tab.id}
                animation="fade-in"
                delay={index * 100}
              >
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabClick(tab.id)}
                  hapticFeedback="light"
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 h-auto transition-all duration-300 touch-target min-h-[48px]",
                    "hover:bg-coffee-50 dark:hover:bg-coffee-900/20",
                    isActive && "text-coffee-600 dark:text-coffee-400 bg-coffee-50 dark:bg-coffee-900/20 scale-105"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive && "text-coffee-600 dark:text-coffee-400"
                  )} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </EnhancedButton>
              </AnimatedContainer>
            );
          })}
        </div>
      </div>

      {/* More Menu Sheet */}
      <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-left">Menu</SheetTitle>
            <SheetDescription className="text-left">
              Acesse todas as funcionalidades do app
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 pb-20">
            {Object.entries(groupedItems).map(([category, items]) => (
              <AnimatedContainer key={category} animation="fade-in">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-1">
                  {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <AnimatedContainer
                        key={item.id}
                        animation="slide-up"
                        delay={index * 50}
                      >
                        <EnhancedButton
                          variant="ghost"
                          onClick={() => handleMoreMenuItemClick(item.id)}
                          hapticFeedback="light"
                          className="w-full justify-start h-12 px-4 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 transition-all duration-200 touch-target"
                        >
                          <Icon className="mr-3 h-5 w-5 text-coffee-600 dark:text-coffee-400" />
                          <span className="text-base">{item.label}</span>
                        </EnhancedButton>
                      </AnimatedContainer>
                    );
                  })}
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
