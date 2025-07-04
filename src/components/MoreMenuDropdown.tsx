
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  BarChart3, 
  Lightbulb, 
  Coffee, 
  Filter, 
  History, 
  Settings, 
  Calendar,
  Package,
  TrendingUp,
  Zap,
  Heart
} from 'lucide-react';

interface MoreMenuDropdownProps {
  onMenuSelect: (value: string) => void;
}

export const MoreMenuDropdown = ({ onMenuSelect }: MoreMenuDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs sm:text-sm p-2 sm:p-3 flex items-center gap-1">
          <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Mais</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="end">
        <DropdownMenuLabel>Analytics</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onMenuSelect('analytics')}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics Básico
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuSelect('advanced-analytics')}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Reports Avançados
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>IA e Sugestões</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onMenuSelect('suggestions')}>
          <Lightbulb className="mr-2 h-4 w-4" />
          Sugestões
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuSelect('smart-rec')}>
          <Zap className="mr-2 h-4 w-4" />
          Recomendações IA
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuSelect('comparison')}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Comparar Receitas
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Gerenciamento</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onMenuSelect('coffee-beans')}>
          <Coffee className="mr-2 h-4 w-4" />
          Grãos de Café
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuSelect('filter-papers')}>
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuSelect('stock')}>
          <Package className="mr-2 h-4 w-4" />
          Estoque
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Outros</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onMenuSelect('scheduler')}>
          <Calendar className="mr-2 h-4 w-4" />
          Agenda
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuSelect('history')}>
          <History className="mr-2 h-4 w-4" />
          Histórico
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuSelect('advanced')}>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Apoio</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onMenuSelect('support')}>
          <Heart className="mr-2 h-4 w-4" />
          Apoie o Projeto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
