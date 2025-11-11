
import React from 'react';
import { GeneratedStyle } from '../types';
import ImageCard from './ImageCard';
import { Spinner } from './Spinner';

interface GalleryViewProps {
  styles: GeneratedStyle[];
  isLoading: boolean;
  loadingMessage: string;
  onSelectStyle: (style: GeneratedStyle) => void;
  onReset: () => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ styles, isLoading, loadingMessage, onSelectStyle, onReset }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center pt-16">
        <Spinner />
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Estamos creando magia...</h2>
        <p className="text-gray-500 mt-2">{loadingMessage || 'Esto puede tardar unos momentos.'}</p>
      </div>
    );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Galería de Estilos</h2>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
            >
              Subir otra foto
            </button>
        </div>
        <p className="text-gray-600 mb-8">Haz clic en cualquier imagen para verla en detalle, editarla y descargarla.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {styles.map((style) => (
            <ImageCard key={style.id} style={style} onSelect={() => onSelectStyle(style)} />
            ))}
        </div>
    </div>
  );
};

export default GalleryView;
