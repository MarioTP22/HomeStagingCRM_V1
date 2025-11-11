import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UploadedImage } from '../types';

interface ChatProps {
    onSendMessage: (message: string, referenceImages: UploadedImage[]) => void;
    isProcessing: boolean;
    error: string | null;
}

// Icons
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const AttachIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const Chat: React.FC<ChatProps> = ({ onSendMessage, isProcessing, error }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [referenceImages, setReferenceImages] = useState<UploadedImage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isProcessing]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if ((inputValue.trim() || referenceImages.length > 0) && !isProcessing) {
            const newUserMessage: ChatMessage = { 
                id: Date.now(), 
                sender: 'user', 
                text: inputValue,
                referenceImages: referenceImages
            };
            setMessages(prev => [...prev, newUserMessage]);
            onSendMessage(inputValue, referenceImages);
            setInputValue('');
            setReferenceImages([]);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && referenceImages.length < 3) { // Limitar a 3 imágenes de referencia
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                if (base64String) {
                    const newImage = { base64: base64String, mimeType: file.type };
                    setReferenceImages(prev => [...prev, newImage]);
                }
            };
            reader.readAsDataURL(file);
        }
        // Limpiar el input para poder subir el mismo archivo de nuevo
        if (event.target) {
            event.target.value = '';
        }
    };

    const removeReferenceImage = (index: number) => {
        setReferenceImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-[70vh] max-h-[800px]">
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Chat de Edición</h3>
                <p className="text-sm text-gray-500">Describe los cambios y/o adjunta imágenes de referencia.</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-xl px-3 py-2 max-w-xs lg:max-w-sm ${msg.sender === 'user' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.referenceImages && msg.referenceImages.length > 0 && (
                                <div className="flex gap-2 mb-2">
                                    {msg.referenceImages.map((img, index) => (
                                        <img key={index} src={`data:${img.mimeType};base64,${img.base64}`} className="w-16 h-16 object-cover rounded-md" />
                                    ))}
                                </div>
                            )}
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isProcessing && (
                    <div className="flex justify-start mb-4">
                        <div className="rounded-xl px-4 py-2 bg-gray-200 text-gray-800">
                           <div className="flex items-center">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75 mr-1"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                           </div>
                        </div>
                    </div>
                )}
                {error && (
                     <div className="flex justify-start mb-4">
                        <div className="rounded-xl px-4 py-2 max-w-xs lg:max-w-sm bg-red-100 text-red-700 border border-red-200">
                           <strong>Error:</strong> {error}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
                {referenceImages.length > 0 && (
                    <div className="flex gap-2 mb-2">
                        {referenceImages.map((img, index) => (
                            <div key={index} className="relative">
                                <img src={`data:${img.mimeType};base64,${img.base64}`} className="w-16 h-16 object-cover rounded-md" />
                                <button onClick={() => removeReferenceImage(index)} className="absolute -top-1 -right-1 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-500">
                                    <CloseIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                    />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 hover:text-blue-500 disabled:text-gray-300" disabled={isProcessing || referenceImages.length >= 3}>
                        <AttachIcon />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ej: usa este sofá"
                        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        disabled={isProcessing}
                    />
                    <button type="submit" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 disabled:bg-gray-300 transition-colors" disabled={isProcessing || (!inputValue.trim() && referenceImages.length === 0)}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
