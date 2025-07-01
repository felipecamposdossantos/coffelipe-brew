
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useFilterPapers, FilterPaper } from '@/hooks/useFilterPapers';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const FilterPapersManager = () => {
  const { filterPapers, loading, saveFilterPaper, updateFilterPaper, deleteFilterPaper } = useFilterPapers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFilterPaper, setEditingFilterPaper] = useState<FilterPaper | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      notes: ''
    });
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim()) {
      toast.error('Nome, marca e modelo são obrigatórios');
      return;
    }

    const success = await saveFilterPaper(formData);
    if (success) {
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (filterPaper: FilterPaper) => {
    setEditingFilterPaper(filterPaper);
    setFormData({
      name: filterPaper.name,
      brand: filterPaper.brand,
      model: filterPaper.model,
      notes: filterPaper.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingFilterPaper) return;
    
    if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim()) {
      toast.error('Nome, marca e modelo são obrigatórios');
      return;
    }

    const success = await updateFilterPaper(editingFilterPaper.id, formData);
    if (success) {
      resetForm();
      setIsEditDialogOpen(false);
      setEditingFilterPaper(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteFilterPaper(id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Papéis de Filtro</h2>
          <p className="text-coffee-600">Carregando seus papéis de filtro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Papéis de Filtro</h2>
        <p className="text-coffee-600 text-sm sm:text-base">
          Gerencie seus papéis de filtro e use nas suas receitas
        </p>
      </div>

      <div className="flex justify-center">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-coffee-600 hover:bg-coffee-700 text-white"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Papel de Filtro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle>Adicionar Papel de Filtro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: V60 Branco"
                />
              </div>
              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ex: Hario"
                />
              </div>
              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ex: VCF-02-100W"
                />
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas sobre o papel de filtro..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAdd} className="bg-coffee-600 hover:bg-coffee-700">
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filterPapers.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 mx-auto text-coffee-300 mb-4" />
          <p className="text-coffee-600 text-lg mb-2">Nenhum papel de filtro cadastrado</p>
          <p className="text-coffee-400 text-sm">
            Adicione seus papéis de filtro para usar nas suas receitas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filterPapers.map((filterPaper) => (
            <Card key={filterPaper.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-coffee-200">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-start justify-between text-coffee-800 gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base leading-tight">{filterPaper.name}</h3>
                    <p className="text-xs sm:text-sm text-coffee-600 font-normal">
                      {filterPaper.brand} - {filterPaper.model}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(filterPaper)}
                      className="text-coffee-600 hover:text-coffee-700 h-8 w-8 p-0"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4 sm:mx-0">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Papel de Filtro</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{filterPaper.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(filterPaper.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              {filterPaper.notes && (
                <CardContent className="pt-0">
                  <p className="text-xs sm:text-sm text-coffee-600 bg-coffee-50 p-2 rounded">
                    {filterPaper.notes}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle>Editar Papel de Filtro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: V60 Branco"
              />
            </div>
            <div>
              <Label htmlFor="edit-brand">Marca *</Label>
              <Input
                id="edit-brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ex: Hario"
              />
            </div>
            <div>
              <Label htmlFor="edit-model">Modelo *</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ex: VCF-02-100W"
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas sobre o papel de filtro..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} className="bg-coffee-600 hover:bg-coffee-700">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
