import React from 'react';
import { ProceduralTimelineStep } from '../../types';
import { useCaseContext } from '../../context/CaseContext';

interface ProceduralTimelineProps {
  title?: string;
  steps: ProceduralTimelineStep[];
  infoNote?: string;
  isAccelerated?: boolean;
}

export const ProceduralTimeline: React.FC<ProceduralTimelineProps> = ({
  title = "Línea de Tiempo Procesal",
  steps,
  infoNote,
  isAccelerated = false,
}) => {
  const { navigateTo } = useCaseContext();

  return (
    <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#2d2f2f]">
        <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#39a900] text-[20px]">
            route
          </span>
          <span>{title}</span>
        </h3>
        {isAccelerated && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-950/60 text-red-400 border border-red-800/60 px-2 py-0.5 rounded-full font-mono">
            Ruta Acelerada
          </span>
        )}
      </div>

      {/* Info Note if provided */}
      {infoNote && (
        <div className="mb-6 p-3.5 bg-[#252727] border border-[#333] rounded-lg text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed">
          <span className="material-symbols-outlined text-[#39a900] text-[18px] shrink-0 mt-0.5">
            info
          </span>
          <p>{infoNote}</p>
        </div>
      )}

      {/* Vertical Steps */}
      <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-[2px] before:bg-[#2d2f2f]">
        {steps.map((step) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isPending = step.status === 'pending' || step.status === 'locked';

          return (
            <div key={step.id} className="relative group">
              {/* Icon / Bullet */}
              <div className="absolute -left-[27px] top-0.5 z-10 flex items-center justify-center">
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center shadow-[0_0_8px_rgba(57,169,0,0.5)]">
                    <span className="material-symbols-outlined text-white text-[12px] font-bold">
                      check
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className={`w-5 h-5 rounded-full ${isAccelerated ? 'bg-[#d32f2f]' : 'bg-[#fdc300]'} flex items-center justify-center ring-4 ${isAccelerated ? 'ring-red-950/70' : 'ring-yellow-950/70'} animate-pulse`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#121212]"></div>
                  </div>
                )}

                {isPending && (
                  <div className="w-5 h-5 rounded-full bg-[#1e1e1e] border border-[#3f4a38] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#333]"></div>
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className={`${isPending ? 'opacity-40' : 'opacity-100'} transition-opacity`}>
                {/* Date / Status Tag */}
                {step.date && (
                  <p className="text-[11px] font-mono text-gray-400 mb-0.5 flex items-center gap-1">
                    {step.date}
                  </p>
                )}

                {/* Highlight Card for Current step */}
                {isCurrent ? (
                  <div className={`p-3 rounded-lg border ${
                    isAccelerated 
                      ? 'bg-red-950/20 border-red-800/40 text-red-200' 
                      : 'bg-yellow-950/20 border-yellow-800/40 text-yellow-200'
                  } mt-1 space-y-1.5`}>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isAccelerated ? 'text-red-400' : 'text-yellow-400'}`}>
                      PASO ACTUAL
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {step.title}
                    </h4>
                    {step.notes && (
                      <p className="text-xs text-gray-300 leading-snug">
                        {step.notes}
                      </p>
                    )}
                    {step.responsible && (
                      <p className="text-[11px] text-gray-400">
                        {step.responsible}
                      </p>
                    )}
                    {step.actionText && step.actionView && (
                      <button
                        onClick={() => navigateTo(step.actionView!)}
                        className={`mt-2 w-full py-1.5 px-3 rounded text-xs font-semibold ${
                          isAccelerated 
                            ? 'bg-red-800 hover:bg-red-700 text-white' 
                            : 'bg-[#39a900] hover:bg-[#329600] text-white'
                        } transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm`}
                      >
                        <span>{step.actionText}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className={`text-sm font-semibold ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </h4>
                    {step.responsible && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {step.responsible}
                      </p>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#39a900] font-medium mt-0.5">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        Completado
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-block text-[11px] text-gray-500 font-mono mt-0.5">
                        Pendiente
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
