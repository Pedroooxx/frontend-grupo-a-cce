export const KDATooltipContent = () => {
  return (
    <div className="space-y-1">
      <div className="font-semibold text-yellow-400 mb-2">KDA Ratio Explicado:</div>
      <div><span className="text-green-400">K (Kills):</span> Eliminações de adversários</div>
      <div><span className="text-red-400">D (Deaths):</span> Vezes que foi eliminado</div>
      <div><span className="text-blue-400">A (Assists):</span> Ajudas para eliminar adversários</div>
      <div className="border-t border-gray-600 pt-2 mt-2">
        <span className="text-orange-400">Cálculo:</span> (Kills + Assists) ÷ Deaths
      </div>
      <div className="text-gray-300 text-xs">
        Valores maiores indicam melhor performance
      </div>
    </div>
  );
};
