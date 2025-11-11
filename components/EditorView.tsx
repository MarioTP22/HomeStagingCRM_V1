import React, { useState, useCallback, useRef } from 'react';
import { GeneratedStyle, UploadedImage, CanvasRef } from '../types';
import Chat from './Chat';
import { editImageWithPrompt } from '../services/geminiService';
import DrawingCanvas from './DrawingCanvas';

interface EditorViewProps {
  style: GeneratedStyle;
  onBack: () => void;
}

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 10v4a2 2 0 002 2h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l-1.414-1.414a2 2 0 010-2.828L3 4.343M18 20v-4a2 2 0 00-2-2h-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 20l1.414 1.414a2 2 0 000-2.828L18 17.172" />
    </svg>
);
const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const EditorView: React.FC<EditorViewProps> = ({ style, onBack }) => {
  const [currentImage, setCurrentImage] = useState<string>(style.imageUrl);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<CanvasRef>(null);

  const handleDownload = () => {
    const imageToDownload = canvasRef.current?.exportImageWithDrawing() || currentImage;
    const link = document.createElement('a');
    link.href = imageToDownload;
    link.download = `HomeStagingCRM-${style.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const base64ToUploadedImage = (dataUrl: string): UploadedImage => {
    const [header, base64] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    return { base64, mimeType };
  };

  const handleEditRequest = useCallback(async (prompt: string, referenceImages: UploadedImage[]) => {
    setIsEditing(true);
    setError(null);
    try {
        const imageWithDrawing = canvasRef.current?.exportImageWithDrawing();
        if (!imageWithDrawing) {
            throw new Error("No se pudo obtener la imagen del canvas.");
        }
        const imageToEdit = base64ToUploadedImage(imageWithDrawing);
        const newImageUrl = await editImageWithPrompt(imageToEdit, prompt, referenceImages);
        setCurrentImage(newImageUrl);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo generar la edición.');
    } finally {
        setIsEditing(false);
    }
  }, [currentImage]);

  return (
    <div className="animate-fade-in">
        <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 mb-6 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
            <BackIcon />
            Volver a la galería
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Columna de la imagen y canvas */}
            <div className="lg:w-2/3">
                <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg relative">
                    <DrawingCanvas ref={canvasRef} imageUrl={currentImage} brushColor="#ef4444" brushSize={5} />
                    <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-2">
                        <button onClick={() => canvasRef.current?.undo()} className="p-2 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition" aria-label="Deshacer dibujo"><UndoIcon /></button>
                        <button onClick={() => canvasRef.current?.clearCanvas()} className="p-2 bg-white/80 rounded-full shadow-md hover:bg-gray-200 transition" aria-label="Limpiar dibujo"><ClearIcon/></button>
                    </div>
                </div>
                <div className="mt-6 text-center lg:text-left">
                    <h2 className="text-4xl font-bold text-gray-800">{style.name}</h2>
                    <p className="text-gray-600 mt-2 max-w-2xl">{style.description}</p>
                    <button
                        onClick={handleDownload}
                        className="mt-6 inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                    >
                        <DownloadIcon />
                        Descargar Imagen
                    </button>
                </div>
            </div>

            {/* Columna del chat */}
            <div className="lg:w-1/3">
                <Chat 
                    onSendMessage={handleEditRequest} 
                    isProcessing={isEditing}
                    error={error}
                />
            </div>
        </div>
    </div>
  );
};

export default EditorView;
