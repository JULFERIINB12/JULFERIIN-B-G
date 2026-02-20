
import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { Upload, Cloud, Share2, Facebook, Instagram, Youtube, MessageCircle, Twitter, Linkedin, Check } from 'lucide-react';

const MediaManager: React.FC = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState<any | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Cast Array.from to File[] to fix TypeScript 'unknown' errors for name, type, and createObjectURL.
    const files = Array.from(e.target.files || []) as File[];
    const newItems = files.map(f => ({
      id: Math.random().toString(36),
      name: f.name,
      type: f.type,
      url: URL.createObjectURL(f),
      timestamp: Date.now()
    }));
    setUploads(prev => [...prev, ...newItems]);
  };

  const handleAction = (item: any, type: 'drive' | 'share') => {
    if (type === 'share') {
      setShowShareModal(item);
    } else {
      alert(`Guardando "${item.name}" no Google Drive...`);
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 text-center">
        <Upload className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-bold text-darkblue mb-2">Upload de Mídia Sem Limites</h3>
        <p className="text-sm text-gray-500 mb-6">Fotos, Vídeos e Documentos da Empresa</p>
        <label className="bg-darkblue text-white px-8 py-3 rounded-full font-bold cursor-pointer hover:bg-maroon transition-all">
          Selecionar Arquivos
          <input type="file" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {uploads.map(item => (
          <div key={item.id} className="group relative bg-gray-100 rounded-lg aspect-square overflow-hidden border border-gray-200">
            {item.type.includes('image') ? (
              <img src={item.url} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[10px] p-2 text-center">
                <Cloud size={24} className="mb-1 text-darkblue" />
                <span className="truncate w-full">{item.name}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <button 
                onClick={() => handleAction(item, 'drive')}
                className="w-full text-[10px] bg-white text-darkblue py-1 rounded font-bold flex items-center justify-center gap-1"
              >
                <Cloud size={10} /> Drive
              </button>
              <button 
                onClick={() => handleAction(item, 'share')}
                className="w-full text-[10px] bg-skylight text-white py-1 rounded font-bold flex items-center justify-center gap-1"
              >
                <Share2 size={10} /> Partilhar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-darkblue mb-4">Como deseja guardar?</h3>
            <p className="text-sm text-gray-500 mb-6">Ficheiro: {showShareModal.name}</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => { alert('Ficheiro gravado no Google Drive.'); setShowShareModal(null); }}
                className="w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl flex items-center gap-4 transition-all"
              >
                <Cloud className="text-blue-500" />
                <div className="text-left">
                  <p className="font-bold text-sm">Gravar no Google Drive</p>
                  <p className="text-[10px] text-gray-400">Armazenamento na nuvem seguro</p>
                </div>
              </button>

              <div className="pt-4">
                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Partilhar Redes Sociais</p>
                <div className="grid grid-cols-4 gap-4">
                  {SOCIAL_LINKS.map(link => (
                    <button 
                      key={link.name}
                      onClick={() => { alert(`Ficheiro partilhado no ${link.name}`); setShowShareModal(null); }}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-maroon group-hover:text-white transition-all">
                        <Share2 size={16} />
                      </div>
                      <span className="text-[9px] font-bold text-gray-500">{link.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowShareModal(null)}
              className="mt-8 w-full py-2 text-gray-400 font-bold hover:text-maroon"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;
