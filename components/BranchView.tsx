
import React, { useState } from 'react';
import { Branch, Posto, Activity } from '../types';
import PostoForm from './PostoForm';
import MediaManager from './MediaManager';
// Add FileText to the imports from lucide-react to fix "Cannot find name 'FileText'" error.
import { ChevronRight, Plus, Edit, Trash2, Save, Send, Clock, CheckCircle, Play, FileText } from 'lucide-react';

interface BranchViewProps {
  branch: Branch;
  boxType?: string;
}

const BranchView: React.FC<BranchViewProps> = ({ branch, boxType }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [editingPosto, setEditingPosto] = useState<Posto | null>(null);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', title: 'Manutenção de Equipamento', date: '2024-05-20', status: 'Em Curso' },
    { id: '2', title: 'Entrega de Relatório', date: '2024-05-21', status: 'Pendente' },
    { id: '3', title: 'Limpeza de Instalações', date: '2024-05-19', status: 'Concluído' }
  ]);

  const handleAddPosto = (posto: Posto) => {
    if (editingPosto) {
      setPostos(postos.map(p => p.id === posto.id ? posto : p));
    } else {
      setPostos([...postos, posto]);
    }
    setSelectedArea(null);
    setEditingPosto(null);
  };

  const handleEditPosto = (posto: Posto) => {
    setEditingPosto(posto);
    setSelectedArea('Editar Posto');
  };

  const deleteActivity = (id: string) => {
    if (confirm("Tem certeza que deseja eliminar esta atividade?")) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const addPlaceholderActivity = () => {
    const newAct: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Atividade ' + (activities.length + 1),
      date: new Date().toISOString().split('T')[0],
      status: 'Pendente'
    };
    setActivities([newAct, ...activities]);
  };

  const renderAreas = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {branch.areas.map((area) => (
        <button
          key={area}
          onClick={() => setSelectedArea(area)}
          className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-skylight transition-all flex items-center justify-between group"
        >
          <span className="font-bold text-darkblue">{area}</span>
          <ChevronRight className="text-gray-400 group-hover:text-skylight" />
        </button>
      ))}
    </div>
  );

  const renderBRJ = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-darkblue">Recursos Humanos (Postos)</h3>
        <button 
          onClick={() => setSelectedArea('Novo Posto')}
          className="bg-darkblue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-maroon"
        >
          <Plus size={18} /> Adicionar Novo Posto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {postos.map((p) => (
          <div key={p.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={p.profilePic || 'https://picsum.photos/100'} className="w-16 h-16 rounded-full object-cover border-2 border-skylight" alt="" />
              <div>
                <p className="font-bold text-darkblue">{p.fullName}</p>
                <p className="text-xs text-gray-500">Posto: {p.number}</p>
                <p className="text-xs text-gray-400">{p.location}</p>
                {p.latitude && <p className="text-[10px] text-maroon">Lat: {p.latitude} / Lon: {p.longitude}</p>}
              </div>
            </div>
            <button 
              onClick={() => handleEditPosto(p)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar Posto"
            >
              <Edit size={18} />
            </button>
          </div>
        ))}
        {postos.length === 0 && <p className="col-span-2 text-center text-gray-400 py-10">Nenhum posto registado.</p>}
      </div>
    </div>
  );

  const renderBAJ = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-darkblue">Listagem de Actividades</h3>
        <button 
          onClick={addPlaceholderActivity}
          className="bg-skylight text-darkblue px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Nova Actividade
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-bold text-gray-600">Título</th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600">Data</th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600">Status</th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium">{act.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{act.date}</td>
                <td className="px-4 py-3">
                  <span className={`
                    px-2 py-1 rounded-full text-[10px] font-bold uppercase
                    ${act.status === 'Concluído' ? 'bg-green-100 text-green-700' : 
                      act.status === 'Em Curso' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}
                  `}>
                    {act.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => alert('A editar: ' + act.title)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition-all"
                      title="Editar Actividade"
                    >
                      <Edit size={14} /> 
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button 
                      onClick={() => deleteActivity(act.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg transition-all"
                      title="Eliminar Actividade"
                    >
                      <Trash2 size={14} /> 
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400 italic">
                  Nenhuma actividade registada para este ramo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (selectedArea === 'Novo Posto' || selectedArea === 'Editar Posto' || (selectedArea && !boxType)) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-skylight">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-darkblue">
            {selectedArea === 'Editar Posto' ? `Editar Perfil: ${editingPosto?.fullName}` : `Registo de Perfil: ${selectedArea}`}
          </h2>
          <button 
            onClick={() => {
              setSelectedArea(null);
              setEditingPosto(null);
            }} 
            className="text-gray-400 hover:text-maroon"
          >
            Voltar
          </button>
        </div>
        <PostoForm onSave={handleAddPosto} initialData={editingPosto || undefined} />
      </div>
    );
  }

  // Handle Box Content
  if (boxType) {
    if (boxType.includes('RH')) return renderBRJ();
    if (boxType.includes('Actividades')) return renderBAJ();
    if (boxType.includes('Entradas') || boxType.includes('Saídas')) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-skylight hover:text-white transition-all group">
              <FileText className="mb-2 text-darkblue group-hover:text-white" />
              <span className="text-xs font-bold">Emitir Recibo</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-skylight hover:text-white transition-all group">
              <Clock className="mb-2 text-darkblue group-hover:text-white" />
              <span className="text-xs font-bold">Guia Saída</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-skylight hover:text-white transition-all group">
              <CheckCircle className="mb-2 text-darkblue group-hover:text-white" />
              <span className="text-xs font-bold">Requisição</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-skylight hover:text-white transition-all group">
              <Play className="mb-2 text-darkblue group-hover:text-white" />
              <span className="text-xs font-bold">Manifesto</span>
            </button>
          </div>
          <MediaManager />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-darkblue">Selecione uma Área de Trabalho</h3>
      {renderAreas()}
    </div>
  );
};

export default BranchView;
