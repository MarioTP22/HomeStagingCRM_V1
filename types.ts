export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export interface StyleDefinition {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface GeneratedStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  referenceImages?: UploadedImage[];
}

export type AppView = 'upload' | 'gallery' | 'editor';

export interface CanvasRef {
  exportImageWithDrawing: () => string;
  clearCanvas: () => void;
  undo: () => void;
}
