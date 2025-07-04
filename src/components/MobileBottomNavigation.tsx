
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Coffee, 
  Timer as TimerIcon, 
  User, 
  MoreHorizontal,
  Crown
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
      // Implementar menu mais tarde
      return;
    }
    onTabChange(tabId);
  };

  return (
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
  );
};
