import React, { useState } from 'react';
import { generateCaption, generateCreative } from './services/geminiService';
import { ImageUpload } from './components/ImageUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingState, Language } from './types';
import { Sparkles, Command, Info, Globe, Palette } from 'lucide-react';

const TRANSLATIONS = {
  pt: {
    title: 'SocialCaption AI',
    subtitle: 'Transforme suas ideias em posts virais. Crie legendas perfeitas e gere imagens inovadoras com IA.',
    poweredBy: 'Desenvolvido com Gemini 2.5',
    inputSection: {
      imageTitle: '1. Imagem de Referência (Opcional)',
      imageDragDrop: 'Clique para carregar ou arraste e solte',
      imageFormats: 'Suporta JPG, PNG, WEBP',
      imageChange: 'Alterar Imagem',
      briefingTitle: '2. Briefing da Legenda',
      briefingPlaceholder: 'Ex: Lançamos nosso novo blend de café hoje! Tem notas de chocolate e frutas vermelhas.',
      creativeTitle: '3. Briefing do Criativo (Gerar Imagem)',
      creativePlaceholder: 'Ex: Uma xícara de café fumegante em uma mesa de madeira rústica, iluminação dourada da manhã, estilo minimalista e aconchegante.',
      briefingHelp: 'Seja específico para melhores resultados',
      buttonGenerate: 'Gerar Conteúdo',
      buttonProcessing: 'Criando Mágica...',
    },
    resultSection: {
      idleTitle: 'Seu conteúdo gerado aparecerá aqui.',
      idleSubtitle: 'Pronto para criar?',
      loadingTitle: 'A IA está trabalhando...',
      loadingSubtitle: 'Escrevendo legenda e gerando imagem',
      errorTitle: 'Algo deu errado.',
      errorButton: 'Tentar Novamente',
      resultTitle: 'Conteúdo Gerado',
      copy: 'Copiar Legenda',
      copied: 'Copiado',
      downloadImage: 'Baixar Criativo',
      badgeEngagement: 'Engajamento',
      badgeSeo: 'SEO',
      badgeViral: 'Viral',
    }
  },
  en: {
    title: 'SocialCaption AI',
    subtitle: 'Turn ideas into viral posts. Craft perfect captions and generate innovative images with AI.',
    poweredBy: 'Powered by Gemini 2.5',
    inputSection: {
      imageTitle: '1. Reference Image (Optional)',
      imageDragDrop: 'Click to upload or drag & drop',
      imageFormats: 'Supports JPG, PNG, WEBP',
      imageChange: 'Change Image',
      briefingTitle: '2. Caption Briefing',
      briefingPlaceholder: 'Ex: Launched our new coffee blend today! It has notes of chocolate and berries.',
      creativeTitle: '3. Creative Briefing (Generate Image)',
      creativePlaceholder: 'Ex: A steaming cup of coffee on a rustic wooden table, golden morning lighting, minimalist and cozy style.',
      briefingHelp: 'Be specific for better results',
      buttonGenerate: 'Generate Content',
      buttonProcessing: 'Creating Magic...',
    },
    resultSection: {
      idleTitle: 'Your generated content will appear here.',
      idleSubtitle: 'Ready to create?',
      loadingTitle: 'AI is working...',
      loadingSubtitle: 'Writing caption and generating image',
      errorTitle: 'Something went wrong.',
      errorButton: 'Try Again',
      resultTitle: 'Generated Content',
      copy: 'Copy Caption',
      copied: 'Copied',
      downloadImage: 'Download Creative',
      badgeEngagement: 'Engagement',
      badgeSeo: 'SEO',
      badgeViral: 'Viral',
    }
  }
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('pt');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [briefing, setBriefing] = useState<string>('');
  const [creativeBriefing, setCreativeBriefing] = useState<string>('');
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);

  const t = TRANSLATIONS[language];

  const handleGenerate = async () => {
    if (!briefing && !creativeBriefing) return;

    setLoadingState(LoadingState.LOADING);
    setGeneratedCaption('');
    setGeneratedImage(null);

    try {
      const defaultBriefing = language === 'pt' ? "Uma postagem incrível." : "An amazing post.";
      const finalBriefing = briefing.trim() || defaultBriefing;

      const promises: Promise<any>[] = [];

      // Always generate caption if there is a briefing OR an image
      if (finalBriefing) {
        promises.push(
          generateCaption(selectedImage, finalBriefing, language)
            .then(text => setGeneratedCaption(text))
        );
      }

      // Generate Creative if creative briefing is present
      // Pass selectedImage to ensure style matching
      if (creativeBriefing.trim()) {
        promises.push(
          generateCreative(creativeBriefing, language, selectedImage)
            .then(img => setGeneratedImage(img))
        );
      }

      await Promise.all(promises);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const isFormValid = briefing.trim().length > 0 || creativeBriefing.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <header className="mb-10 sm:flex items-start justify-between border-b border-slate-800 pb-6">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight flex items-center justify-center sm:justify-start gap-3">
              <Command className="text-indigo-400" size={36} />
              {t.title}
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto sm:mx-0">
              {t.subtitle}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-end gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
               <button 
                 onClick={() => setLanguage('pt')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${language === 'pt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 PT
               </button>
               <button 
                 onClick={() => setLanguage('en')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 EN
               </button>
            </div>

            <span className="inline-flex items-center rounded-full bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
               {t.poweredBy}
            </span>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Input */}
          <section className="space-y-8">
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-lg space-y-6">
              
              {/* Image Upload */}
              <ImageUpload 
                selectedImage={selectedImage} 
                onImageSelect={setSelectedImage} 
                labels={{
                  title: t.inputSection.imageTitle,
                  dragDrop: t.inputSection.imageDragDrop,
                  formats: t.inputSection.imageFormats,
                  change: t.inputSection.imageChange
                }}
              />

              {/* Caption Briefing */}
              <div className="space-y-2">
                <label htmlFor="briefing" className="block text-sm font-medium text-slate-300">
                  {t.inputSection.briefingTitle}
                </label>
                <div className="relative">
                  <textarea
                    id="briefing"
                    rows={3}
                    className="block w-full rounded-xl border-0 bg-slate-800 py-3 px-4 text-slate-200 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 resize-none transition-all"
                    placeholder={t.inputSection.briefingPlaceholder}
                    value={briefing}
                    onChange={(e) => setBriefing(e.target.value)}
                  />
                </div>
              </div>

              {/* Creative Briefing */}
              <div className="space-y-2 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Palette size={16} className="text-purple-400" />
                  <label htmlFor="creativeBriefing" className="block text-sm font-medium text-purple-200">
                    {t.inputSection.creativeTitle}
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="creativeBriefing"
                    rows={3}
                    className="block w-full rounded-xl border-0 bg-slate-800 py-3 px-4 text-slate-200 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 resize-none transition-all"
                    placeholder={t.inputSection.creativePlaceholder}
                    value={creativeBriefing}
                    onChange={(e) => setCreativeBriefing(e.target.value)}
                  />
                  <div className="absolute bottom-2 right-2">
                     <Info size={14} className="text-slate-500 hover:text-slate-400 cursor-help" title={t.inputSection.briefingHelp} />
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-6 z-20">
              <button
                onClick={handleGenerate}
                disabled={!isFormValid || loadingState === LoadingState.LOADING}
                className={`w-full group relative flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300
                  ${!isFormValid 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                    : loadingState === LoadingState.LOADING
                      ? 'bg-indigo-600 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:scale-[1.02] hover:shadow-indigo-500/25 border border-indigo-500/50'
                  }`}
              >
                {loadingState === LoadingState.LOADING ? (
                   <>{t.inputSection.buttonProcessing}</>
                ) : (
                  <>
                    <Sparkles size={20} className={isFormValid ? "animate-pulse" : ""} />
                    {t.inputSection.buttonGenerate}
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Right Column: Output */}
          <section className="min-h-[400px] lg:h-[calc(100vh-12rem)] sticky top-6">
            <ResultDisplay 
              caption={generatedCaption}
              generatedImage={generatedImage} 
              loadingState={loadingState}
              onRetry={handleGenerate}
              labels={t.resultSection}
            />
          </section>

        </main>
      </div>
    </div>
  );
};

export default App;