
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { UserProfile } from "@/components/UserProfile";
import { useState } from "react";

interface MainHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const MainHeader = ({ onMenuClick, showMenuButton = false }: MainHeaderProps) => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-coffee-200 bg-white/80 backdrop-blur-md safe-area-top">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="touch-target p-2 lg:hidden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Coffee className="w-6 h-6 text-coffee-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-coffee-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-coffee-800 leading-tight">
                  TimerCoffee
                </h1>
                <span className="text-xs text-coffee-500 hidden sm:block">
                  Seu assistente de café
                </span>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-2">
            {user ? (
              <UserProfile />
            ) : (
              <Button
                onClick={() => setShowLogin(true)}
                variant="outline"
                size="sm"
                className="touch-target border-coffee-300 text-coffee-700 hover:bg-coffee-50 hover:border-coffee-400 transition-colors"
              >
                <span className="hidden sm:inline">Entrar</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginForm />
      )}
    </header>
  );
};
