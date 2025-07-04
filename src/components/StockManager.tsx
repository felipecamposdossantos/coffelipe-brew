
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Package, AlertTriangle, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCoffeeBeans } from '@/hooks/useCoffeeBeans';
import { useFilterPapers } from '@/hooks/useFilterPapers';

interface StockItem {
  id: string;
  name: string;
  type: 'coffee' | 'filter';
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

export const StockManager = () => {
  const { coffeeBeans } = useCoffeeBeans();
  const { filterPapers } = useFilterPapers();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  useEffect(() => {
    // Carregar estoque do localStorage
    const savedStock = localStorage.getItem('stockItems');
    if (savedStock) {
      setStockItems(JSON.parse(savedStock));
    } else {
      // Inicializar com grãos e filtros existentes
      const initialStock: StockItem[] = [
        ...coffeeBeans.map(bean => ({
          id: bean.id,
          name: bean.name,
          type: 'coffee' as const,
          currentStock: 250,
          minStock: 50,
          unit: 'g',
          lastUpdated: new Date().toISOString()
        })),
        ...filterPapers.map(paper => ({
          id: paper.id,
          name: paper.name,
          type: 'filter' as const,
          currentStock: 50,
          minStock: 10,
          unit: 'unidades',
          lastUpdated: new Date().toISOString()
        }))
      ];
      setStockItems(initialStock);
    }

    // Carregar lista de compras
    const savedShoppingList = localStorage.getItem('shoppingList');
    if (savedShoppingList) {
      setShoppingList(JSON.parse(savedShoppingList));
    }
  }, [coffeeBeans, filterPapers]);

  const saveStock = (items: StockItem[]) => {
    setStockItems(items);
    localStorage.setItem('stockItems', JSON.stringify(items));
  };

  const updateStock = (id: string, change: number) => {
    const updated = stockItems.map(item => 
      item.id === id 
        ? { 
            ...item, 
            currentStock: Math.max(0, item.currentStock + change),
            lastUpdated: new Date().toISOString()
          }
        : item
    );
    saveStock(updated);
  };

  const setMinStock = (id: string, minStock: number) => {
    const updated = stockItems.map(item =>
      item.id === id ? { ...item, minStock } : item
    );
    saveStock(updated);
  };

  const getLowStockItems = () => {
    return stockItems.filter(item => item.currentStock <= item.minStock);
  };

  const generateShoppingList = () => {
    const lowStock = getLowStockItems();
    const newShoppingList = lowStock.map(item => 
      `${item.name} (${item.type === 'coffee' ? 'Grãos' : 'Filtros'})`
    );
    setShoppingList(newShoppingList);
    localStorage.setItem('shoppingList', JSON.stringify(newShoppingList));
  };

  const getStockPercentage = (item: StockItem) => {
    const maxStock = item.minStock * 5; // Assume 5x o mínimo como máximo
    return Math.min((item.currentStock / maxStock) * 100, 100);
  };

  const getStockColor = (item: StockItem) => {
    if (item.currentStock <= item.minStock) return 'text-red-600';
    if (item.currentStock <= item.minStock * 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Alertas de Estoque Baixo */}
      {getLowStockItems().length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-300">
              <AlertTriangle className="w-5 h-5" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getLowStockItems().map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white dark:bg-red-900/30 rounded">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-red-600 dark:text-red-400">
                    {item.currentStock}{item.unit}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={generateShoppingList} 
              className="w-full mt-4 bg-red-600 hover:bg-red-700"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Gerar Lista de Compras
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Controle de Estoque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Controle de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Grãos de Café */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-coffee-800 dark:text-coffee-200">
                Grãos de Café
              </h3>
              <div className="space-y-4">
                {stockItems.filter(item => item.type === 'coffee').map(item => (
                  <div key={item.id} className="p-4 border border-coffee-200 dark:border-coffee-700 rounded-lg bg-coffee-50 dark:bg-coffee-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className={`font-bold ${getStockColor(item)}`}>
                        {item.currentStock}{item.unit}
                      </span>
                    </div>
                    <Progress 
                      value={getStockPercentage(item)} 
                      className="mb-3 h-2"
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(item.id, -10)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Usar 10g
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(item.id, 250)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Reabastecer
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Label className="text-xs">Estoque mínimo:</Label>
                      <Input
                        type="number"
                        value={item.minStock}
                        onChange={(e) => setMinStock(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 h-6 text-xs"
                      />
                      <span className="text-xs">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-coffee-800 dark:text-coffee-200">
                Filtros de Papel
              </h3>
              <div className="space-y-4">
                {stockItems.filter(item => item.type === 'filter').map(item => (
                  <div key={item.id} className="p-4 border border-coffee-200 dark:border-coffee-700 rounded-lg bg-coffee-50 dark:bg-coffee-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className={`font-bold ${getStockColor(item)}`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                    <Progress 
                      value={getStockPercentage(item)} 
                      className="mb-3 h-2"
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Usar 1
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(item.id, 100)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Reabastecer
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Label className="text-xs">Estoque mínimo:</Label>
                      <Input
                        type="number"
                        value={item.minStock}
                        onChange={(e) => setMinStock(item.id, parseInt(e.target.value) || 0)}
                        className="w-20 h-6 text-xs"
                      />
                      <span className="text-xs">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Compras */}
      {shoppingList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Lista de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shoppingList.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span>{item}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const updated = shoppingList.filter((_, i) => i !== index);
                      setShoppingList(updated);
                      localStorage.setItem('shoppingList', JSON.stringify(updated));
                    }}
                  >
                    Comprado
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
