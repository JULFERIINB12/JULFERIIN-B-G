
import React, { useState } from 'react';
import { Branch, Report, MediaItem } from '../types';
import { 
  FileText, Plus, Calendar, Clock, MapPin, ClipboardList, 
  ChevronRight, Upload, X, Save, FileCheck, Film, Image as ImageIcon,
  File, Trash2
} from 'lucide-react';

interface ReportsViewProps {
  branch: Branch;
}

const ReportsView: React.FC<ReportsViewProps> = ({ branch }) => {
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  
  // Form State
  const [selectedArea, setSelectedArea] = useState('');
  const [postoCode, setPostoCode] = useState('');
  const [reportType, setReportType] = useState<'Diário' | 'Semanal' | 'Mensal' | 'Anual'>('Diário');
  const [reportText, setReportText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [month, setMonth] = useState(new Intl.DateTimeFormat('pt', { month: 'long' }).format(new Date()));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tempMedia, setTempMedia] = useState<MediaItem[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newMedia = files.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      type: f.type.includes('video') ? 'video' : f.type.includes('image') ? 'image' : 'document',
      url: URL.createObjectURL(f),
      timestamp: Date.now()
    })) as MediaItem[];
    setTempMedia([...tempMedia, ...newMedia]);
  };

  const removeMedia = (id: string) => {
    setTempMedia(tempMedia.filter(m => m.id !== id));
  };

  const handleSave = () => {
    if (!selectedArea || !postoCode || !reportText) {
      alert("Por favor, preencha a Área, o Código do Posto e o Texto do Relatório.");
      return;
    }

    const newReport: Report = {
      id: Math.random().toString(36).substr(2, 9),
      postoCode,
      area: selectedArea,
      type: reportType,
      text: reportText,
      date,
      time,
      month,
      year,
      media: [...tempMedia],
      timestamp: Date.now()
    };

    setReports([newReport, ...reports]);
    setShowForm(false);
    resetForm();
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm("Tem certeza que deseja eliminar este relatório permanentemente?")) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const resetForm = () => {
    setSelectedArea('');
    setPostoCode('');
    setReportType('Diário');
    setReportText('');
    setTempMedia([]);
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-darkblue p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Novo Relatório Estruturado</h2>
            <p className="text-xs text-skylight font-bold">JULFERIIN GLOBAL - REGISTO OPERACIONAL</p>
          </div>
          <button onClick={() => setShowForm(false)} className="bg-white/10 p-2 rounded-full hover:bg-maroon transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seleção de Área */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
                <ClipboardList size={14} className="text-maroon" /> Área de Trabalho
              </label>
              <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-skylight outline-none font-bold text-darkblue transition-all"
              >
                <option value="">Selecione a Área...</option>
                {branch.areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Código do Posto */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
                <MapPin size={14} className="text-maroon" /> Código do Posto
              </label>
              <input 
                placeholder="Ex: JP-102"
                value={postoCode}
                onChange={(e) => setPostoCode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-skylight outline-none font-bold text-darkblue uppercase"
              />
            </div>

            {/* Tipo de Relatório */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase">Periodicidade</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Diário', 'Semanal', 'Mensal', 'Anual'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setReportType(type as any)}
                    className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${
                      reportType === type 
                        ? 'bg-maroon border-maroon text-white shadow-lg scale-105' 
                        : 'bg-white border-gray-100 text-gray-400 hover:border-maroon/30'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Cronologia */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Data</span>
                 <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100"/>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Hora</span>
                 <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100"/>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Mês Referência</span>
                 <input type="text" value={month} onChange={e => setMonth(e.target.value)} className="w-full p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100"/>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Ano</span>
                 <input type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full p-2 bg-gray-50 rounded-lg text-xs font-bold border border-gray-100"/>
               </div>
            </div>
          </div>

          {/* Texto do Relatório */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
              <FileText size={14} className="text-maroon" /> Descrição das Actividades
            </label>
            <textarea 
              rows={6}
              placeholder="Escreva aqui o relatório detalhado..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-skylight outline-none font-medium text-darkblue transition-all resize-none"
            />
          </div>

          {/* Mídia e Upload */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
                <Upload size={14} className="text-maroon" /> Anexos e Evidências
              </label>
              <label className="bg-skylight/10 text-skylight hover:bg-skylight hover:text-white px-4 py-2 rounded-full text-[10px] font-black cursor-pointer transition-all border border-skylight/20">
                ADICIONAR DA GALERIA
                <input type="file" multiple onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              {tempMedia.map(m => (
                <div key={m.id} className="relative group w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  {m.type === 'image' && <img src={m.url} className="w-full h-full object-cover" />}
                  {m.type === 'video' && <div className="w-full h-full flex items-center justify-center bg-darkblue text-white"><Film size={20}/></div>}
                  {m.type === 'document' && <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500"><File size={20}/></div>}
                  <button 
                    onClick={() => removeMedia(m.id)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {tempMedia.length === 0 && (
                <div className="w-full py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300">
                   <ImageIcon size={32} className="opacity-20 mb-2" />
                   <p className="text-[10px] font-bold">Nenhum ficheiro selecionado</p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-darkblue text-white py-5 rounded-2xl font-black hover:bg-maroon transition-all shadow-xl flex items-center justify-center gap-3 transform active:scale-95"
          >
            <Save size={20} /> SALVAR RELATÓRIO FINAL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-darkblue uppercase">Gestão de Relatórios</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Histórico Operacional do Ramo</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-maroon text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-red-900 transition-all flex items-center gap-2 transform active:scale-95"
        >
          <Plus size={20} /> NOVO RELATÓRIO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 group hover:border-skylight transition-all relative">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${
                report.type === 'Diário' ? 'bg-blue-50 text-blue-600' :
                report.type === 'Semanal' ? 'bg-green-50 text-green-600' :
                report.type === 'Mensal' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {report.type === 'Diário' && <Clock size={24} />}
                {report.type === 'Semanal' && <Calendar size={24} />}
                {report.type === 'Mensal' && <FileCheck size={24} />}
                {report.type === 'Anual' && <ClipboardList size={24} />}
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black text-gray-400 uppercase">{report.date}</span>
                <span className="block text-[10px] font-black text-maroon">{report.time}</span>
              </div>
            </div>

            <h3 className="font-black text-darkblue mb-1 uppercase text-sm">{report.area}</h3>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500">POSTO: {report.postoCode.toUpperCase()}</span>
            </div>

            <p className="text-xs text-gray-600 line-clamp-3 mb-4 italic leading-relaxed">
              "{report.text}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex -space-x-2">
                {report.media.slice(0, 3).map((m, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    {m.type === 'image' ? <img src={m.url} className="w-full h-full object-cover"/> : <FileCheck size={12} className="text-darkblue"/>}
                  </div>
                ))}
                {report.media.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-darkblue text-white flex items-center justify-center text-[8px] font-bold">
                    +{report.media.length - 3}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleDeleteReport(report.id)}
                  className="p-2 text-gray-300 hover:text-maroon transition-colors"
                  title="Eliminar Relatório"
                >
                  <Trash2 size={18} />
                </button>
                <button className="text-darkblue p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} className="opacity-10 mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Nenhum relatório emitido para este período</p>
            <button onClick={() => setShowForm(true)} className="mt-4 text-maroon font-black text-xs hover:underline uppercase">Emitir primeiro relatório agora</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
