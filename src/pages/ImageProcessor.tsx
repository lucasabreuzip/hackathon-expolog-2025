import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { removeBackground, loadImage } from '@/lib/removeBackground';
import { toast } from 'sonner';
import { Download, Upload } from 'lucide-react';
import pecemLogo from '@/assets/pecem-logo.png';

export default function ImageProcessor() {
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const processLogo = async () => {
    setProcessing(true);
    toast.info('Processando imagem...', { 
      description: 'Removendo fundo branco da logo. Isso pode levar alguns segundos.' 
    });

    try {
      // Fetch the logo image
      const response = await fetch(pecemLogo);
      const blob = await response.blob();
      
      // Load as image element
      const imageElement = await loadImage(blob);
      
      // Remove background
      const resultBlob = await removeBackground(imageElement);
      
      // Create URL for preview
      const url = URL.createObjectURL(resultBlob);
      setProcessedImage(url);
      
      toast.success('Fundo removido com sucesso!', {
        description: 'Clique em "Baixar" para salvar a logo sem fundo.'
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erro ao processar imagem', {
        description: 'Não foi possível remover o fundo. Tente novamente.'
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'pecem-logo-sem-fundo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download iniciado!');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Processador de Logo - Remover Fundo
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Original */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Logo Original</h2>
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                <img 
                  src={pecemLogo} 
                  alt="Logo original" 
                  className="max-w-full h-auto"
                />
              </div>
            </div>

            {/* Processed */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Logo Processada</h2>
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                {processedImage ? (
                  <img 
                    src={processedImage} 
                    alt="Logo sem fundo" 
                    className="max-w-full h-auto"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Aguardando processamento...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button 
              onClick={processLogo} 
              disabled={processing}
              size="lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              {processing ? 'Processando...' : 'Processar Logo'}
            </Button>

            {processedImage && (
              <Button 
                onClick={downloadImage}
                variant="secondary"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Baixar Logo Processada
              </Button>
            )}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Instruções:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Processar Logo" para remover o fundo branco</li>
              <li>Aguarde alguns segundos enquanto a IA processa a imagem</li>
              <li>Visualize o resultado no painel direito</li>
              <li>Clique em "Baixar" para salvar a logo sem fundo</li>
              <li>Substitua o arquivo em src/assets/pecem-logo.png</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
