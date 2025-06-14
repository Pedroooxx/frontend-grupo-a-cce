import { useState, useEffect } from 'react';
import { MapData } from '@/types/data-types';

/**
 * Hook that provides image paths for maps
 */
export function useMapImages(maps: MapData[]) {
  const [validImagePaths, setValidImagePaths] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true); // Keep isLoading as MapPerformanceCard needs it

  useEffect(() => {
    setIsLoading(true);
    const imagePaths: Record<string, string> = {};
    
    for (const map of maps) {
      const mapName = map.nome;
      // Set direct path to the image in public/maps folder
      imagePaths[mapName] = `/maps/${mapName}.png`;
    }
    
    setValidImagePaths(imagePaths);
    setIsLoading(false);
  }, [maps]);

  return { validImagePaths, isLoading };
}
