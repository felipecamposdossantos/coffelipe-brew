
import { Coffee, Timer, User, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileBottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const MobileBottomNavigation = ({ 
  currentTab, 
  onTabChange,
  className 
}: MobileBottomNavigationProps) => {
  const tabs = [
    { id: "recipes", label: "Receitas", icon: Coffee },
    { id: "timer", label: "Timer", icon: Timer },
    { id: "my-recipes", label: "Minhas", icon: BookOpen },
    { id: "history", label: "Histórico", icon: BarChart3 },
    { id: "profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-coffee-200 safe-area-bottom z-40",
      className
    )}>
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "touch-target flex flex-col items-center gap-1 px-2 py-2 transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "text-coffee-700 bg-coffee-50 border-coffee-200" 
                  : "text-coffee-400 hover:text-coffee-600 hover:bg-coffee-50/50"
              )}
            >
              <Icon className={cn(
                "transition-all duration-200",
                isActive ? "w-5 h-5" : "w-4 h-4"
              )} />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "text-coffee-700" : "text-coffee-500"
              )}>
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-coffee-600 rounded-b-full"></div>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
