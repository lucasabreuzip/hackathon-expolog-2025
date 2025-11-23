import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Type,
  Contrast,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  Eye,
  X,
  Settings,
  Hand
} from 'lucide-react';

export const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedContrast = localStorage.getItem('accessibility-high-contrast');

    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }

    if (savedContrast === 'true') {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('accessibility-font-size', newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('accessibility-font-size', newSize.toString());
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = '100%';
    localStorage.setItem('accessibility-font-size', '100');
  };

  const toggleHighContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);

    if (newContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('accessibility-high-contrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('accessibility-high-contrast', 'false');
    }
  };

  const toggleTextToSpeech = () => {
    setTextToSpeech(!textToSpeech);

    if (!textToSpeech) {
      // Enable text selection for speech
      document.body.style.userSelect = 'text';
      document.addEventListener('mouseup', handleTextSelection);
    } else {
      document.body.style.userSelect = '';
      document.removeEventListener('mouseup', handleTextSelection);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      speakText(text);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const openVLibras = () => {
    // Trigger VLibras widget
    const vlibrasButton = document.querySelector('[vw-access-button]') as HTMLElement;
    if (vlibrasButton) {
      vlibrasButton.click();
    }
  };

  return (
    <>
      {/* Fixed Buttons on Left Side */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {/* Accessibility Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-r-lg rounded-l-none h-12 w-12 bg-[#1e40af] hover:bg-[#1e3a8a] shadow-lg text-white"
                aria-label="Abrir menu de acessibilidade"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Settings className="h-6 w-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Recursos de Acessibilidade</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* VLibras Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={openVLibras}
                className="rounded-r-lg rounded-l-none h-12 w-12 bg-[#1e40af] hover:bg-[#1e3a8a] shadow-lg text-white"
                aria-label="Abrir VLibras - Tradução em LIBRAS"
              >
                <Hand className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>LIBRAS (VLibras)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 ml-12">
          <div className="bg-card border border-border rounded-r-lg shadow-2xl p-4 w-64">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Acessibilidade
            </h3>

            <div className="space-y-3">
              {/* Font Size Controls */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-2">
                  <Type className="h-3 w-3" />
                  Tamanho do Texto
                </label>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={decreaseFontSize}
                          disabled={fontSize <= 80}
                          aria-label="Diminuir tamanho do texto"
                        >
                          <ZoomOut className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Diminuir texto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <span className="text-xs flex-1 text-center font-medium">
                    {fontSize}%
                  </span>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={increaseFontSize}
                          disabled={fontSize >= 150}
                          aria-label="Aumentar tamanho do texto"
                        >
                          <ZoomIn className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Aumentar texto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetFontSize}
                          aria-label="Resetar tamanho do texto"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Resetar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* High Contrast */}
              <div className="pt-2 border-t">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={highContrast ? 'default' : 'outline'}
                        size="sm"
                        onClick={toggleHighContrast}
                        className="w-full justify-start"
                        aria-label="Alternar alto contraste"
                      >
                        <Contrast className="h-3 w-3 mr-2" />
                        <span className="text-xs">Alto Contraste</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Ativar/desativar alto contraste</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Text to Speech */}
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={textToSpeech ? 'default' : 'outline'}
                        size="sm"
                        onClick={toggleTextToSpeech}
                        className="w-full justify-start"
                        aria-label="Alternar leitura de texto"
                      >
                        <Volume2 className="h-3 w-3 mr-2" />
                        <span className="text-xs">Leitura de Texto</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Selecione texto para ouvir</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Screen Reader Guide */}
              <div className="pt-2 border-t">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          speakText(
                            'Esta plataforma está otimizada para leitores de tela. Use as teclas de atalho do seu leitor de tela para navegar pelos elementos da página.'
                          );
                        }}
                        aria-label="Guia de leitor de tela"
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        <span className="text-xs">Leitor de Tela</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Guia para leitores de tela</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
              <p>
                Plataforma acessível conforme WCAG 2.1 AA
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
