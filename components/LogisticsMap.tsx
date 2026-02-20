
import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, Navigation, Shield, History, MapPin, 
  Settings, AlertTriangle, Truck, User, Zap, Circle, Layers,
  Clock, ArrowDownRight, Trash2, Flag, Route, Eye, EyeOff
} from 'lucide-react';
import { Posto, Geofence } from '../types';
import { useNotifications } from '../contexts/NotificationContext';

const LogisticsMap: React.FC = () => {
  const { addNotification } = useNotifications();
  const [selectedEntity, setSelectedEntity] = useState<Posto | null>(null);
  const [showGeofences, setShowGeofences] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [showPlannedRoute, setShowPlannedRoute] = useState(true);
  
  // Mock Active Entities with Planned Routes
  const [entities, setEntities] = useState<Posto[]>([
    {
      id: 'v1',
      number: 'TR-102',
      location: 'Nampula - Corredor',
      fullName: 'Camião de Logística A',
      profilePic: '',
      latitude: -15.1171,
      longitude: 39.2662,
      speed: 45,
      status: 'Moving',
      destination: 'Porto de Nacala',
      plannedRoute: [
        { lat: -15.1171, lng: 39.2662 },
        { lat: -15.1100, lng: 39.2800 },
        { lat: -15.1050, lng: 39.3000 },
        { lat: -15.0900, lng: 39.3500 }
      ],
      history: [
        { lat: -15.1200, lng: 39.2600 },
        { lat: -15.1195, lng: 39.2610 },
        { lat: -15.1190, lng: 39.2620 },
        { lat: -15.1185, lng: 39.2635 },
        { lat: -15.1180, lng: 39.2640 }
      ]
    },
    {
      id: 'p1',
      number: 'OP-05',
      location: 'Namiteka',
      fullName: 'Supervisor de Campo',
      profilePic: '',
      latitude: -15.1250,
      longitude: 39.2700,
      speed: 5,
      status: 'Moving',
      destination: 'Namiteka HQ',
      plannedRoute: [
        { lat: -15.1250, lng: 39.2700 },
        { lat: -15.1300, lng: 39.2750 },
        { lat: -15.1350, lng: 39.2800 }
      ],
      history: [
        { lat: -15.1260, lng: 39.2710 },
        { lat: -15.1255, lng: 39.2705 }
      ]
    }
  ]);

  const geofences: Geofence[] = [
    { id: 'g1', name: 'Armazém Central', lat: -15.1150, lng: 39.2650, radius: 500, color: 'rgba(77, 166, 255, 0.2)' },
    { id: 'g2', name: 'Zona de Risco - Norte', lat: -15.1100, lng: 39.2550, radius: 800, color: 'rgba(128, 0, 0, 0.2)' }
  ];

  // Map Projection Helper
  const projectX = (lng: number) => 50 + (lng - 39.2662) * 6000;
  const projectY = (lat: number) => 50 + (lat + 15.1171) * 6000;

  // Movement Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setEntities(prev => prev.map(e => {
        if (e.status !== 'Moving') return e;
        
        const currentPos = { lat: e.latitude!, lng: e.longitude! };
        const newHistory = [...(e.history || []), currentPos].slice(-15);

        const deltaLat = (Math.random() - 0.5) * 0.0008;
        const deltaLng = (Math.random() - 0.5) * 0.0008;
        const newLat = (e.latitude || 0) + deltaLat;
        const newLng = (e.longitude || 0) + deltaLng;
        
        geofences.forEach(gf => {
            const dist = Math.sqrt(Math.pow(newLat - gf.lat, 2) + Math.pow(newLng - gf.lng, 2));
            if (dist < 0.004) {
                if (Math.random() > 0.98) {
                    addNotification({
                        title: `GEOFENCE: ${e.number}`,
                        message: `${e.fullName} operando próximo a ${gf.name}.`,
                        type: 'info'
                    });
                }
            }
        });

        const updated = {
          ...e,
          latitude: newLat,
          longitude: newLng,
          history: newHistory,
          speed: Math.floor(Math.random() * 40) + 20
        };

        if (selectedEntity?.id === e.id) {
          setSelectedEntity(updated);
        }

        return updated;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedEntity]);

  const clearHistory = () => {
    setEntities(prev => prev.map(e => ({ ...e, history: [] })));
    if (selectedEntity) setSelectedEntity({ ...selectedEntity, history: [] });
    addNotification({ title: 'LOGÍSTICA', message: 'Histórico de visualização limpo.', type: 'success' });
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="bg-darkblue p-4 text-white flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="bg-maroon p-2 rounded-xl shadow-inner">
            <Navigation className="animate-pulse" size={20} />
          </div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-tighter text-white">Centro de Monitoria GPS</h2>
            <p className="text-[10px] text-skylight font-bold uppercase">Julferiin Global Operations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGeofences(!showGeofences)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 transition-all border ${showGeofences ? 'bg-skylight border-skylight text-darkblue shadow-lg' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}`}
          >
            <Shield size={12} /> GEOFENCES
          </button>
          <button 
             onClick={() => setShowHistory(!showHistory)}
             className={`px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 transition-all border ${showHistory ? 'bg-maroon border-maroon text-white shadow-lg' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}`}
          >
            <History size={12} /> HISTÓRICO
          </button>
          <button 
             onClick={clearHistory}
             className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600 hover:text-white transition-all"
             title="Limpar Rastro"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Status */}
        <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unidades Ativas</span>
               <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[9px] font-black animate-pulse uppercase">LIVE</span>
            </div>
            <div className="space-y-2">
              {entities.map(e => (
                <button 
                  key={e.id}
                  onClick={() => setSelectedEntity(e)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${selectedEntity?.id === e.id ? 'bg-blue-50 border-skylight shadow-sm ring-2 ring-skylight/10' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-darkblue uppercase tracking-tight">{e.number}</span>
                    <div className="flex items-center gap-1">
                       <span className="text-[8px] font-bold text-green-500 uppercase">Online</span>
                       <span className="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-700 truncate">{e.fullName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                      <Zap size={10} className="text-yellow-500" /> {e.speed} KM/H
                    </div>
                    <div className="text-[8px] font-bold text-maroon bg-maroon/5 px-1.5 py-0.5 rounded uppercase">
                       {e.id.startsWith('v') ? 'LOGÍSTICA' : 'PESSOAL'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {selectedEntity ? (
              <div className="p-4 space-y-4 animate-in slide-in-from-left-4 duration-300">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-maroon uppercase tracking-widest">Telemetria & Log</h4>
                    <button onClick={() => setSelectedEntity(null)} className="text-[10px] text-gray-400 font-bold hover:text-maroon uppercase">FECHAR</button>
                 </div>
                 
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="bg-darkblue/10 p-2 rounded-lg text-darkblue">
                          <MapPin size={16} />
                       </div>
                       <div>
                         <span className="text-[9px] text-gray-400 block font-bold uppercase">Coordenada Atual</span>
                         <p className="text-[10px] font-mono font-bold text-darkblue">{selectedEntity.latitude?.toFixed(5)}, {selectedEntity.longitude?.toFixed(5)}</p>
                       </div>
                    </div>
                    
                    {selectedEntity.destination && (
                    <div className="flex items-center gap-3">
                       <div className="bg-skylight/10 p-2 rounded-lg text-skylight">
                          <Flag size={16} />
                       </div>
                       <div className="flex-1">
                         <span className="text-[9px] text-gray-400 block font-bold uppercase">Destino Planejado</span>
                         <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black text-skylight uppercase">{selectedEntity.destination}</p>
                            <button 
                                onClick={() => setShowPlannedRoute(!showPlannedRoute)}
                                className={`text-[8px] px-1.5 py-0.5 rounded font-black border transition-all ${showPlannedRoute ? 'bg-skylight text-white border-skylight' : 'text-gray-400 border-gray-200'}`}
                            >
                               {showPlannedRoute ? <Eye size={10} /> : <EyeOff size={10} />}
                            </button>
                         </div>
                       </div>
                    </div>
                    )}

                    <div className="flex items-center gap-3">
                       <div className="bg-maroon/10 p-2 rounded-lg text-maroon">
                          <Clock size={16} />
                       </div>
                       <div>
                         <span className="text-[9px] text-gray-400 block font-bold uppercase">Base de Operação</span>
                         <p className="text-[10px] font-bold text-gray-600 uppercase">{selectedEntity.location}</p>
                       </div>
                    </div>
                 </div>

                 {/* Histórico na Sidebar */}
                 <div className="space-y-2">
                    <h5 className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-2">
                       <History size={12} /> Linha do Tempo (Rastro)
                    </h5>
                    <div className="space-y-1.5">
                       {selectedEntity.history && selectedEntity.history.length > 0 ? (
                         [...selectedEntity.history].reverse().map((h, i) => (
                           <div key={i} className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center gap-3 transition-all hover:bg-gray-50">
                              <div className="text-skylight opacity-50">
                                 <ArrowDownRight size={14} />
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-black text-darkblue uppercase tracking-tighter">Log Point</span>
                                    <span className="text-[8px] text-gray-300 font-bold">-{i * 4}s</span>
                                 </div>
                                 <p className="text-[9px] font-mono text-gray-400 leading-none">{h.lat.toFixed(4)}, {h.lng.toFixed(4)}</p>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                            <p className="text-[9px] font-bold text-gray-300 uppercase">Sem logs capturados</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 text-center px-10">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                   <MapIcon size={32} className="opacity-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Selecione uma unidade para telemetria em tempo real</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Visualization Area */}
        <div className="flex-1 relative bg-slate-100 group overflow-hidden">
          {/* Radar Background Mockup */}
          <div className="absolute inset-0 grid grid-cols-[repeat(25,minmax(0,1fr))] grid-rows-[repeat(25,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
            {Array.from({ length: 625 }).map((_, i) => (
              <div key={i} className="border border-darkblue"></div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {/* Map Content Simulation */}
             <div className="relative w-full h-full p-10 pointer-events-auto">
                
                {/* SVG Layer for Paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                   {entities.map(e => {
                      if (!showPlannedRoute || selectedEntity?.id !== e.id || !e.plannedRoute) return null;
                      
                      const points = e.plannedRoute.map(p => `${projectX(p.lng)}%,${projectY(p.lat)}%`).join(' ');
                      return (
                        <g key={`route-${e.id}`}>
                           <polyline 
                              points={points} 
                              fill="none" 
                              stroke="#4da6ff" 
                              strokeWidth="2" 
                              strokeDasharray="6,4"
                              className="animate-pulse"
                           />
                           {e.plannedRoute.map((p, idx) => (
                              <circle 
                                 key={idx} 
                                 cx={`${projectX(p.lng)}%`} 
                                 cy={`${projectY(p.lat)}%`} 
                                 r="2" 
                                 fill="#4da6ff" 
                              />
                           ))}
                        </g>
                      );
                   })}
                </svg>

                {/* Geofences Rendering */}
                {showGeofences && geofences.map(gf => (
                  <div 
                    key={gf.id}
                    className="absolute rounded-full border-2 border-dashed border-darkblue/30 flex items-center justify-center group/gf transition-opacity duration-500"
                    style={{
                      left: `${projectX(gf.lng)}%`,
                      top: `${projectY(gf.lat)}%`,
                      width: '240px',
                      height: '240px',
                      backgroundColor: gf.color,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <span className="text-[8px] font-black text-darkblue/50 uppercase tracking-tighter bg-white/40 px-1 rounded">{gf.name}</span>
                  </div>
                ))}

                {/* Tracking Entities Rendering */}
                {entities.map(e => (
                  <div 
                    key={e.id}
                    className="absolute z-20 transition-all duration-4000 ease-linear"
                    style={{
                      left: `${projectX(e.longitude!)}%`,
                      top: `${projectY(e.latitude!)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Route History Rendering (Visual Trail) */}
                    {showHistory && e.history?.map((h, i) => {
                       const opacity = (i + 1) / (e.history?.length || 1);
                       const size = 2 + (i * 0.4);
                       return (
                         <div 
                          key={i} 
                          className="absolute bg-skylight rounded-full shadow-sm"
                          style={{
                             left: `${(h.lng - e.longitude!) * 6000}px`,
                             top: `${(h.lat - e.latitude!) * 6000}px`,
                             width: `${size}px`,
                             height: `${size}px`,
                             opacity: opacity * 0.6,
                             transform: 'translate(-50%, -50%)'
                          }}
                         />
                       );
                    })}

                    <div 
                      onClick={() => setSelectedEntity(e)}
                      className={`relative cursor-pointer group/marker ${selectedEntity?.id === e.id ? 'scale-125' : 'scale-100 hover:scale-110'} transition-transform duration-300`}
                    >
                      <div className={`p-2.5 rounded-xl shadow-2xl border-2 flex items-center justify-center transition-colors ${selectedEntity?.id === e.id ? 'bg-skylight border-white text-darkblue' : (e.id.startsWith('v') ? 'bg-darkblue border-skylight text-white' : 'bg-maroon border-white text-white')}`}>
                         {e.id.startsWith('v') ? <Truck size={18} /> : <User size={18} />}
                      </div>
                      
                      {/* Destination Pin if Selected */}
                      {selectedEntity?.id === e.id && e.plannedRoute && e.plannedRoute.length > 0 && showPlannedRoute && (
                         <div 
                            className="absolute pointer-events-none"
                            style={{
                                left: `${(e.plannedRoute[e.plannedRoute.length - 1].lng - e.longitude!) * 6000}px`,
                                top: `${(e.plannedRoute[e.plannedRoute.length - 1].lat - e.latitude!) * 6000}px`,
                                transform: 'translate(-50%, -100%)'
                            }}
                         >
                            <Flag className="text-skylight animate-bounce" size={24} />
                            <div className="bg-darkblue text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap -mt-1 uppercase tracking-tighter">CHEGADA: {e.destination}</div>
                         </div>
                      )}

                      {/* Pulse Effect only for moving entities */}
                      {e.status === 'Moving' && (
                        <div className="absolute inset-0 bg-skylight rounded-xl animate-ping opacity-30"></div>
                      )}

                      {/* Floating Label */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-xl border border-gray-100 transition-opacity ${selectedEntity?.id === e.id ? 'opacity-100' : 'opacity-0 group-hover/marker:opacity-100'}`}>
                         <p className="text-[8px] font-black text-darkblue uppercase tracking-tighter">{e.number}</p>
                         <p className="text-[6px] font-bold text-gray-500 uppercase">{e.speed} km/h • {e.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Map Overlay Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
            <button className="bg-white p-2.5 rounded-xl shadow-2xl hover:bg-gray-50 text-darkblue border border-gray-100 transition-all active:scale-90" title="Camadas"><Layers size={20} /></button>
            <button className="bg-white p-2.5 rounded-xl shadow-2xl hover:bg-gray-50 text-darkblue border border-gray-100 transition-all active:scale-90" title="Centralizar"><Circle size={20} /></button>
          </div>

          <div className="absolute top-6 left-6 flex gap-2 z-10">
             <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-100 shadow-2xl flex items-center gap-3">
                <div className="bg-maroon/10 p-1.5 rounded-lg">
                  <AlertTriangle className="text-maroon" size={16} />
                </div>
                <div className="leading-none">
                  <p className="text-[9px] font-black text-darkblue uppercase tracking-tighter">Monitoria de Trajecto</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tight">Status de Sincronização: Ativo</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="bg-white p-2.5 border-t border-gray-100 flex justify-center gap-8 shadow-inner overflow-x-auto">
         <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded bg-darkblue shadow-sm"></div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Frota Logística</span>
         </div>
         <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded bg-maroon shadow-sm"></div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Equipa de Campo</span>
         </div>
         <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-skylight bg-skylight/10"></div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Geofence</span>
         </div>
         <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-skylight opacity-20"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-skylight opacity-40"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-skylight opacity-60"></div>
            </div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Rastro Histórico</span>
         </div>
         <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-skylight"></div>
            <span className="text-[9px] font-black text-skylight uppercase tracking-tighter">Rota Planeada</span>
         </div>
      </div>
    </div>
  );
};

export default LogisticsMap;
