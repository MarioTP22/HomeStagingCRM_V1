
import React from 'react';
import { GeneratedStyle } from '../types';

interface ImageCardProps {
  style: GeneratedStyle;
  onSelect: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ style, onSelect }) => {
  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
      onClick={onSelect}
    >
      <div className="relative">
        <img src={style.imageUrl} alt={`Estilo ${style.name}`} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{style.name}</h3>
      </div>
    </div>
  );
};

export default ImageCard;
