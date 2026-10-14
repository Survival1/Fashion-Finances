import React, { useState, useRef } from 'react';
import { 
  Tv, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Flame, 
  Sparkles, 
  Radio, 
  Play, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { 
  CHANNELS_SLIDER_CATEGORIES, 
  LIVE_STREAM_CHANNELS_DATA, 
  ChannelCategory, 
  LiveStreamChannel 
} from '../utils/channelsSliderData';

interface ChannelsSliderOverlayContentProps {
  onSelectChannel?: (channelId: string, model?: LiveStreamChannel) => void;
  onOpenFullLiveScreen?: () => void;
  currentChannelId?: string;
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export const ChannelsSliderOverlayContent: React.FC<ChannelsSliderOverlayContentProps> = ({
  onSelectChannel,
  onOpenFullLiveScreen,
  currentChannelId,
  theme = 'dark',
  compact = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderTrackRef.current) {
      sliderTrackRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth'
      });
    }
  };

  const filteredChannels = LIVE_STREAM_CHANNELS_DATA.filter(c => {
    if (selectedCategory === 'todos') return true;
    return c.category === selectedCategory;
  });

  const handleChannelClick = (cat: ChannelCategory) => {
    setSelectedCategory(cat.id);
    if (onSelectChannel) {
      onSelectChannel(cat.id);
    }
  };

  const handleLaunchLiveStream = (stream: LiveStreamChannel) => {
    if (onSelectChannel) {
      onSelectChannel(stream.category, stream);
    }
    if (onOpenFullLiveScreen) {
      onOpenFullLiveScreen();
    } else {
      window.dispatchEvent(new CustomEvent('open-live-videos-screen', { detail: stream }));
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3 text-left font-sans select-none" id="z-png-channels-slider-container">
      {/* 🔝 CABECERA DEL SLIDER (Captura image.png integrada en captura z.png) */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] sm:text-[11.5px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-display">
            <span className="w-2 h-2 rounded-full bg-[#fe2c55] animate-ping" />
            <Radio className="w-3.5 h-3.5 text-[#fe2c55]" />
            CANALES EN DIRECTO ({CHANNELS_SLIDER_CATEGORIES.length - 1})
          </span>
          <span className="text-[9px] text-slate-400 font-semibold hidden sm:inline">
            • Slider de Especialidades (image.png)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenFullLiveScreen && (
            <button
              type="button"
              onClick={onOpenFullLiveScreen}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:opacity-90 active:scale-95 text-white rounded-full text-[9.5px] sm:text-[10px] font-black tracking-tight transition cursor-pointer shadow-md"
              title="Abrir pantalla completa de videos en directo (image.png)"
            >
              <Tv className="w-3 h-3 text-white" />
              <span>Ver Todos en Directo</span>
            </button>
          )}

          {/* Slider Arrows */}
          <button
            type="button"
            onClick={() => scrollSlider('left')}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800/90 hover:bg-slate-700 active:scale-90 border border-slate-700 text-slate-200 flex items-center justify-center transition cursor-pointer"
            title="Anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => scrollSlider('right')}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800/90 hover:bg-slate-700 active:scale-90 border border-slate-700 text-slate-200 flex items-center justify-center transition cursor-pointer"
            title="Siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 🎠 SLIDER HORIZONTAL DE CANALES CON IMAGEN PROPIA (Solicitado para image.png y ahora visible en z.png) */}
      <div 
        ref={sliderTrackRef}
        className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth scrollbar-none snap-x w-full"
        id="z-png-channels-track"
      >
        {CHANNELS_SLIDER_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleChannelClick(cat)}
              className={`shrink-0 flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none group relative snap-start active:scale-95 ${
                isSelected
                  ? 'bg-slate-900 text-white border-rose-500 shadow-lg shadow-rose-950/50 ring-2 ring-rose-500/40'
                  : 'bg-[#141926] hover:bg-[#1c2336] text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Imagen propia del canal */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10 shadow-inner">
                <img 
                  src={cat.image} 
                  alt={cat.label} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isSelected ? 'from-slate-950/80' : 'from-black/60'} to-transparent`} />
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white animate-pulse" />
              </div>

              {/* Nombre y contador de directos activos */}
              <div className="min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className={`text-[7.5px] font-black uppercase tracking-wider px-1 py-0.2 rounded leading-none ${
                    isSelected 
                      ? 'bg-red-500/30 text-rose-300 border border-red-500/50' 
                      : 'bg-red-950/60 text-rose-400 border border-red-900/40'
                  }`}>
                    LIVE
                  </span>
                  {cat.count && cat.count !== '3 en Vivo' && (
                    <span className="text-[8px] font-mono text-slate-400 font-bold">
                      {cat.count}
                    </span>
                  )}
                </div>
                <h4 className={`font-black truncate max-w-[120px] leading-tight text-white group-hover:text-rose-400 transition-colors ${
                  cat.id === 'runway_model' || cat.label.toLowerCase().includes('runway')
                    ? 'text-[8.5px] sm:text-[9px]'
                    : cat.id === 'catalog_model' || cat.label.toLowerCase().includes('catalog')
                    ? 'text-[8.5px] sm:text-[9px]'
                    : cat.id === 'fashion_model' || cat.label.toLowerCase().includes('fashion') || cat.id === 'streetwear' || cat.label.toLowerCase().includes('streetwear') || cat.label.toLowerCase().includes('urban')
                    ? 'text-[8.5px] sm:text-[9px]'
                    : cat.id === 'haute_couture' || cat.label.toLowerCase().includes('haute') || cat.id === 'commercial_model' || cat.label.toLowerCase().includes('commercial') || cat.id === 'plus_size_model' || cat.label.toLowerCase().includes('plus') || cat.id === 'petite_model' || cat.label.toLowerCase().includes('petite') || cat.id === 'lingerie_model' || cat.label.toLowerCase().includes('lingerie') || cat.id === 'swimsuit_model' || cat.label.toLowerCase().includes('swimsuit') || cat.id === 'fitness_model' || cat.label.toLowerCase().includes('fitness') || cat.id === 'parts_model' || cat.label.toLowerCase().includes('parts') || cat.id === 'mature_model' || cat.label.toLowerCase().includes('mature') || cat.id === 'real_people_models' || cat.label.toLowerCase().includes('real people')
                    ? 'text-[8.5px] sm:text-[9px]'
                    : 'text-[9.5px] sm:text-[10px]'
                }`}>
                  {cat.label}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* 📺 TARJETAS DE VIDEOS EN DIRECTO DE LA CATEGORÍA SELECCIONADA */}
      <div className="space-y-1.5 pt-0.5 border-t border-slate-800/80">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[9.5px] sm:text-[10px] text-slate-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Transmisiones en vivo de {CHANNELS_SLIDER_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'este canal'}:
          </span>
          <span className="text-[9px] text-emerald-400 font-mono font-bold">
            {filteredChannels.length} stream{filteredChannels.length === 1 ? '' : 's'} disponible{filteredChannels.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Rejilla de streams interactivos */}
        <div className="grid grid-cols-2 gap-2 max-h-[30vh] sm:max-h-[32vh] overflow-y-auto p-1 rounded-2xl bg-[#090D15]/80 border border-slate-800 shadow-inner scrollbar-none">
          {filteredChannels.slice(0, 4).map(stream => (
            <div
              key={stream.id}
              onClick={() => handleLaunchLiveStream(stream)}
              className="group/card relative rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-rose-500/80 transition-all duration-300 cursor-pointer p-2 flex flex-col justify-between min-h-[96px] active:scale-98 hover:shadow-lg hover:shadow-rose-950/30 text-left"
            >
              {/* Top row in card: Avatar, Name, Viewers */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src={stream.avatar} 
                      alt={stream.name} 
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#fe2c55]"
                    />
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] font-black text-white truncate max-w-[85px] leading-none">
                        {stream.name}
                      </span>
                      {stream.isVerified && <CheckCircle2 className="w-2.5 h-2.5 text-blue-400 shrink-0" />}
                    </div>
                    <span className="text-[8px] text-slate-400 block truncate leading-tight">
                      @{stream.username}
                    </span>
                  </div>
                </div>

                {/* Viewers pill */}
                <span className="flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded-full text-[8px] font-mono text-rose-400 font-bold shrink-0 border border-white/5">
                  <Eye className="w-2.5 h-2.5 text-rose-500" />
                  {stream.viewers >= 1000 ? `${(stream.viewers/1000).toFixed(1)}k` : stream.viewers}
                </span>
              </div>

              {/* Title / Description */}
              <p className="text-[9px] text-slate-200 line-clamp-2 font-medium leading-snug my-1 group-hover/card:text-rose-300 transition-colors">
                {stream.title}
              </p>

              {/* Bottom Action in Card: Ver Directo */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-auto">
                <span className="text-[7.5px] font-black uppercase text-amber-400 px-1 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 truncate max-w-[70px]">
                  {stream.categoryLabel}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchLiveStream(stream);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white text-[8.5px] font-black uppercase tracking-tight transition active:scale-95 shadow-xs cursor-pointer"
                >
                  <Play className="w-2 h-2 fill-current" />
                  <span>Ver Directo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ChannelsSliderOverlayContent;
