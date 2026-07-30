/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ModelProfile } from '../types';
import { Heart, Users, Search, MessageCircle, X, Award, ExternalLink, ArrowRight, Instagram, Sparkles, Camera, Plus, Check, FileText } from 'lucide-react';

interface ModelGridProps {
  models: ModelProfile[];
  currentSponsorId?: string;
  onSelectSponsor: (modelId: string) => void;
  onLikePhoto: (modelId: string) => void;
  onOpenChatWithModel: (modelId: string) => void;
  onUpdateModels?: (nextModels: ModelProfile[]) => void;
  selectedModel?: ModelProfile | null;
  onSelectModel?: (model: ModelProfile | null) => void;
}

export default function ModelGrid({
  models,
  currentSponsorId,
  onSelectSponsor,
  onLikePhoto,
  onOpenChatWithModel,
  onUpdateModels,
  selectedModel: propSelectedModel,
  onSelectModel: propOnSelectModel
}: ModelGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedModel, setLocalSelectedModel] = useState<ModelProfile | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'online'>('all');

  // Interactive corporate sponsorship agreement states
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [agreementCompany, setAgreementCompany] = useState('');
  const [agreementAmount, setAgreementAmount] = useState('25000');
  const [agreementCampaign, setAgreementCampaign] = useState('Colección Cápsula Internacional - Verano');
  const [signedAgreements, setSignedAgreements] = useState<Record<string, { company: string, amount: string, campaign: string }>>({});

  const selectedModel = propSelectedModel !== undefined ? propSelectedModel : localSelectedModel;
  const setSelectedModel = (model: ModelProfile | null) => {
    setShowAgreementForm(false);
    if (propOnSelectModel) {
      propOnSelectModel(model);
    } else {
      setLocalSelectedModel(model);
    }
  };

  // Filter models based on search query AND online/Casting live status
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterStatus === 'online') {
        return matchesSearch && (m.isOnline || m.isCastingLive);
      }
      return matchesSearch;
    });
  }, [models, searchQuery, filterStatus]);

  // Compute live Top 10 rankings for user profile sidebar
  const top10Models = useMemo(() => {
    return [...models].sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 10);
  }, [models]);

  const handlePhotoLike = (modelId: string) => {
    onLikePhoto(modelId);
    // Sync local selected model state after likes modification
    if (selectedModel && selectedModel.id === modelId) {
      const updated = models.find(m => m.id === modelId);
      if (updated) {
        setSelectedModel({
          ...updated,
          totalLikes: updated.totalLikes + 1
        });
      }
    }
  };

  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleUploadPhoto = (modelId: string, url: string) => {
    if (!url.trim()) return;

    const nextModels = models.map(m => {
      if (m.id === modelId) {
        return {
          ...m,
          photos: [url.trim(), ...m.photos],
          totalLikes: m.totalLikes + 10 // Give bonus likes
        };
      }
      return m;
    });

    if (onUpdateModels) {
      onUpdateModels(nextModels);
    }

    // Update selected model view locally
    if (selectedModel && selectedModel.id === modelId) {
      setSelectedModel({
        ...selectedModel,
        photos: [url.trim(), ...selectedModel.photos],
        totalLikes: selectedModel.totalLikes + 10
      });
    }

    setNewPhotoUrl('');
    alert('📸 ¡Nueva foto de moda agregada al perfil con éxito! Se sumaron 10 likes adicionales en el ranking.');
  };

  return (
    <div className="space-y-6" id="models-grid-section">
      {/* Search, Title and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-xl font-display font-medium text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>Nuestros 50 Modelos Patrocinadores</span>
          </h3>
          <p className="text-sm text-slate-500">
            Los mejores modelos que han clasificado en nuestro ranking de likes. Sé patrocinado por uno de ellos.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Status Quick Filters */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-800 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('online')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === 'online'
                  ? 'bg-rose-500 text-white shadow-3xs'
                  : 'text-slate-500 hover:text-rose-650'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${filterStatus === 'online' ? 'bg-white animate-ping' : 'bg-red-500'}`} />
              Online / Live 🎥
            </button>
          </div>

          <div className="relative w-full sm:w-64 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar modelo o influencer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Grid of Models */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredModels.map((model, idx) => {
          // Find ranking in sorted models
          const overallRank = models.findIndex(m => m.id === model.id) + 1;
          const isSponsored = currentSponsorId === model.id;

          return (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all cursor-pointer relative flex flex-col justify-between"
            >
              {/* Badge ranking */}
              <div className="absolute top-2 left-2 z-10 bg-slate-900/85 backdrop-blur-xs text-amber-400 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs">
                <Award className="w-3 h-3" />
                <span>#{overallRank}</span>
              </div>

              {/* Status & Patronage Badges stacked on top-right */}
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end pointer-events-none">
                {isSponsored && (
                  <div className="bg-indigo-600 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    Mi Patrocinador
                  </div>
                )}
                {model.isCastingLive ? (
                  <div className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-1 border border-rose-400 animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-white inline-block animate-ping" />
                    <span>CASTING LIVE</span>
                  </div>
                ) : model.isOnline ? (
                  <div className="bg-emerald-600/95 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-1 backdrop-blur-xs">
                    <span className="w-1 h-1 rounded-full bg-emerald-300 inline-block animate-pulse" />
                    <span>ONLINE</span>
                  </div>
                ) : null}
              </div>

              {/* Photo Area */}
              <div className={`aspect-square relative overflow-hidden bg-slate-100 shrink-0 transition-all ${
                model.isCastingLive ? 'ring-2 ring-offset-2 ring-rose-500' : ''
              }`}>
                <img
                  src={model.avatar}
                  alt={model.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Stats Overlay */}
                <div className="absolute bottom-2 left-2 right-2 text-white flex justify-between items-center text-xs">
                  <span className="font-mono text-[11px] font-medium truncate max-w-[65%]">@{model.username}</span>
                  <div className="flex items-center gap-1 font-semibold text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{model.totalLikes}</span>
                  </div>
                </div>
              </div>

              {/* Text Meta */}
              <div className="p-3 flex-1 flex flex-col justify-between bg-slate-50/50">
                <div className="mb-2">
                  <h4 className="font-medium text-slate-800 text-xs sm:text-sm line-clamp-1">{model.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{model.bio}</p>
                </div>

                <div className="pt-2 border-t border-slate-150 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-500" />
                    <strong>{model.referidosCount}</strong> refs
                  </span>
                  <span className="text-indigo-600 font-medium group-hover:underline flex items-center gap-0.5">
                    Ver perfil
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredModels.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No se han encontrado modelos para "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
