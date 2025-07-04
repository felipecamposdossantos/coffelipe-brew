
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      { id: 'advanced', icon: Settings, label: 'Configurações', category: 'Outros' }
    ] : [
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
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 h-auto",
                  isActive && "text-coffee-600 dark:text-coffee-400"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && "text-coffee-600 dark:text-coffee-400"
                )} />
                <span className="text-xs">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* More Menu Sheet */}
      <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-left">Menu</SheetTitle>
            <SheetDescription className="text-left">
              Acesse todas as funcionalidades do app
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 overflow-y-auto h-full pb-20">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => handleMoreMenuItemClick(item.id)}
                        className="w-full justify-start h-12 px-4 hover:bg-coffee-50 dark:hover:bg-coffee-900/20"
                      >
                        <Icon className="mr-3 h-5 w-5 text-coffee-600 dark:text-coffee-400" />
                        <span className="text-base">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
