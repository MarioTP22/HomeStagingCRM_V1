
import React, { useState, useRef } from 'react';
import { UploadedImage } from '../types';
import { Spinner } from './Spinner';

interface UploadScreenProps {
  onImageUpload: (image: UploadedImage) => void;
  error: string | null;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUpload, error }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const processFile = (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        onImageUpload({ base64: base64String, mimeType: file.type });
      } else {
        setIsUploading(false);
        // Manejar error de lectura
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      // Manejar error de lectura
    };
    reader.readAsDataURL(file);
  }

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center flex flex-col items-center justify-center pt-16">
        <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Transforma tu Espacio con IA</h2>
            <p className="text-gray-600 mb-8 text-lg">
                Sube una foto de cualquier habitación y descubre su potencial. Generaremos 7 estilos de decoración para que encuentres tu inspiración.
            </p>
        </div>

      <div
        className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-blue-400 transition-colors duration-300 bg-white"
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Procesando imagen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <UploadIcon />
            <p className="mt-4 text-lg font-semibold text-gray-700">Haz clic para subir una foto</p>
            <p className="text-sm text-gray-500 mt-1">O arrastra y suelta el archivo aquí</p>
            <p className="text-xs text-gray-400 mt-4">Formatos soportados: JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;
