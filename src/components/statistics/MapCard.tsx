import { MapData } from '@/types/statistics';
import { Tooltip } from '../ui/Tooltip';
import { getMapColor, getLighterColor } from '@/utils/mapColors';
import { useState } from 'react';
import Image from 'next/image';

interface MapCardProps {
  map: MapData;
  imagePath?: string;
}

export const MapCard = ({ map, imagePath }: MapCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const mapColor = getMapColor(map.nome);
  const accentColor = getLighterColor(mapColor);

  const hasValidImage = Boolean(imagePath) && imageLoaded;

  return (
    <div
      className="bg-gray-800/50 rounded-2xl p-6 relative overflow-hidden min-h-[200px] 
                 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:z-10
                 hover:-translate-y-1 cursor-pointer"
      style={{
        // Dynamic hover shadow based on accent color
        boxShadow: `0 10px 25px -5px ${mapColor}30, 0 8px 10px -6px ${mapColor}40`,
        // On hover, increase the shadow and glow
        "--hover-shadow": `0 20px 25px -5px ${mapColor}50, 0 10px 10px -5px ${mapColor}60, 0 0 15px ${accentColor}30`,
      } as React.CSSProperties}
    >
      {/* Background - either image or color */}
      {hasValidImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={imagePath!}
            alt={`${map.nome} map background`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover blur-[1px] brightness-[0.7] scale-110 opacity-60
                       transition-transform duration-500 ease-out group-hover:scale-[1.15]"
            onError={() => setImageLoaded(false)}
            priority
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            backgroundColor: mapColor,
            opacity: 0.7,
          }}
        />
      )}

      {/* Map-themed border accent with animation effect */}
      <div
        className="absolute top-0 left-0 w-full h-1 z-0 transition-all duration-300"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 8px 0px ${accentColor}70`,
        }}
      />

      {/* Animated highlight on hover */}
      <div
        className="absolute inset-x-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-transparent to-transparent
                   opacity-0 transition-all duration-500 ease-out
                   group-hover:opacity-100 group-hover:via-[var(--accent-color)]"
        style={{ "--accent-color": accentColor } as React.CSSProperties}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gray-900/60 z-0 transition-opacity duration-300 hover:bg-gray-900/50"></div>

      {/* Content */}
      <div className="relative z-10">
        <h4
          className="text-lg font-semibold mb-4 flex items-center transition-all duration-300"
          style={{ color: accentColor }}
        >
          <span
            className="w-2 h-2 rounded-full mr-2 transition-all duration-300 ease-out"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 5px ${accentColor}80`
            }}
          ></span>
          {map.nome}
        </h4>
        <div className="space-y-3 font-extrabold text-lg">
          <Tooltip content={`Partidas jogadas no mapa atual: ${map.partidas}`} className="flex justify-between">
            <span className="dashboard-text-muted text-lg">Partidas</span>
            <span className="text-white">{map.partidas}</span>
          </Tooltip>
          <Tooltip content={`Taxa de vitória no mapa: ${map.winRate}`} className="flex justify-between">
            <span className="dashboard-text-muted text-lg">Win Rate</span>
            <span style={{ color: accentColor }}>{map.winRate}</span>
          </Tooltip>
          <Tooltip content={`Média de Pontuação: ${map.avgScore}`} className="flex justify-between">
            <span className="dashboard-text-muted text-lg">Avg. Score</span>
            <span className="text-blue-400">{map.avgScore}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
