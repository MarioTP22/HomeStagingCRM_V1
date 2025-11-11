import { GoogleGenAI, Modality } from "@google/genai";
import { UploadedImage, StyleDefinition } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY de Gemini no encontrada. Asegúrate de que esté configurada en las variables de entorno.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const generationModel = 'gemini-2.5-flash-image';

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

export async function generateStyledImage(image: UploadedImage, style: StyleDefinition): Promise<string> {
  try {
    const imagePart = fileToGenerativePart(image.base64, image.mimeType);
    const result = await ai.models.generateContent({
        model: generationModel,
        contents: { parts: [imagePart, { text: style.prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = result.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
      return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }
    throw new Error('No se recibió una imagen en la respuesta.');
  } catch (error) {
    console.error(`Error generando el estilo ${style.name}:`, error);
    throw new Error(`No se pudo generar la imagen para el estilo ${style.name}.`);
  }
}

export async function editImageWithPrompt(
    mainImage: UploadedImage,
    prompt: string,
    referenceImages: UploadedImage[]
): Promise<string> {
    const enhancedPrompt = `
    Edita la imagen principal basándote en la petición del usuario: "${prompt}". 
    Las marcas rojas dibujadas sobre la imagen principal señalan áreas de interés para eliminar o modificar.
    Si se proporcionan imágenes de referencia adicionales, intégralas de forma realista en la escena.
    **Importante**: No modifiques la estructura de la habitación (paredes, suelo, techo, ventanas, puertas). 
    Solo puedes cambiar el mobiliario, los objetos decorativos, las texturas y los colores de dichos objetos. Mantén la perspectiva y el ángulo de la foto original.`;
  
  try {
    const mainImagePart = fileToGenerativePart(mainImage.base64, mainImage.mimeType);
    const referenceParts = referenceImages.map(img => fileToGenerativePart(img.base64, img.mimeType));

    const allParts = [mainImagePart, ...referenceParts, { text: enhancedPrompt }];

    const result = await ai.models.generateContent({
        model: generationModel,
        contents: { parts: allParts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    const firstPart = result.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
      return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }
    throw new Error('No se recibió una imagen en la respuesta de edición.');
  } catch (error) {
    console.error('Error al editar la imagen:', error);
    throw new Error('No se pudo editar la imagen.');
  }
}
