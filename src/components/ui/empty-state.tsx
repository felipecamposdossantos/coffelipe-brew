
import { Button } from "@/components/ui/button";
import { Coffee, Plus, Search, Timer, User, Zap } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  variant: 'recipes' | 'my-recipes' | 'history' | 'search' | 'timer' | 'general';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
}

export const EmptyState = ({ variant, title, description, action, className = "" }: EmptyStateProps) => {
  const getDefaultContent = () => {
    switch (variant) {
      case 'recipes':
        return {
          icon: <Coffee className="w-16 h-16 text-coffee-300 dark:text-coffee-600" />,
          title: title || "Nenhuma receita encontrada",
          description: description || "Explore nossas receitas de café ou crie a sua própria receita personalizada.",
        };

      case 'my-recipes':
        return {
          icon: <User className="w-16 h-16 text-coffee-300 dark:text-coffee-600" />,
          title: title || "Suas receitas aparecerão aqui",
          description: description || "Crie sua primeira receita personalizada e comece a experimentar!",
        };

      case 'history':
        return {
          icon: <Timer className="w-16 h-16 text-coffee-300 dark:text-coffee-600" />,
          title: title || "Nenhum preparo registrado",
          description: description || "Seu histórico de preparos aparecerá aqui após usar o timer.",
        };

      case 'search':
        return {
          icon: <Search className="w-16 h-16 text-coffee-300 dark:text-coffee-600" />,
          title: title || "Nenhum resultado encontrado",
          description: description || "Tente usar termos diferentes ou explore nossas receitas.",
        };

      case 'timer':
        return {
          icon: <Zap className="w-16 h-16 text-coffee-300 dark:text-coffee-600" />,
          title: title || "Pronto para começar?",
          description: description || "Selecione uma receita para iniciar o cronômetro de preparo.",
        };

      default:
        return {
          icon: <Coffee className="w-16 h-16 text-coffee-300 dark:text-coffee-600" />,
          title: title || "Nada para mostrar",
          description: description || "Parece que não há conteúdo disponível no momento.",
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="mb-6">
        {content.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {content.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
        {content.description}
      </p>

      {action && (
        <Button
          onClick={action.onClick}
          className="bg-coffee-600 hover:bg-coffee-700 text-white"
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
};
