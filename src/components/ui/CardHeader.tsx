import { ReactNode } from 'react';

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  iconColorClass?: string;
  iconBgClass?: string;
}

export const CardHeader = ({ 
  icon, 
  title, 
  iconColorClass = "text-green-500", 
  iconBgClass = "bg-green-500/20" 
}: CardHeaderProps) => {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className={`p-2 ${iconBgClass} rounded-lg`}>
        <div className={`w-6 h-6 ${iconColorClass}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
  );
};
