import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, Trophy, Users, MessageSquare, Download, RefreshCw, X, Play, Clock, Sparkles, ChevronRight, FileText } from 'lucide-react';
import { 
  getAllRoundDatabases, 
  getRoundDatabase, 
  celebrateRoundDatabase, 
  resetAllRoundsDatabase, 
  exportRoundDatabaseJSON, 
  ROUND_CATEGORIES,
  resolveCategoryKey,
  formatRoundRef,
  getCategoryCelebratedCount
} from '../utils/roundsDatabase';
import type { RoundDatabaseRecord, RoundCategoryKey } from '../types';

interface RoundDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryKey?: RoundCategoryKey;
  initialRoundId?: string;
  onSelectRound?: (roundId: string) => void;
}

export const RoundDatabaseModal: React.FC<RoundDatabaseModalProps> = ({
  isOpen,
  onClose,
  initialCategoryKey,
  initialRoundId,
  onSelectRound
}) => {
  const [rounds, setRounds] = useState<RoundDatabaseRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RoundCategoryKey | 'all'>(initialCategoryKey || 'all');
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(initialRoundId || null);
  const [activeTab, setActiveTab] = useState<'details' | 'json' | 'participants'>('details');
  const [copiedJson, setCopiedJson] = useState(false);
  const [celebrationSuccessMessage, setCelebrationSuccessMessage] = useState<string | null>(null);

  const loadData = () => {
    const list = getAllRoundDatabases();
    setRounds(list);
    if (!selectedRoundId && list.length > 0) {
      if (initialRoundId) {
        const found = list.find(r => r.id === initialRoundId);
        if (found) {
          setSelectedRoundId(found.id);
          return;
        }
      }
      setSelectedRoundId(list[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (initialCategoryKey) {
        setSelectedCategory(initialCategoryKey);
      }
      if (initialRoundId) {
        setSelectedRoundId(initialRoundId);
      }
    }
  }, [isOpen, initialCategoryKey, initialRoundId]);

  useEffect(() => {
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('rounds-database-updated', handleUpdate);
    window.addEventListener('round-celebrated', handleUpdate);
    return () => {
      window.removeEventListener('rounds-database-updated', handleUpdate);
      window.removeEventListener('round-celebrated', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const filteredRounds = rounds.filter(r => {
    if (selectedCategory === 'all') return true;
    return r.categoryKey === selectedCategory;
  });

  const selectedRecord = rounds.find(r => r.id === selectedRoundId) || filteredRounds[0] || null;

  const handleCelebrate = (record: RoundDatabaseRecord) => {
    const res = celebrateRoundDatabase(record.id);
    loadData();
    setSelectedRoundId(res.nextRound.id);
    setCelebrationSuccessMessage(`¡${record.title} (${record.reference}) celebrada con éxito! Se ha generado la siguiente ronda con su propia base de datos: ${res.nextRound.reference}`);
    setTimeout(() => {
      setCelebrationSuccessMessage(null);
    }, 6000);
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas reiniciar todas las bases de datos de rondas al estado inicial (Ronda #0 / REF: 1)?')) {
      resetAllRoundsDatabase();
      loadData();
      setCelebrationSuccessMessage('Bases de datos reiniciadas a Ronda #0 (REF: 1) para todas las categorías.');
      setTimeout(() => setCelebrationSuccessMessage(null), 4000);
    }
  };

  const handleDownloadJSON = (record: RoundDatabaseRecord) => {
    const jsonStr = exportRoundDatabaseJSON(record);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bd_${record.categoryKey}_${record.reference.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = (record: RoundDatabaseRecord) => {
    const jsonStr = exportRoundDatabaseJSON(record);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-[#0b101d] border border-cyan-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#070b14]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  Base de Datos Oficial de Rondas
                </h2>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  Independiente por Ronda
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Cada ronda se enumera desde el <strong>0 en adelante</strong> y genera su propio archivo de base de datos único (REF: 1, REF: 2...)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Reiniciar contadores y bases de datos"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {celebrationSuccessMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/50 px-4 py-2.5 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{celebrationSuccessMessage}</span>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-3 overflow-x-auto no-scrollbar border-b border-slate-800/80 bg-[#090d18]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Todas las Rondas ({rounds.length})
          </button>
          {(Object.keys(ROUND_CATEGORIES) as RoundCategoryKey[]).map(catKey => {
            const conf = ROUND_CATEGORIES[catKey];
            const count = rounds.filter(r => r.categoryKey === catKey).length;
            const celebrated = getCategoryCelebratedCount(catKey);
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === catKey
                    ? 'bg-rose-600 text-white font-black shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{conf.title}</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full font-mono text-amber-300">
                  {conf.entryFee}€ • {count} BD
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content: Left List / Right Details */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Rounds List */}
          <div className="md:col-span-4 border-r border-slate-800 bg-[#070b14]/60 overflow-y-auto max-h-[350px] md:max-h-none p-3 space-y-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 flex items-center justify-between">
              <span>RONDAS REGISTRADAS ({filteredRounds.length})</span>
              <span>ESTADO</span>
            </div>

            {filteredRounds.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No hay bases de datos para este filtro.
              </div>
            ) : (
              filteredRounds.map((record) => {
                const isSelected = record.id === selectedRoundId;
                const isCompleted = record.status === 'completed';
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRoundId(record.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                        {record.reference}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        Índice: #{record.roundIndex}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      }`}>
                        {isCompleted ? '✓ Celebrada' : '● En Curso'}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-white truncate">
                      {record.title}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{record.entryFee}€ Inscripción</span>
                      <span>10 Participantes</span>
                      {record.results?.winners?.[0] && (
                        <span className="text-amber-300 truncate max-w-[100px]">
                          🏆 {record.results.winners[0].name.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    <div className="text-[9px] text-slate-500 font-mono truncate">
                      DB: ronda_db_{record.id}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Database Inspection & Actions */}
          <div className="md:col-span-8 flex flex-col bg-[#0b101d] overflow-y-auto">
            {selectedRecord ? (
              <div className="p-4 sm:p-6 space-y-5">
                {/* Header of selected round */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0e1628] border border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-amber-300 font-mono bg-amber-400/20 border border-amber-400/60 px-2.5 py-0.5 rounded-full">
                        {selectedRecord.reference}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (Índice de Ronda: #{selectedRecord.roundIndex})
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        selectedRecord.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {selectedRecord.status === 'completed' ? 'Ronda Celebrada' : 'Ronda Activa / En Curso'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      {selectedRecord.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedRecord.brand}
                    </p>
                  </div>

                  {/* Quick Action: Celebrate & advance */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    {selectedRecord.status !== 'completed' ? (
                      <button
                        onClick={() => handleCelebrate(selectedRecord)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Finaliza esta ronda, guarda su base de datos y genera la siguiente con REF: +1"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Celebrar y Generar {formatRoundRef(selectedRecord.roundIndex + 2)}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Base de datos archivada permanentemente</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Database Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Inscripción</span>
                    <span className="text-base font-black text-white font-mono">{selectedRecord.entryFee}€</span>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Participantes</span>
                    <span className="text-base font-black text-white font-mono">{selectedRecord.participants.length} / 10</span>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Bote Recaudado</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {(selectedRecord.entryFee * selectedRecord.participants.length).toLocaleString()}€
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Clave Storage</span>
                    <span className="text-[10px] font-mono text-cyan-300 truncate block">ronda_db_{selectedRecord.id}</span>
                  </div>
                </div>

                {/* View Tabs */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        activeTab === 'details'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Resumen & Ganador
                    </button>
                    <button
                      onClick={() => setActiveTab('participants')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        activeTab === 'participants'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      10 Participantes & Votos
                    </button>
                    <button
                      onClick={() => setActiveTab('json')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        activeTab === 'json'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver BD en JSON</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyJSON(selectedRecord)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition cursor-pointer"
                      title="Copiar JSON de la base de datos"
                    >
                      {copiedJson ? '✓ Copiado' : 'Copiar JSON'}
                    </button>
                    <button
                      onClick={() => handleDownloadJSON(selectedRecord)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Descargar archivo JSON"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar</span>
                    </button>
                  </div>
                </div>

                {/* Tab 1: Details */}
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    {selectedRecord.results?.winners && selectedRecord.results.winners.length > 0 ? (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-xl shrink-0">
                          👑
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
                            GANADOR OFICIAL REGISTRADO EN ESTA BASE DE DATOS
                          </div>
                          <div className="text-base font-black text-white">
                            {selectedRecord.results.winners[0].name}
                          </div>
                          <div className="text-xs text-slate-300">
                            Premio adjudicado: <strong className="text-emerald-400">{selectedRecord.results.winners[0].prize.toLocaleString()}€</strong> • Votos: {selectedRecord.results.winners[0].votes}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                        <span>Ronda actualmente en votación/exposición. Pulsa el botón de celebrar para registrar el ganador y cerrar esta base de datos.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Fecha de Creación</span>
                        <span className="text-slate-300 font-mono">{new Date(selectedRecord.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Fecha de Celebración</span>
                        <span className="text-slate-300 font-mono">
                          {selectedRecord.celebratedAt ? new Date(selectedRecord.celebratedAt).toLocaleString() : 'Pendiente de celebración'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Participants */}
                {activeTab === 'participants' && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      10 Participantes almacenados en esta base de datos:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedRecord.participants.map((p, idx) => (
                        <div key={p.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[10px] font-mono text-slate-500 w-4">#{idx + 1}</span>
                            <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{p.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{p.projectTitle || p.role}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30 shrink-0">
                            {p.votesReceived || 0} votos
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: JSON View */}
                {activeTab === 'json' && (
                  <div className="relative">
                    <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-[360px] select-text">
                      {exportRoundDatabaseJSON(selectedRecord)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Selecciona una ronda para inspeccionar su base de datos.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-[#070b14] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Regla activa: Cada ronda tiene su propia base de datos y se enumeran desde el 0 en adelante (REF: 1, REF: 2...)</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
