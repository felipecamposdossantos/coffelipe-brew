
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Coffee, Trash2, X } from 'lucide-react';
import { useCoffeeBeans } from '@/hooks/useCoffeeBeans';
import { useAuth } from '@/contexts/AuthContext';

export const CoffeeBeansManager = () => {
  const { user } = useAuth();
  const { coffeeBeans, loading, saveCoffeeBean, deleteCoffeeBean } = useCoffeeBeans();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: '',
    notes: ''
  });

  const coffeeTypes = [
    'Arábica',
    'Robusta',
    'Blend Arábica/Robusta',
    'Geisha',
    'Bourbon',
    'Catuaí',
    'Mundo Novo',
    'Typica',
    'Caturra'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.brand.trim() || !formData.type.trim()) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const success = await saveCoffeeBean(formData);
    if (success) {
      setFormData({ name: '', brand: '', type: '', notes: '' });
      setShowAddForm(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-6">
        <Coffee className="w-12 h-12 mx-auto text-coffee-400 mb-4" />
        <p className="text-coffee-600">Faça login para gerenciar seus grãos de café</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-coffee-800">Meus Grãos de Café</h2>
          <p className="text-coffee-600">Gerencie sua coleção de grãos de café</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-coffee-600 hover:bg-coffee-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Grão
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-coffee-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-coffee-800">Adicionar Novo Grão</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Receita *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Café da Manhã Especial"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Marca/Torrefação *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ex: Café Especial XYZ"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="type">Tipo do Café *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {coffeeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notas de Degustação</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Notas de chocolate, caramelo, acidez cítrica..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-coffee-600 hover:bg-coffee-700">
                  Salvar Grão
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center p-6">
          <p className="text-coffee-600">Carregando grãos...</p>
        </div>
      ) : coffeeBeans.length === 0 ? (
        <div className="text-center p-6">
          <Coffee className="w-12 h-12 mx-auto text-coffee-400 mb-4" />
          <p className="text-coffee-600">Nenhum grão cadastrado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coffeeBeans.map((bean) => (
            <Card key={bean.id} className="border-coffee-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-coffee-800">{bean.name}</CardTitle>
                    <p className="text-sm text-coffee-600">{bean.brand}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCoffeeBean(bean.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-coffee-600" />
                    <span className="text-sm font-medium">{bean.type}</span>
                  </div>
                  {bean.notes && (
                    <p className="text-sm text-coffee-600">{bean.notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
