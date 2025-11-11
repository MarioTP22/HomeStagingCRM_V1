
import React, { useState, useCallback } from 'react';
import { AppView, UploadedImage, GeneratedStyle } from './types';
import { STYLES } from './constants';
import { generateStyledImage } from './services/geminiService';
import Header from './components/Header';
import UploadScreen from './components/UploadScreen';
import GalleryView from './components/GalleryView';
import EditorView from './components/EditorView';

function App() {
  const [view, setView] = useState<AppView>('upload');
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
  const [generatedStyles, setGeneratedStyles] = useState<GeneratedStyle[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<GeneratedStyle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (image: UploadedImage) => {
    setOriginalImage(image);
    setView('gallery');
    setIsLoading(true);
    setError(null);
    setGeneratedStyles([]);

    try {
      const promises = STYLES.map(async (style) => {
        setLoadingMessage(`Generando estilo ${style.name}...`);
        const imageUrl = await generateStyledImage(image, style);
        return {
          id: style.id,
          name: style.name,
          description: style.description,
          imageUrl,
        };
      });
      
      const results = await Promise.all(promises);
      setGeneratedStyles(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
      setView('upload'); // Regresar a la pantalla de carga si hay error
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleSelectStyle = (style: GeneratedStyle) => {
    setSelectedStyle(style);
    setView('editor');
  };

  const handleBackToGallery = () => {
    setSelectedStyle(null);
    setView('gallery');
  };
  
  const handleReset = () => {
    setView('upload');
    setOriginalImage(null);
    setGeneratedStyles([]);
    setSelectedStyle(null);
    setError(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'upload':
        return <UploadScreen onImageUpload={handleImageUpload} error={error} />;
      case 'gallery':
        return (
          <GalleryView
            styles={generatedStyles}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            onSelectStyle={handleSelectStyle}
            onReset={handleReset}
          />
        );
      case 'editor':
        if (selectedStyle) {
          return <EditorView style={selectedStyle} onBack={handleBackToGallery} />;
        }
        return null; // O un fallback
      default:
        return <UploadScreen onImageUpload={handleImageUpload} error={error} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header onLogoClick={view !== 'upload' ? handleReset : undefined} />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
