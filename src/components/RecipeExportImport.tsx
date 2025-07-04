
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileText, Share2 } from 'lucide-react';
import { Recipe } from '@/pages/Index';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { toast } from 'sonner';

export const RecipeExportImport = () => {
  const { userRecipes, saveRecipe } = useUserRecipes();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const exportRecipes = () => {
    if (userRecipes.length === 0) {
      toast.error('Nenhuma receita para exportar');
      return;
    }

    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      recipes: userRecipes,
      metadata: {
        totalRecipes: userRecipes.length,
        exportedBy: 'TimerCoffee Brew'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receitas-cafe-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Receitas exportadas com sucesso!');
    setIsExportOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const importRecipes = async () => {
    if (!importFile) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    try {
      const text = await importFile.text();
      const data = JSON.parse(text);

      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error('Formato de arquivo inválido');
      }

      let successCount = 0;
      let errorCount = 0;

      for (const recipe of data.recipes) {
        try {
          // Gerar novo ID para evitar conflitos
          const newRecipe: Recipe = {
            ...recipe,
            id: crypto.randomUUID(),
          };

          const success = await saveRecipe(newRecipe);
          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error('Erro ao importar receita:', recipe.name, error);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} receita(s) importada(s) com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} receita(s) falharam na importação`);
      }

      setIsImportOpen(false);
      setImportFile(null);
    } catch (error) {
      console.error('Erro ao importar receitas:', error);
      toast.error('Erro ao importar receitas. Verifique o formato do arquivo.');
    }
  };

  const shareRecipe = async (recipe: Recipe) => {
    const shareData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      recipes: [recipe],
      metadata: {
        totalRecipes: 1,
        exportedBy: 'TimerCoffee Brew'
      }
    };

    const shareText = `Receita de Café: ${recipe.name}\n\n${recipe.description}\n\nImporte no TimerCoffee Brew:\n${JSON.stringify(shareData)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receita: ${recipe.name}`,
          text: shareText
        });
        toast.success('Receita compartilhada!');
      } catch (error) {
        // Fallback para clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Receita copiada para a área de transferência!');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Receita copiada para a área de transferência!');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Exportar Receitas */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Receitas</DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Suas Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-coffee-600 dark:text-coffee-400 mb-4">
                {userRecipes.length} receita(s) serão exportadas em formato JSON.
              </p>
              <Button onClick={exportRecipes} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Baixar Receitas
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Importar Receitas */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Receitas</DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Selecionar Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
              />
              {importFile && (
                <p className="text-sm text-coffee-600 dark:text-coffee-400">
                  Arquivo selecionado: {importFile.name}
                </p>
              )}
              <Button onClick={importRecipes} className="w-full" disabled={!importFile}>
                <Upload className="w-4 h-4 mr-2" />
                Importar Receitas
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};
