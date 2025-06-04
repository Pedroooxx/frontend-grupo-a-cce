type Props = {
  kills: number;
}
export const KillsTooltipContent = ({ kills }: Props) => {
  return (
    <div>
      <p>Quantidade de jogadores <span className="text-pink-400">adversários</span> eliminados: <span className="text-pink-400">{kills}</span> </p>
    </div>
  );
}