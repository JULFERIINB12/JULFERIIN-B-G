
import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, 
  Heart, ThumbsUp, Smile, Share2, Send, Users, ShieldCheck, Lock,
  ArrowLeft, Disc, Circle
} from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
}

interface MeetingRoomProps {
  onBack: () => void;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ onBack }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [code, setCode] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'Director Geral', text: 'Boa tarde a todos os gerentes.', time: '14:30' },
    { id: '2', user: 'Gerente LTD 1', text: 'Presente.', time: '14:31' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [reactions, setReactions] = useState<{id: number, type: string}[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '0000') {
      setIsJoined(true);
      startCamera();
    } else {
      alert('Código de acesso inválido. Por favor, solicite o código "0000" à administração.');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erro ao acessar câmera/mic:", err);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      if (streamRef.current) {
        audioChunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `gravacao-julferiin-${new Date().getTime()}.webm`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          alert('Gravação concluída e descarregada.');
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleEndCall = () => {
    if (confirm("Deseja mesmo encerrar a reunião e sair da sala?")) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (isRecording) {
        mediaRecorderRef.current?.stop();
      }
      setIsJoined(false);
      onBack();
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: Math.random().toString(),
      user: 'Eu (Gerente)',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const addReaction = (type: string) => {
    const id = Date.now();
    setReactions(prev => [...prev, { id, type }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  if (!isJoined) {
    return (
      <div className="relative animate-in zoom-in duration-300">
        <button 
          onClick={onBack}
          className="absolute -top-12 -left-2 flex items-center gap-2 text-darkblue font-black hover:text-maroon transition-colors"
        >
          <ArrowLeft size={18} /> VOLTAR AO DASHBOARD
        </button>
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-darkblue rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Video size={32} />
          </div>
          <h2 className="text-2xl font-black text-darkblue mb-2">Meeting JULFERIIN</h2>
          <p className="text-gray-500 text-sm mb-8">Introduza o código de segurança de 4 dígitos para participar na reunião global.</p>
          
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                maxLength={4}
                placeholder="CÓDIGO (0000)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-xl focus:border-skylight outline-none text-center font-black tracking-[0.5em] text-xl transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-darkblue text-white py-4 rounded-xl font-black hover:bg-maroon shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              ENTRAR NA SALA LIVE
            </button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" /> Conexão Encriptada JULFERIIN-SECURE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[75vh] bg-black rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10">
      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900 group">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted={isMuted}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {isVideoOff && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
            <div className="w-24 h-24 bg-darkblue rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-2xl animate-pulse">
              JB
            </div>
            <p className="font-bold text-sm tracking-widest text-gray-400">CÂMARA DESACTIVADA</p>
          </div>
        )}

        {/* Reactions Layer */}
        <div className="absolute bottom-20 right-10 flex flex-col pointer-events-none">
          {reactions.map(r => (
            <div key={r.id} className="text-4xl animate-bounce-up opacity-0">
              {r.type === 'heart' && '❤️'}
              {r.type === 'like' && '👍'}
              {r.type === 'smile' && '😊'}
            </div>
          ))}
        </div>

        {/* Live Overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black text-white animate-pulse shadow-lg flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div> LIVE
          </div>
          {isRecording && (
             <div className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-red-600 shadow-lg flex items-center gap-1.5 animate-pulse">
               <Disc size={10} className="animate-spin" /> REC ATIVO
             </div>
          )}
        </div>

        <div className="absolute top-6 right-6 flex gap-2">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-bold flex items-center gap-2">
            <Users size={12} /> 12 Online
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-4 transition-transform group-hover:translate-y-0 translate-y-4">
          <button 
            onClick={toggleMic}
            title={isMuted ? "Ativar Microfone" : "Desativar Microfone"}
            className={`p-4 rounded-full transition-all shadow-xl ${isMuted ? 'bg-red-600' : 'bg-white/20 hover:bg-white/40 text-white'}`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <button 
            onClick={toggleVideo}
            title={isVideoOff ? "Ativar Vídeo" : "Desativar Vídeo"}
            className={`p-4 rounded-full transition-all shadow-xl ${isVideoOff ? 'bg-red-600' : 'bg-white/20 hover:bg-white/40 text-white'}`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>

          <button 
            onClick={handleToggleRecording}
            title={isRecording ? "Parar Gravação" : "Gravar Reunião"}
            className={`p-4 rounded-full transition-all shadow-xl ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-white/20 hover:bg-white/40 text-white'}`}
          >
            {isRecording ? <Disc size={24} /> : <Circle size={24} />}
          </button>

          <button 
            onClick={handleEndCall}
            title="Encerrar Reunião"
            className="p-4 bg-red-600 rounded-full text-white hover:bg-red-800 transition-all shadow-xl hover:scale-110 active:scale-90 flex items-center gap-2"
          >
            <PhoneOff size={24} />
            <span className="text-xs font-black hidden sm:block">ENCERRAR</span>
          </button>
        </div>
      </div>

      {/* Sidebar Chat / Activities */}
      <div className="w-full lg:w-80 bg-white flex flex-col border-l border-gray-100 shadow-2xl">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <MessageSquare size={18} className="text-darkblue" />
          <h3 className="font-black text-sm text-darkblue uppercase">Chat em Tempo Real</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map(msg => (
            <div key={msg.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-darkblue">{msg.user}</span>
                <span className="text-[8px] text-gray-400">{msg.time}</span>
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-xs text-gray-700">
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Reaction Bar */}
        <div className="p-3 border-t border-gray-100 flex justify-center gap-4 bg-white shadow-inner">
          <button onClick={() => addReaction('heart')} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-all hover:scale-125"><Heart size={20} fill="currentColor" /></button>
          <button onClick={() => addReaction('like')} className="p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-all hover:scale-125"><ThumbsUp size={20} fill="currentColor" /></button>
          <button onClick={() => addReaction('smile')} className="p-2 hover:bg-yellow-50 rounded-full text-yellow-500 transition-all hover:scale-125"><Smile size={20} fill="currentColor" /></button>
          <button onClick={() => alert('Link da Reunião copiado!')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-all hover:scale-125"><Share2 size={20} /></button>
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <input 
            type="text" 
            placeholder="Enviar comentário..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-skylight outline-none transition-all"
          />
          <button type="submit" className="bg-darkblue text-white p-2 rounded-full hover:bg-maroon transition-all">
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce-up {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-150px); opacity: 0; }
        }
        .animate-bounce-up {
          animation: bounce-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MeetingRoom;
