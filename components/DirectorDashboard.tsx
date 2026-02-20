
import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const DirectorDashboard: React.FC = () => {
  const { addNotification } = useNotifications();

  const handleNotify = (ramo: string, alertMsg: string) => {
    addNotification({
      title: `ALERTA CRÍTICO: ${ramo}`,
      message: alertMsg,
      type: 'error'
    });
  };

  const handleVerify = (ramo: string, infoMsg: string) => {
    addNotification({
      title: `VERIFICAÇÃO: ${ramo}`,
      message: infoMsg,
      type: 'warning'
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-darkblue flex items-center gap-3">
          <span className="bg-maroon text-white p-1.5 rounded-lg shadow-inner">🚨</span>
          PAINEL DO DIRECTOR GERAL
        </h3>
        <div className="flex items-center gap-2">
           <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Monitoring</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* LTD 2 - Critical */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-red-50 border-l-8 border-red-500 rounded-lg shadow-sm group hover:shadow-md transition-all">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={28} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-black text-red-900">JULFERIIN LTD 2</p>
              <span className="text-[9px] bg-red-200 text-red-700 px-1 rounded font-bold">URGENTE</span>
            </div>
            <p className="text-sm text-red-700 font-medium">Daily Report não enviado - Atraso crítico de 4 horas.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => handleNotify('JULFERIIN LTD 2', 'Atraso crítico no envio do Daily Report. Acção imediata necessária.')}
              className="flex-1 sm:flex-none text-[10px] font-black bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Send size={12} /> NOTIFICAR
            </button>
          </div>
        </div>

        {/* LTD 3 - Warning */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-yellow-50 border-l-8 border-yellow-500 rounded-lg shadow-sm group hover:shadow-md transition-all">
          <Info className="text-yellow-600 flex-shrink-0" size={28} />
          <div className="flex-1">
            <p className="font-black text-yellow-900">JULFERIIN LTD 3</p>
            <p className="text-sm text-yellow-700 font-medium">Sem actividade registada hoje no Box de Saídas (BSJ).</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => handleVerify('JULFERIIN LTD 3', 'Verificar conformidade operacional do Box de Saídas.')}
              className="flex-1 sm:flex-none text-[10px] font-black bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <MessageSquare size={12} /> VERIFICAR
            </button>
          </div>
        </div>

        {/* LTD 1 - Normal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-green-50 border-l-8 border-green-500 rounded-lg shadow-sm group hover:shadow-md transition-all">
          <CheckCircle2 className="text-green-600 flex-shrink-0" size={28} />
          <div className="flex-1">
            <p className="font-black text-green-900">JULFERIIN LTD 1</p>
            <p className="text-sm text-green-700 font-medium">Operações normais. 12 postos activos em Nampula. Tudo em conformidade.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => addNotification({ title: 'JULFERIIN LTD 1', message: 'Relatório consolidado gerado com sucesso.', type: 'success' })}
              className="flex-1 sm:flex-none text-[10px] font-black bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              RELATÓRIO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
