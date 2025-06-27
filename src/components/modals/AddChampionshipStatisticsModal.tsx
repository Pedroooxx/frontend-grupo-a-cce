import { Modal } from '@/components/ui/modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChampionshipStatisticInput, championshipStatisticSchema } from '@/types/championship';

interface AddChampionshipStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChampionshipStatisticInput) => Promise<void>;
}

const AddChampionshipStatisticsModal = ({ isOpen, onClose, onSubmit }: AddChampionshipStatisticsModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChampionshipStatisticInput>({
    resolver: zodResolver(championshipStatisticSchema),
  });

  const handleFormSubmit = async (data: ChampionshipStatisticInput) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting championship statistics:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="bg-slate-900 border-slate-700 text-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-center">Adicionar Estatísticas do Campeonato</h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Preencha os campos abaixo para adicionar estatísticas ao campeonato.
        </p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="kills" className="text-slate-300">Kills</label>
              <input
                id="kills"
                type="number"
                placeholder="Digite o número de kills"
                {...register('kills', { required: 'Kills são obrigatórios' })}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.kills ? 'kills-error' : undefined}
              />
              {errors.kills && (
                <p id="kills-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.kills.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="deaths" className="text-slate-300">Deaths</label>
              <input
                id="deaths"
                type="number"
                placeholder="Digite o número de deaths"
                {...register('deaths', { required: 'Deaths são obrigatórios' })}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.deaths ? 'deaths-error' : undefined}
              />
              {errors.deaths && (
                <p id="deaths-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.deaths.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="assists" className="text-slate-300">Assists</label>
              <input
                id="assists"
                type="number"
                placeholder="Digite o número de assists"
                {...register('assists', { required: 'Assists são obrigatórios' })}
                className="mt-1 w-full border-slate-700 bg-slate-800 text-slate-300 rounded-md focus:ring focus:ring-red-500"
                aria-required="true"
                aria-describedby={errors.assists ? 'assists-error' : undefined}
              />
              {errors.assists && (
                <p id="assists-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.assists.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="border-slate-700 text-slate-300 rounded-md hover:bg-slate-800 px-4 py-2">
              Cancelar
            </button>
            <button type="submit" className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddChampionshipStatisticsModal;
