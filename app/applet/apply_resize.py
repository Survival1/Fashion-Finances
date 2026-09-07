with open('src/components/CastingLiveSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

idx_screen_start = content.find('{/* 🖥️ POPUP MODAL: OPCIONES DE COMPARTIR PANTALLA */}')
idx_duo_start = content.find('{/* 👯 POPUP MODAL: OPCIONES DE DÚO')
idx_duo_end = content.find('/* 🔴 OPCIÓN PRINCIPAL HABITUAL: DÚO COMERCIAL', idx_duo_start)

assert idx_screen_start != -1, "Screen modal start not found"
assert idx_duo_start != -1, "Duo modal start not found"
assert idx_duo_end != -1, "Duo modal end not found"

old_section = content[idx_screen_start:idx_duo_end]

new_section = """{/* 🖥️ POPUP MODAL: OPCIONES DE COMPARTIR PANTALLA */}
                {showScreenShareMenu && (
                  <div className="absolute left-2 right-2 sm:left-4 sm:right-4 top-2 sm:top-4 z-[120] bg-white/98 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border-2 border-indigo-500 shadow-2xl animate-fade-in text-slate-900 font-sans text-left space-y-3.5 pointer-events-auto max-w-lg mx-auto box-border" id="screen-share-options-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                          <Monitor className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm md:text-base font-black uppercase text-slate-900 tracking-wider truncate m-0">
                            Opciones de Compartir Pantalla
                          </h4>
                          <span className="text-[11px] sm:text-xs text-indigo-700 font-bold block truncate mt-0.5">
                            Elige la fuente de pantalla que deseas transmitir en directo
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowScreenShareMenu(false)}
                        className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-full w-9 h-9 flex items-center justify-center transition cursor-pointer shrink-0 border border-slate-200 shadow-xs active:scale-95"
                        title="Cerrar"
                        id="btn-close-screen-share-modal"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {/* Opciones directas de Compartir Pantalla */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      {/* 1. Toda la pantalla */}
                      <button
                        type="button"
                        onClick={() => handleStartSpecificScreenShare('full')}
                        className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 active:scale-95 min-h-[95px] sm:min-h-[110px] ${
                          isScreenSharingActive && screenShareMode === 'full' && activeScreenSharer === 'host'
                            ? 'bg-indigo-100 border-indigo-600 text-indigo-950 font-black ring-2 ring-indigo-400 shadow-md'
                            : 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 hover:border-indigo-300 text-slate-900 font-bold shadow-2xs'
                        }`}
                        id="btn-share-full-screen"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xl sm:text-2xl">🖥️</span>
                          {isScreenSharingActive && screenShareMode === 'full' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Toda la Pantalla</span>
                          <span className="text-[10px] sm:text-[11px] md:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Monitor completo o escritorio</span>
                        </div>
                      </button>

                      {/* 2. Ventana de Aplicación */}
                      <button
                        type="button"
                        onClick={() => handleStartSpecificScreenShare('window')}
                        className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 active:scale-95 min-h-[95px] sm:min-h-[110px] ${
                          isScreenSharingActive && screenShareMode === 'window' && activeScreenSharer === 'host'
                            ? 'bg-purple-100 border-purple-600 text-purple-950 font-black ring-2 ring-purple-400 shadow-md'
                            : 'bg-slate-50 hover:bg-purple-50/70 border-slate-200 hover:border-purple-300 text-slate-900 font-bold shadow-2xs'
                        }`}
                        id="btn-share-window"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xl sm:text-2xl">🪟</span>
                          {isScreenSharingActive && screenShareMode === 'window' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Ventana de App</span>
                          <span className="text-[10px] sm:text-[11px] md:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Aplicación o ventana de software</span>
                        </div>
                      </button>

                      {/* 3. Pestaña del Navegador */}
                      <button
                        type="button"
                        onClick={() => handleStartSpecificScreenShare('tab')}
                        className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 active:scale-95 min-h-[95px] sm:min-h-[110px] ${
                          isScreenSharingActive && screenShareMode === 'tab' && activeScreenSharer === 'host'
                            ? 'bg-rose-100 border-rose-600 text-rose-950 font-black ring-2 ring-rose-400 shadow-md'
                            : 'bg-slate-50 hover:bg-rose-50/70 border-slate-200 hover:border-rose-300 text-slate-900 font-bold shadow-2xs'
                        }`}
                        id="btn-share-tab"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xl sm:text-2xl">🌐</span>
                          {isScreenSharingActive && screenShareMode === 'tab' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Pestaña Web</span>
                          <span className="text-[10px] sm:text-[11px] md:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Navegador con audio de pestaña</span>
                        </div>
                      </button>

                      {/* 4. Presentation / Slides */}
                      <button
                        type="button"
                        onClick={() => handleStartSpecificScreenShare('presentation')}
                        className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 active:scale-95 min-h-[95px] sm:min-h-[110px] ${
                          isScreenSharingActive && screenSplitLayout === 'presentation'
                            ? 'bg-amber-100 border-amber-600 text-amber-950 font-black ring-2 ring-amber-400 shadow-md'
                            : 'bg-amber-50/70 hover:bg-amber-100 border-amber-200 hover:border-amber-400 text-slate-900 font-bold shadow-2xs'
                        }`}
                        id="btn-share-slides"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xl sm:text-2xl">📊</span>
                          {isScreenSharingActive && screenSplitLayout === 'presentation' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Diapositivas / Slides</span>
                          <span className="text-[10px] sm:text-[11px] md:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Presentación de catálogo y pasarela</span>
                        </div>
                      </button>
                    </div>

                    {/* Co-Presenters Screen Share Switcher */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <span className="text-xs sm:text-[13px] font-black uppercase text-indigo-950 flex items-center gap-1.5">
                        👥 Emitir Pantalla de Invitados / Co-Presentadores:
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                        {[
                          { id: 'host', name: 'Mi Pantalla (Anfitrión)', avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150' },
                          { id: 'g-1', name: 'Isabela Dubois', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
                          { id: 'g-2', name: 'Carlos Ruiz', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
                        ].map((comp) => (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => {
                              setActiveScreenSharer(comp.id);
                              setIsScreenSharingActive(true);
                              setShowScreenShareMenu(false);
                              alert(`💻 Transmitiendo pantalla de ${comp.name} en el directo.`);
                            }}
                            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-extrabold flex items-center gap-2 border transition cursor-pointer shrink-0 min-h-[42px] active:scale-95 ${
                              activeScreenSharer === comp.id && isScreenSharingActive
                                ? 'bg-indigo-600 text-white border-indigo-700 font-black shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-2xs'
                            }`}
                            id={`btn-sharer-${comp.id}`}
                          >
                            <img src={comp.avatar} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-slate-300" alt="" />
                            <span>{comp.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stop Screen Sharing Button if Active */}
                    {isScreenSharingActive && (
                      <button
                        type="button"
                        onClick={() => {
                          if (screenShareStream) {
                            try { screenShareStream.getTracks().forEach(t => t.stop()); } catch(e){}
                            setScreenShareStream(null);
                          }
                          setIsScreenSharingActive(false);
                          setShowScreenShareMenu(false);
                          alert('🛑 Compartición de pantalla finalizada.');
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer shadow-sm border-0 active:scale-95 text-center block min-h-[42px]"
                        id="btn-stop-screen-share"
                      >
                        🛑 Detener Compartición de Pantalla
                      </button>
                    )}
                  </div>
                )}

                {/* 👯 POPUP MODAL: OPCIONES DE DÚO Y DÚO COMERCIAL (OCUPA TODO EL CANAL DE VÍDEO) */}
                {showDuoMenu && (
                  <div className="absolute inset-0 z-[86] bg-white/98 backdrop-blur-2xl p-3.5 sm:p-5 rounded-3xl border-2 border-[#fe2c55] shadow-2xl animate-fade-in text-slate-900 font-sans text-left pointer-events-auto h-full w-full overflow-y-auto flex flex-col gap-3" id="duo-collaboration-modal">
                    <div className="relative border-b border-slate-200 pb-2.5 pr-11 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowDuoMenu(false)}
                        className="absolute top-0 right-0 p-2 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-full w-9 h-9 flex items-center justify-center transition cursor-pointer shrink-0 z-10 border border-slate-300 shadow-xs active:scale-95"
                        title="Cerrar"
                        id="btn-close-duo-modal"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-[#fe2c55]" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm md:text-base font-black uppercase text-slate-900 tracking-wider m-0 leading-tight flex flex-wrap items-center gap-1.5">
                            <span>
                              {selectedCategoryFilter === 'Finanzas'
                                ? '👯 SERVICIOS DÚO Y COLABORACIÓN (FINANZAS)'
                                : '👯 OPCIONES DE DÚO Y COLABORACIÓN'}
                            </span>
                            <span className="text-[9px] sm:text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-black shrink-0">EN VIVO</span>
                          </h4>
                          <span className="text-[11px] sm:text-xs text-rose-700 font-bold block truncate mt-0.5">
                            {selectedCategoryFilter === 'Finanzas'
                              ? 'Servicios de interconexión y producción en directo para Finanzas'
                              : 'Transmite en pareja con Vendedores, Influencers, Modelos y Creadores'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedCategoryFilter === 'Finanzas' ? (
                      /* 📈 SERVICIOS EXCLUSIVOS Y ESENCIALES PARA CANAL FINANZAS (MÁX. 10 PARTICIPANTES - ESTILO TIKTOK) */
                      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
                        {finanzasDuoSubTool === 'menu' ? (
                          <>
                            <div className="bg-gradient-to-r from-emerald-50 via-rose-50 to-amber-50 p-3 rounded-2xl border border-rose-200 text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                              📊 <strong className="font-extrabold text-slate-900">Funciones Principales de Colaboración:</strong> Conecta hasta con <span className="font-extrabold text-rose-600 underline">10 analistas y creadores</span> simultáneamente, activa debates 1 a 1 con pantalla dividida 50/50, gestiona solicitudes o emite gráficos y balances en tiempo real.
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                              {/* 1. Invitar Creador o Usuario */}
                              <button
                                type="button"
                                onClick={() => setFinanzasDuoSubTool('invitar')}
                                className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-md active:scale-95 min-h-[92px]"
                                id="btn-duo-tool-invitar"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xl sm:text-2xl">👤</span>
                                  <span className="text-[10px] sm:text-[11px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-lg border border-rose-200">
                                    {Object.keys(invitedUsersMap).filter(k => invitedUsersMap[k]).length} Invitados
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">1. Invitar Creador / Usuario</span>
                                  <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Buscar creadores y enviar invitación para unirse al directo</span>
                                </div>
                              </button>

                              {/* 2. Aceptar Solicitudes de Espectadores */}
                              <button
                                type="button"
                                onClick={() => setFinanzasDuoSubTool('solicitudes')}
                                className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/50 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-md active:scale-95 min-h-[92px]"
                                id="btn-duo-tool-solicitudes"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xl sm:text-2xl">✅</span>
                                  <span className="text-[10px] sm:text-[11px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-lg border border-emerald-200">
                                    {financeRequestsList.filter(r => r.status === 'pending').length} Pendientes
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">2. Aceptar Solicitudes</span>
                                  <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Aprobar o rechazar espectadores en lista de espera</span>
                                </div>
                              </button>

                              {/* 3. Dúo 1 a 1 (Pantalla Dividida 50/50) */}
                              <button
                                type="button"
                                onClick={() => setFinanzasDuoSubTool('duo1a1')}
                                className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-md active:scale-95 min-h-[92px]"
                                id="btn-duo-tool-duo1a1"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xl sm:text-2xl">👥</span>
                                  <span className="text-[10px] sm:text-[11px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-lg border border-indigo-200">
                                    {screenSplitLayout === '50-50' ? '🟢 Activo' : '50 / 50'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">3. Dúo 1 a 1 (50/50)</span>
                                  <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Emisión compartida simétrica con 1 anfitrión invitado</span>
                                </div>
                              </button>

                              {/* 4. Transmisión con Múltiples Invitados (Hasta 10) */}
                              <button
                                type="button"
                                onClick={() => setFinanzasDuoSubTool('multiples')}
                                className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50/50 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-md active:scale-95 min-h-[92px]"
                                id="btn-duo-tool-multiples"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xl sm:text-2xl">👨‍👩‍👧‍👦</span>
                                  <span className="text-[10px] sm:text-[11px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-lg border border-purple-200">
                                    {screenSplitLayout === 'grid-4' || screenSplitLayout === 'grid-9' ? '🟢 Multianfitrión' : '10 Slots'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">4. Multianfitrión (Hasta 10)</span>
                                  <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Mesa redonda financiera con panelistas en cuadrícula</span>
                                </div>
                              </button>

                              {/* 5. Dúo de Solo Audio */}
                              <button
                                type="button"
                                onClick={() => setFinanzasDuoSubTool('audio')}
                                className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-md active:scale-95 min-h-[92px]"
                                id="btn-duo-tool-audio"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xl sm:text-2xl">🎙️</span>
                                  <span className="text-[10px] sm:text-[11px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-lg border border-amber-200">
                                    {isAudioOnlyDuo ? '🟢 Audio ON' : 'Podcast Mode'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">5. Dúo Solo Audio</span>
                                  <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Intervención por voz y podcast sin activar cámara</span>
                                </div>
                              </button>

                              {/* 6. Compartir Pantalla */}
                              <button
                                type="button"
                                onClick={() => setFinanzasDuoSubTool('pantalla')}
                                className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-400 bg-white hover:bg-cyan-50/50 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-md active:scale-95 min-h-[92px]"
                                id="btn-duo-tool-pantalla"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xl sm:text-2xl">🖥️</span>
                                  <span className="text-[10px] sm:text-[11px] bg-cyan-100 text-cyan-800 font-extrabold px-2 py-0.5 rounded-lg border border-cyan-200">
                                    {isScreenSharingActive ? '🟢 Compartiendo' : '1080p'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">6. Compartir Pantalla</span>
                                  <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Transmitir TradingView, gráficos y balances al directo</span>
                                </div>
                              </button>

                              {/* 7. Controles y Moderación */}
                              <button
                                type="button"
                                onClick={() => setFinanzasDuoSubTool('controles')}
                                className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 text-left transition cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-md active:scale-95 min-h-[92px] sm:col-span-2"
                                id="btn-duo-tool-controles"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xl sm:text-2xl">🎛️</span>
                                  <span className="text-[10px] sm:text-[11px] bg-slate-100 text-slate-800 font-extrabold px-2 py-0.5 rounded-lg border border-slate-200">
                                    Panel Host
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">7. Moderación y Controles del Anfitrión</span>
                                  <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Silenciar participantes, desactivar cámaras y gestionar turnos de palabra</span>
                                </div>
                              </button>
                            </div>
                          </>
                        ) : (
                          /* SUB-VISTAS DE LAS 7 HERRAMIENTAS DE FINANZAS */
                          <div className="space-y-3">
                            {/* HEADER DE NAVEGACIÓN SUBTABS */}
                            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  setFinanzasDuoSubTool('menu');
                                  setIsFinanzasDuoDropdownOpen(false);
                                }}
                                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-900 hover:text-rose-700 text-xs sm:text-[13px] font-black rounded-xl transition cursor-pointer border border-slate-300 hover:border-rose-300 active:scale-95 shrink-0 shadow-2xs min-h-[42px]"
                                id="btn-volver-menu-duo"
                              >
                                <ArrowLeft className="w-4 h-4 text-rose-600 stroke-[3]" />
                                <span>← Volver a Menú Dúo</span>
                              </button>

                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setIsFinanzasDuoDropdownOpen(prev => !prev)}
                                  className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 hover:border-rose-400 rounded-xl text-xs sm:text-[13px] font-black transition cursor-pointer active:scale-95 shadow-2xs min-h-[42px]"
                                  id="btn-subtool-selector"
                                >
                                  <span className="truncate max-w-[150px] sm:max-w-[210px]">
                                    {finanzasDuoSubTool === 'invitar' && '👤 Panel de Invitaciones'}
                                    {finanzasDuoSubTool === 'solicitudes' && '✅ Solicitudes de Espectadores'}
                                    {finanzasDuoSubTool === 'duo1a1' && '👥 Dúo 1 a 1 (50/50)'}
                                    {finanzasDuoSubTool === 'multiples' && '👨‍👩‍👧‍👦 Multianfitrión (10 Slots)'}
                                    {finanzasDuoSubTool === 'audio' && '🎙️ Dúo Solo Audio'}
                                    {finanzasDuoSubTool === 'pantalla' && '🖥️ Compartición de Pantalla'}
                                    {finanzasDuoSubTool === 'controles' && '🎛️ Moderación y Controles'}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 transition-transform ${isFinanzasDuoDropdownOpen ? 'rotate-180 text-rose-600' : 'text-rose-400'}`} />
                                </button>

                                {isFinanzasDuoDropdownOpen && (
                                  <div className="absolute right-0 top-full mt-1.5 w-64 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 space-y-1 animate-fade-in text-left">
                                    {[
                                      { key: 'invitar', label: '👤 Panel de Invitaciones', badge: `${Object.keys(invitedUsersMap).filter(k => invitedUsersMap[k]).length} Invitados` },
                                      { key: 'solicitudes', label: '✅ Solicitudes de Espectadores', badge: `${financeRequestsList.filter(r => r.status === 'pending').length} Pend.` },
                                      { key: 'duo1a1', label: '👥 Dúo 1 a 1 (50/50)', badge: 'Pantalla 50/50' },
                                      { key: 'multiples', label: '👨‍👩‍👧‍👦 Multianfitrión (10 Slots)', badge: '10 Slots' },
                                      { key: 'audio', label: '🎙️ Dúo Solo Audio', badge: 'Audio HD' },
                                      { key: 'pantalla', label: '🖥️ Compartición de Pantalla', badge: '1080p' },
                                      { key: 'controles', label: '🎛️ Moderación y Controles', badge: 'Mute/Cam' },
                                    ].map((item) => (
                                      <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => {
                                          setFinanzasDuoSubTool(item.key as any);
                                          setIsFinanzasDuoDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-black transition cursor-pointer text-left ${
                                          finanzasDuoSubTool === item.key
                                            ? 'bg-rose-600 text-white shadow-xs'
                                            : 'hover:bg-rose-50 text-slate-800'
                                        }`}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-black shrink-0 ${
                                          finanzasDuoSubTool === item.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>{item.badge}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* VISTA 1: INVITAR CREADOR / USUARIO */}
                            {finanzasDuoSubTool === 'invitar' && (
                              <div className="space-y-3">
                                {/* Barra de búsqueda y botón Invitar a los 10 */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="relative flex-1">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      type="text"
                                      value={duoSearchQuery}
                                      onChange={(e) => setDuoSearchQuery(e.target.value)}
                                      placeholder="Buscar analista o creador..."
                                      className="w-full text-xs sm:text-[13px] pl-9 pr-9 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-rose-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium transition shadow-2xs min-h-[42px]"
                                      id="input-buscar-creador-duo"
                                    />
                                    {duoSearchQuery && (
                                      <button
                                        type="button"
                                        onClick={() => setDuoSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                                        title="Limpiar búsqueda"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>

                                  {(() => {
                                    const totalUsers = FINANZAS_USERS.length;
                                    const invitedCount = Object.keys(invitedUsersMap).filter(k => invitedUsersMap[k]).length;
                                    const allInvited = invitedCount >= totalUsers && totalUsers > 0;

                                    return (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (allInvited) {
                                            setInvitedUsersMap({});
                                            alert('🔄 Se han restablecido las invitaciones.');
                                          } else {
                                            const newInvites: Record<string, boolean> = {};
                                            FINANZAS_USERS.forEach(u => { newInvites[u.id] = true; });
                                            setInvitedUsersMap(newInvites);
                                            alert('📨 ¡Invitaciones enviadas con éxito a los 10 analistas y creadores de Finanzas!');
                                          }
                                        }}
                                        className={`px-3.5 sm:px-4 py-2.5 text-white text-xs sm:text-[13px] font-black rounded-xl transition shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 min-h-[42px] ${
                                          allInvited
                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                            : 'bg-gradient-to-r from-rose-600 to-[#fe2c55] hover:from-rose-700 hover:to-rose-800'
                                        }`}
                                        id="btn-invitar-a-los-10"
                                      >
                                        <span>{allInvited ? '✓ 10 INVITADOS (RESETEAR)' : '⚡ INVITAR A LOS 10'}</span>
                                      </button>
                                    );
                                  })()}
                                </div>

                                {/* Filtros de Categoría Rápidos */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                                  {[
                                    { id: 'all', label: 'Todos (10)' },
                                    { id: 'analistas', label: 'Analistas Macro' },
                                    { id: 'inversores', label: 'Inversores VIP' },
                                    { id: 'traders', label: 'Traders & Riesgos' },
                                  ].map((tab) => (
                                    <button
                                      key={tab.id}
                                      type="button"
                                      onClick={() => setDuoCategoryFilter(tab.id as any)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer border min-h-[32px] ${
                                        duoCategoryFilter === tab.id
                                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                      }`}
                                    >
                                      {tab.label}
                                    </button>
                                  ))}
                                </div>

                                {/* Lista de Creadores y Analistas */}
                                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                  {FINANZAS_USERS
                                    .filter(u => {
                                      if (!duoSearchQuery.trim()) return true;
                                      const q = duoSearchQuery.toLowerCase();
                                      return u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
                                    })
                                    .filter(u => {
                                      if (duoCategoryFilter === 'all') return true;
                                      if (duoCategoryFilter === 'analistas') return u.role.toLowerCase().includes('analista') || u.role.toLowerCase().includes('tecnológico');
                                      if (duoCategoryFilter === 'inversores') return u.role.toLowerCase().includes('inversor') || u.role.toLowerCase().includes('directora') || u.role.toLowerCase().includes('especialista');
                                      if (duoCategoryFilter === 'traders') return u.role.toLowerCase().includes('trader') || u.role.toLowerCase().includes('riesgos') || u.role.toLowerCase().includes('consultora');
                                      return true;
                                    })
                                    .map((user) => {
                                      const isInvited = !!invitedUsersMap[user.id];
                                      return (
                                        <div key={user.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-2xl gap-3 transition shadow-2xs min-h-[64px]">
                                          <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative shrink-0">
                                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                            </div>
                                            <div className="min-w-0">
                                              <p className="text-xs sm:text-[13px] md:text-sm font-extrabold text-slate-900 truncate m-0">{user.name}</p>
                                              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate m-0">@{user.username} • <span className="text-rose-600 font-bold">{user.role}</span></p>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 shrink-0">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setInvitedUsersMap(prev => {
                                                  const next = { ...prev, [user.id]: !prev[user.id] };
                                                  if (next[user.id]) {
                                                    alert(`📨 Invitación enviada a ${user.name} (${user.role}).`);
                                                  }
                                                  return next;
                                                });
                                              }}
                                              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-black transition cursor-pointer shrink-0 border shadow-2xs active:scale-95 min-h-[40px] ${
                                                isInvited
                                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                                  : 'bg-gradient-to-r from-rose-600 to-[#fe2c55] hover:from-rose-700 hover:to-rose-800 text-white border-rose-600'
                                              }`}
                                              id={`btn-invitar-user-${user.id}`}
                                            >
                                              {isInvited ? '✓ Invitación Enviada' : '+ Invitar al Directo'}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {/* VISTA 2: ACEPTAR SOLICITUDES */}
                            {finanzasDuoSubTool === 'solicitudes' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2">
                                  <div className="text-xs sm:text-[13px] text-emerald-950 font-bold">
                                    <span>Espectadores esperando para intervenir ({financeRequestsList.filter(r => r.status === 'pending').length})</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFinanceRequestsList(prev => prev.map(r => ({ ...r, status: 'pending' })));
                                        alert('🔄 Lista de solicitudes restablecida.');
                                      }}
                                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-xl transition cursor-pointer active:scale-95"
                                    >
                                      🔄 Reset
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFinanceRequestsList(prev => prev.map(r => ({ ...r, status: 'accepted' })));
                                        setScreenSplitLayout('grid-4');
                                        alert('✅ Todas las solicitudes pendientes han sido aprobadas en directo.');
                                      }}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
                                    >
                                      ⚡ Aceptar Todos
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                  {financeRequestsList.map((req) => (
                                    <div key={req.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-100 transition shadow-2xs">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0" />
                                        <div className="min-w-0">
                                          <p className="text-xs sm:text-[13px] md:text-sm font-extrabold text-slate-900 truncate m-0">{req.name}</p>
                                          <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate m-0">@{req.username} • Espera: <span className="font-bold text-slate-700">{req.timeWaiting}</span></p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        {req.status === 'pending' ? (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setFinanceRequestsList(prev => prev.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
                                                setScreenSplitLayout('50-50');
                                                alert(`✅ Has aceptado a ${req.name} para participar en directo.`);
                                              }}
                                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-[13px] font-black rounded-xl transition cursor-pointer active:scale-95 shadow-xs min-h-[38px]"
                                            >
                                              ✅ ACEPTAR VÍDEO
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setFinanceRequestsList(prev => prev.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
                                                setIsAudioOnlyDuo(true);
                                                alert(`🎙️ Has aceptado a ${req.name} en modo Solo Audio.`);
                                              }}
                                              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-[13px] font-black rounded-xl transition cursor-pointer active:scale-95 shadow-xs min-h-[38px]"
                                            >
                                              🎙️ SOLO AUDIO
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setFinanceRequestsList(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
                                                alert(`❌ Solicitud de ${req.name} rechazada.`);
                                              }}
                                              className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs sm:text-[13px] font-black rounded-xl transition cursor-pointer active:scale-95 min-h-[38px]"
                                            >
                                              ❌ RECHAZAR
                                            </button>
                                          </>
                                        ) : (
                                          <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                                            req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                          }`}>
                                            {req.status === 'accepted' ? '✓ En Directo' : 'Rechazado'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* VISTA 3: DÚO 1 A 1 (50/50) */}
                            {finanzasDuoSubTool === 'duo1a1' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs sm:text-[13px] text-indigo-950 font-medium leading-relaxed">
                                  Dividir pantalla <strong>50% Anfitrión</strong> y <strong>50% Co-Anfitrión</strong> en formato vertical u horizontal.
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScreenSplitLayout('50-50');
                                      alert('👥 Modo Dúo 1 a 1 (50/50) activado.');
                                    }}
                                    className={`p-3.5 rounded-2xl border-2 text-center transition cursor-pointer font-black text-xs sm:text-sm min-h-[48px] ${
                                      screenSplitLayout === '50-50' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-800'
                                    }`}
                                  >
                                    División 50/50 Vertical
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScreenSplitLayout('pip');
                                      alert('🖼️ Modo Picture-in-Picture (PiP) activado.');
                                    }}
                                    className={`p-3.5 rounded-2xl border-2 text-center transition cursor-pointer font-black text-xs sm:text-sm min-h-[48px] ${
                                      screenSplitLayout === 'pip' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-800'
                                    }`}
                                  >
                                    Modo PiP (Flotante)
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setScreenSplitLayout('50-50');
                                    setShowDuoMenu(false);
                                    alert('🚀 Transmisión Dúo 1 a 1 iniciada.');
                                  }}
                                  className="w-full bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95 text-center block min-h-[44px]"
                                >
                                  🚀 Iniciar Modo Dúo 1 a 1 en Directo
                                </button>
                              </div>
                            )}

                            {/* VISTA 4: MULTIANFITRIÓN (HASTA 10 SLOTS) */}
                            {finanzasDuoSubTool === 'multiples' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs sm:text-[13px] text-purple-950 font-medium leading-relaxed">
                                  Configuración de <strong>Mesa Redonda Financiera</strong> con capacidad para 10 analistas en pantalla.
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                  {Array.from({ length: 10 }).map((_, i) => {
                                    const participant = FINANZAS_USERS[i];
                                    const isSlotOccupied = i < 4;
                                    return (
                                      <div key={i} className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 min-h-[85px] ${
                                        isSlotOccupied ? 'bg-purple-50 border-purple-300' : 'bg-slate-50 border-dashed border-slate-300'
                                      }`}>
                                        {isSlotOccupied ? (
                                          <>
                                            <img src={participant?.avatar} className="w-8 h-8 rounded-full object-cover border border-purple-400" alt="" />
                                            <span className="text-[10.5px] font-extrabold text-purple-950 truncate max-w-full block leading-tight">{participant?.name.split(' ')[0]}</span>
                                            <span className="text-[8.5px] bg-purple-200 text-purple-900 px-1 py-0.2 rounded font-black">Slot {i + 1}</span>
                                          </>
                                        ) : (
                                          <>
                                            <span className="text-sm text-slate-400">+</span>
                                            <span className="text-[9.5px] font-bold text-slate-400">Libre {i + 1}</span>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setScreenSplitLayout('grid-4');
                                    setShowDuoMenu(false);
                                    alert('👨‍👩‍👧‍👦 Mesa redonda multianfitrión activada en directo.');
                                  }}
                                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95 text-center block min-h-[44px]"
                                >
                                  👨‍👩‍👧‍👦 Activar Cuadrícula Multianfitrión
                                </button>
                              </div>
                            )}

                            {/* VISTA 5: DÚO SOLO AUDIO */}
                            {finanzasDuoSubTool === 'audio' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-[13px] text-amber-950 font-medium leading-relaxed">
                                  <strong>🎙️ Modo Podcast / Solo Audio:</strong> Los invitados participan únicamente mediante micrófono, ideal para debates rápidos sin necesidad de ancho de banda para vídeo.
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAudioOnlyDuo(prev => !prev);
                                    alert(!isAudioOnlyDuo ? '🎙️ Modo Solo Audio ACTIVADO para invitados.' : '📹 Modo Cámara reanudado.');
                                  }}
                                  className={`w-full py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95 text-center block min-h-[44px] ${
                                    isAudioOnlyDuo ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                                  }`}
                                >
                                  {isAudioOnlyDuo ? '✓ MODO SOLO AUDIO ACTIVO (DESACTIVAR)' : '🎙️ ACTIVAR MODO SOLO AUDIO'}
                                </button>
                              </div>
                            )}

                            {/* VISTA 6: COMPARTICIÓN DE PANTALLA */}
                            {finanzasDuoSubTool === 'pantalla' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs sm:text-[13px] text-cyan-950 font-medium leading-relaxed">
                                  <strong>🖥️ Emisión de Pantalla en Directo:</strong> Comparte gráficos de velas, TradingView, hojas de cálculo o pestañas del navegador en alta definición.
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleStartSpecificScreenShare('full')}
                                    className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 bg-white hover:bg-cyan-50 text-left transition cursor-pointer shadow-2xs min-h-[90px]"
                                  >
                                    <span className="text-xl sm:text-2xl block mb-1">🖥️</span>
                                    <span className="text-xs sm:text-[13px] font-black text-slate-900 block leading-tight">Pantalla Completa</span>
                                    <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium block leading-snug mt-0.5">Desktop / Monitor</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStartSpecificScreenShare('window')}
                                    className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 bg-white hover:bg-cyan-50 text-left transition cursor-pointer shadow-2xs min-h-[90px]"
                                  >
                                    <span className="text-xl sm:text-2xl block mb-1">🪟</span>
                                    <span className="text-xs sm:text-[13px] font-black text-slate-900 block leading-tight">Ventana Trading</span>
                                    <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium block leading-snug mt-0.5">Software Financiero</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStartSpecificScreenShare('tab')}
                                    className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 bg-white hover:bg-cyan-50 text-left transition cursor-pointer shadow-2xs min-h-[90px]"
                                  >
                                    <span className="text-xl sm:text-2xl block mb-1">🌐</span>
                                    <span className="text-xs sm:text-[13px] font-black text-slate-900 block leading-tight">Pestaña Web</span>
                                    <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium block leading-snug mt-0.5">Bolsa y Noticias</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStartSpecificScreenShare('presentation')}
                                    className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 bg-white hover:bg-cyan-50 text-left transition cursor-pointer shadow-2xs min-h-[90px]"
                                  >
                                    <span className="text-xl sm:text-2xl block mb-1">📊</span>
                                    <span className="text-xs sm:text-[13px] font-black text-slate-900 block leading-tight">Diapositivas</span>
                                    <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium block leading-snug mt-0.5">Presentación Slides</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* VISTA 7: CONTROLES Y MODERACIÓN */}
                            {finanzasDuoSubTool === 'controles' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-slate-100 border border-slate-300 rounded-2xl flex items-center justify-between gap-2">
                                  <span className="text-xs sm:text-[13px] font-bold text-slate-800">🎛️ Controles del Moderador / Anfitrión</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsDuoMutedMap(prev => {
                                          const next: Record<string, boolean> = {};
                                          FINANZAS_USERS.forEach(u => { next[u.id] = true; });
                                          return next;
                                        });
                                        alert('🔇 Todos los invitados han sido silenciados.');
                                      }}
                                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
                                    >
                                      🔇 Silenciar Todos
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsDuoMutedMap({});
                                        alert('🔊 Micrófonos reactivados para todos.');
                                      }}
                                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-black rounded-xl transition cursor-pointer active:scale-95"
                                    >
                                      🔊 Reactivar
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                  {FINANZAS_USERS.slice(0, 5).map((user) => {
                                    const isMuted = !!isDuoMutedMap[user.id];
                                    const isCamOff = !!isDuoCamOffMap[user.id];
                                    return (
                                      <div key={user.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2 hover:bg-slate-100 transition shadow-2xs min-h-[64px]">
                                        <div className="flex items-center gap-3 min-w-0">
                                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0" />
                                          <div className="min-w-0">
                                            <p className="text-xs sm:text-[13px] md:text-sm font-extrabold text-slate-900 truncate m-0">{user.name}</p>
                                            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate m-0">@{user.username} • <span className="text-rose-600 font-bold">{user.role}</span></p>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsDuoMutedMap(prev => ({ ...prev, [user.id]: !prev[user.id] }));
                                            }}
                                            className={`px-3 py-2 rounded-xl text-xs sm:text-[13px] font-black transition cursor-pointer border min-h-[38px] ${
                                              isMuted
                                                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                                            }`}
                                          >
                                            {isMuted ? '🔇 Muteado' : '🎙️ Mic ON'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsDuoCamOffMap(prev => ({ ...prev, [user.id]: !prev[user.id] }));
                                            }}
                                            className={`px-3 py-2 rounded-xl text-xs sm:text-[13px] font-black transition cursor-pointer border min-h-[38px] ${
                                              isCamOff
                                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                                            }`}
                                          >
                                            {isCamOff ? '🚫 Cam OFF' : '📹 Cam ON'}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* OPCIONES PARA OTROS CANALES (MODA, BELLEZA, GAMING...) */
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 flex-1 overflow-y-auto pr-1">
                        <button
                          type="button"
                          onClick={() => {
                            setScreenSplitLayout('50-50');
                            setShowDuoMenu(false);
                            alert('👥 Dúo Comercial 50/50 activado.');
                          }}
                          className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/50 text-left transition cursor-pointer shadow-2xs min-h-[92px]"
                        >
                          <span className="text-xl sm:text-2xl block mb-1">👯</span>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Dúo Comercial 50/50</span>
                          <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Venta y pasarela conjunta</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenSplitLayout('grid-4');
                            setShowDuoMenu(false);
                            alert('👨‍👩‍👧‍👦 Multianfitrión activado.');
                          }}
                          className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/50 text-left transition cursor-pointer shadow-2xs min-h-[92px]"
                        >
                          <span className="text-xl sm:text-2xl block mb-1">👨‍👩‍👧‍👦</span>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Multianfitrión</span>
                          <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Hasta 10 invitados</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAudioOnlyDuo(true);
                            setShowDuoMenu(false);
                            alert('🎙️ Modo Solo Audio activado.');
                          }}
                          className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-left transition cursor-pointer shadow-2xs min-h-[92px]"
                        >
                          <span className="text-xl sm:text-2xl block mb-1">🎙️</span>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Solo Audio</span>
                          <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Podcast y voz</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDuoMenu(false);
                            setShowScreenShareMenu(true);
                          }}
                          className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50/50 text-left transition cursor-pointer shadow-2xs min-h-[92px]"
                        >
                          <span className="text-xl sm:text-2xl block mb-1">🖥️</span>
                          <span className="text-xs sm:text-[13px] md:text-sm font-black text-slate-900 block leading-tight">Compartir Pantalla</span>
                          <span className="text-[10.5px] sm:text-xs text-slate-600 font-medium block leading-snug mt-0.5">Catálogo y navegador</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                """

content = content.replace(old_section, new_section, 1)

with open('src/components/CastingLiveSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied enlarged, high-visibility mobile modals successfully!")
