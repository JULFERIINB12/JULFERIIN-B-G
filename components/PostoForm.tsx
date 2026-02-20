
import React, { useState, useRef, useEffect } from 'react';
import { Posto } from '../types';
import { 
  Camera, MapPin, ScanLine, Save, User, Image as ImageIcon, 
  Facebook, Instagram, Youtube, Twitter, Linkedin, MessageCircle, Music2, Globe, Map as MapIcon, X
} from 'lucide-react';
import jsQR from 'https://esm.sh/jsqr@1.4.0';

interface PostoFormProps {
  onSave: (posto: Posto) => void;
}

const PostoForm: React.FC<PostoFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    number: '',
    location: '',
    fullName: '',
    lat: '',
    lng: ''
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    tiktok: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '',
    whatsapp: ''
  });

  const [profilePic, setProfilePic] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // QR Scanner Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getGPSLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        }));
      }, (error) => {
        alert("Erro ao capturar GPS: " + error.message);
      });
    } else {
      alert("Geolocalização não suportada.");
    }
  };

  const startScanning = async () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (isScanning) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
            videoRef.current.play();
            requestRef.current = requestAnimationFrame(scanFrame);
          }
        } catch (err) {
          console.error("Erro ao acessar a câmera:", err);
          alert("Não foi possível acessar a câmera para o scan.");
          setIsScanning(false);
        }
      };
      startCamera();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isScanning]);

  const scanFrame = () => {
    if (videoRef.current && canvasRef.current && isScanning) {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            console.log("QR Code detectado:", code.data);
            processQRData(code.data);
            stopScanning();
            return;
          }
        }
      }
      requestRef.current = requestAnimationFrame(scanFrame);
    }
  };

  const processQRData = (data: string) => {
    // Tenta encontrar padrões de coordenadas (ex: "lat,lng" ou "geo:lat,lng")
    const geoMatch = data.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (geoMatch) {
      setFormData(prev => ({
        ...prev,
        lat: geoMatch[1],
        lng: geoMatch[2],
        location: `Localização via QR Code`
      }));
      alert("Coordenadas extraídas do QR Code com sucesso!");
    } else {
      // Tenta parsing JSON simples caso seja um objeto
      try {
        const json = JSON.parse(data);
        if (json.lat && json.lng) {
          setFormData(prev => ({
            ...prev,
            lat: String(json.lat),
            lng: String(json.lng),
            location: json.location || prev.location
          }));
          alert("Dados de localização carregados via QR!");
        } else {
          alert("QR Code lido, mas não contém dados de localização válidos (esperado: lat,lng).");
        }
      } catch (e) {
        alert("QR Code lido: " + data + "\n(Não foram detectadas coordenadas válidas)");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      number: formData.number,
      location: formData.location,
      fullName: formData.fullName,
      profilePic,
      latitude: formData.lat ? parseFloat(formData.lat) : undefined,
      longitude: formData.lng ? parseFloat(formData.lng) : undefined,
      socialLinks: socialLinks
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Foto de Perfil */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300 overflow-hidden">
            {profilePic ? (
              <img src={profilePic} className="w-full h-full object-cover" alt="Perfil" />
            ) : (
              <User size={48} className="text-gray-300" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 flex gap-1">
            <button 
              type="button" 
              onClick={() => cameraInputRef.current?.click()}
              className="bg-darkblue text-white p-2 rounded-full shadow-lg hover:bg-maroon transition-all"
            >
              <Camera size={16} />
            </button>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="bg-skylight text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-all"
            >
              <ImageIcon size={16} />
            </button>
          </div>
          <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={handleCapture} className="hidden" />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleCapture} className="hidden" />
        </div>
        <p className="text-xs text-gray-500 mt-2">Adicionar Foto (Câmera ou Galeria)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dados Básicos */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Número do Posto</label>
          <input
            required
            placeholder="ex: JP250"
            value={formData.number}
            onChange={e => setFormData({...formData, number: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-skylight outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
          <input
            required
            placeholder="ex: Amissito Assane"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-skylight outline-none"
          />
        </div>

        {/* Localização e QR */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">Lugar de Operação</label>
          <div className="flex gap-2">
            <input
              required
              placeholder="ex: Namiteka, Nampula"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-skylight outline-none"
            />
            <button 
              type="button" 
              onClick={isScanning ? stopScanning : startScanning}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white transition-all shadow-md ${isScanning ? 'bg-red-600 animate-pulse' : 'bg-maroon hover:bg-red-900 active:scale-95'}`}
            >
              {isScanning ? <X size={18} /> : <ScanLine size={18} />} 
              {isScanning ? 'Cancelar Scan' : 'Scan QR'}
            </button>
          </div>
        </div>
        
        {/* GPS e Mapa / Scanner */}
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-darkblue flex items-center gap-2">
              <MapPin size={16} /> {isScanning ? 'Scanner Ativo' : 'Mapeamento GPS'}
            </h4>
            {!isScanning && (
              <button 
                type="button" 
                onClick={getGPSLocation}
                className="text-xs bg-skylight text-white px-3 py-1.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-sm"
              >
                Capturar GPS Atual
              </button>
            )}
          </div>

          {isScanning ? (
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden border-2 border-maroon">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-skylight border-dashed animate-pulse rounded-lg"></div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">Aponte para o QR Code de Localização</span>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Latitude</span>
                  <input
                    placeholder="0.000000"
                    value={formData.lat}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Longitude</span>
                  <input
                    placeholder="0.000000"
                    value={formData.lng}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Visualização do Mapa */}
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-300 shadow-sm">
                {formData.lat && formData.lng ? (
                  <iframe
                    title="Mapa de Localização"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${formData.lat},${formData.lng}&z=15&output=embed`}
                    className="grayscale-[0.2]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MapIcon size={32} className="mb-2 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">Aguardando Coordenadas</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Redes Sociais */}
        <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-bold text-darkblue flex items-center gap-2 mb-2">
            <Globe size={16} /> Redes Sociais do Operador
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-600"><Facebook size={18} /></span>
              <input
                type="text"
                placeholder="Link do Facebook"
                value={socialLinks.facebook}
                onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-black"><Music2 size={18} /></span>
              <input
                type="text"
                placeholder="Link do TikTok"
                value={socialLinks.tiktok}
                onChange={e => setSocialLinks({...socialLinks, tiktok: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-gray-200 outline-none"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-pink-600"><Instagram size={18} /></span>
              <input
                type="text"
                placeholder="Link do Instagram"
                value={socialLinks.instagram}
                onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-200 outline-none"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-red-600"><Youtube size={18} /></span>
              <input
                type="text"
                placeholder="Link do YouTube"
                value={socialLinks.youtube}
                onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-400"><Twitter size={18} /></span>
              <input
                type="text"
                placeholder="Link do Twitter / X"
                value={socialLinks.twitter}
                onChange={e => setSocialLinks({...socialLinks, twitter: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-800"><Linkedin size={18} /></span>
              <input
                type="text"
                placeholder="Link do LinkedIn"
                value={socialLinks.linkedin}
                onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
            <div className="relative md:col-span-2 sm:col-span-2">
              <span className="absolute left-3 top-2.5 text-green-600"><MessageCircle size={18} /></span>
              <input
                type="text"
                placeholder="Link ou Número do WhatsApp"
                value={socialLinks.whatsapp}
                onChange={e => setSocialLinks({...socialLinks, whatsapp: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-darkblue text-white py-4 rounded-xl font-bold hover:bg-maroon shadow-xl flex items-center justify-center gap-2 transform transition-all active:scale-95"
      >
        <Save size={20} /> GUARDAR PERFIL COMPLETO
      </button>
    </form>
  );
};

export default PostoForm;
