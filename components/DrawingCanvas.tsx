import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { CanvasRef } from '../types';

interface DrawingCanvasProps {
  imageUrl: string;
  brushColor?: string;
  brushSize?: number;
}

const DrawingCanvas = forwardRef<CanvasRef, DrawingCanvasProps>(({
  imageUrl,
  brushColor = '#ef4444', // Red-500
  brushSize = 5,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const loadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    contextRef.current = context;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    image.onload = () => {
      // Scale canvas to fit container while maintaining aspect ratio
      const container = canvas.parentElement;
      if (container) {
          const { width, height } = container.getBoundingClientRect();
          const aspectRatio = image.width / image.height;
          if (width / aspectRatio <= height) {
              canvas.width = width;
              canvas.height = width / aspectRatio;
          } else {
              canvas.height = height;
              canvas.width = height * aspectRatio;
          }
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      setHistory([]);
      saveState();
    };
  };

  useEffect(() => {
    loadImage();
    window.addEventListener('resize', loadImage);
    return () => window.removeEventListener('resize', loadImage);
  }, [imageUrl]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev, imageData]);
  };
  
  const restoreState = (state: ImageData) => {
    const context = contextRef.current;
    if (!context) return;
    context.putImageData(state, 0, 0);
  };

  const getCoords = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (event instanceof MouseEvent) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    } else if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else {
        return null;
    }
    return { x, y };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoords(event.nativeEvent);
    if (!coords) return;
    const { x, y } = coords;
    
    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(x, y);
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    setIsDrawing(true);
    event.preventDefault();
  };

  const finishDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const context = contextRef.current;
    if (!context || !isDrawing) return;
    context.closePath();
    setIsDrawing(false);
    saveState();
    event.preventDefault();
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoords(event.nativeEvent);
    if (!coords) return;
    const { x, y } = coords;
    
    const context = contextRef.current;
    if (!context) return;
    
    context.lineTo(x, y);
    context.stroke();
    event.preventDefault();
  };

  useImperativeHandle(ref, () => ({
    exportImageWithDrawing: () => {
      return canvasRef.current?.toDataURL('image/png') || '';
    },
    clearCanvas: () => {
      if (history.length > 1) {
        restoreState(history[0]);
        setHistory([history[0]]);
      }
    },
    undo: () => {
      if (history.length > 1) {
        const newHistory = history.slice(0, -1);
        restoreState(newHistory[newHistory.length - 1]);
        setHistory(newHistory);
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
      onTouchStart={startDrawing}
      onTouchEnd={finishDrawing}
      onTouchMove={draw}
      className="w-full rounded-lg object-contain cursor-crosshair"
    />
  );
});

export default DrawingCanvas;
