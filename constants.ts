
import { StyleDefinition } from './types';

const PROMPT_SUFFIX = `
**Importante**: No modifiques la estructura de la habitación (paredes, suelo, techo, ventanas, puertas). 
Solo puedes cambiar el mobiliario, los objetos decorativos, las texturas y los colores de dichos objetos para que coincidan con el estilo solicitado. Mantén la perspectiva y el ángulo de la foto original.`;

export const STYLES: StyleDefinition[] = [
  {
    id: 'minimalista',
    name: 'Minimalista',
    description: 'Se enfoca en la simplicidad, líneas limpias y una paleta monocromática con colores neutros. Menos es más, cada pieza es funcional y esencial.',
    prompt: `Redecora esta habitación con un estilo minimalista. Usa una paleta de colores neutros, muebles con líneas simples y elimina cualquier desorden. ${PROMPT_SUFFIX}`,
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Inspirado en almacenes y fábricas, destaca por sus materiales crudos como ladrillo visto, metal y madera sin tratar. Espacios abiertos y elementos estructurales a la vista.',
    prompt: `Transforma esta habitación a un estilo industrial. Incorpora elementos como paredes de ladrillo visto, conductos de metal, madera rústica y mobiliario funcional de acero. ${PROMPT_SUFFIX}`,
  },
  {
    id: 'rustico',
    name: 'Rústico',
    description: 'Evoca la calidez del campo con materiales naturales como madera, piedra y fibras orgánicas. Promueve un ambiente acogedor y conectado con la naturaleza.',
    prompt: `Dale a esta habitación un toque rústico. Utiliza mucha madera natural, textiles cálidos como lana o lino, y una paleta de colores terrosos. ${PROMPT_SUFFIX}`,
  },
  {
    id: 'clasico',
    name: 'Clásico',
    description: 'Orden, simetría y elegancia definen este estilo. Muebles ornamentados, telas lujosas como el terciopelo y detalles decorativos refinados son sus claves.',
    prompt: `Rediseña esta habitación con un estilo clásico. Introduce muebles elegantes con detalles tallados, cortinas pesadas, una paleta de colores sofisticada y accesorios ornamentales. ${PROMPT_SUFFIX}`,
  },
  {
    id: 'mediterraneo',
    name: 'Mediterráneo',
    description: 'Fresco y luminoso, inspirado en las costas del Mediterráneo. Predominan el blanco, tonos de azul y materiales naturales como la madera clara y el mimbre.',
    prompt: `Aplica un estilo mediterráneo a esta habitación. Usa una base blanca, acentos en tonos azules y turquesas, muebles de madera clara y textiles ligeros. ${PROMPT_SUFFIX}`,
  },
  {
    id: 'eclectico',
    name: 'Ecléctico',
    description: 'Una mezcla armoniosa de diferentes estilos, épocas y culturas. Se basa en la creatividad y la cohesión a través del color, la textura y la forma para crear un look único.',
    prompt: `Crea una versión ecléctica de esta habitación. Combina muebles de diferentes épocas, mezcla texturas y patrones atrevidos, y usa el color para unificar el espacio. ${PROMPT_SUFFIX}`,
  },
  {
    id: 'bohemio',
    name: 'Bohemio',
    description: 'Relajado y libre, este estilo incorpora texturas naturales, patrones étnicos, plantas y objetos de viajes. Es un reflejo de un espíritu aventurero y artístico.',
    prompt: `Transforma esta habitación en un espacio bohemio. Añade muchas plantas, textiles con patrones étnicos, muebles de materiales naturales como ratán y una mezcla de colores vibrantes y terrosos. ${PROMPT_SUFFIX}`,
  },
];
