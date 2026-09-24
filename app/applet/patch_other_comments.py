import re

with open('src/components/TikTokFinanzasFeed.tsx', 'r') as f:
    text = f.read()

# 1. LIVE EXPOSITION COMMENTS
expo_comments_pattern = r'(\s*\{isCommentsOpenForThisSession && \(\s*\/\* 💬 COMENTARIOS DE USUARIOS EN LA PARTE INFERIOR[^\n]*\*\/\s*<div\s+className="[^"]*"\s+id=\{`live-exposition-comments-\$\{session\.id\}`\}[\s\S]*?<\/div>\s*\)\}\s*)'
match_expo = re.search(expo_comments_pattern, text)
print('Matched live-exposition-comments:', bool(match_expo))
if match_expo:
    text = text[:match_expo.start()] + '\n' + text[match_expo.end():]
    
    new_expo_comments = '''
                    {/* 💬 COMENTARIOS DE USUARIOS EN LA PARTE INFERIOR - OCUPA TODO EL ANCHO DEL CANAL */}
                    {isCommentsOpenForThisSession && (
                      <div 
                        className="absolute inset-x-0 bottom-0 z-50 w-full bg-[#0a0e1a]/98 backdrop-blur-2xl border-t-2 border-rose-500/70 rounded-b-[40px] sm:rounded-b-[48px] rounded-t-3xl p-3.5 sm:p-4.5 flex flex-col gap-2.5 shadow-[0_-20px_60px_rgba(0,0,0,0.98)] animate-slide-up text-left pointer-events-auto"
                        id={`live-exposition-comments-${session.id}`}
                      >
                        {/* Header con botón para cerrar */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                          <div className="flex items-center gap-1.5 text-left">
                            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-wider">
                              Comentarios en vivo
                            </span>
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                              {commentsCount}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveCommentsSessionId(null)}
                            className="text-slate-400 hover:text-white p-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition hover:bg-slate-800"
                            title="Cerrar comentarios"
                          >
                            <span className="text-[8px] font-mono text-slate-400">Pulsa 💬 para cerrar</span>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Scrollable Comments List */}
                        <div className="w-full max-h-[130px] sm:max-h-[150px] overflow-y-auto space-y-1.5 pr-1 text-left select-text scrollbar-thin scrollbar-thumb-white/20">
                          {sessionComments.map((comm) => (
                            <div key={comm.id} className="flex items-start gap-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/80">
                              <img
                                src={comm.userAvatar}
                                alt={comm.userName}
                                className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-700 mt-0.5"
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-black text-rose-300 truncate">{comm.userName}</span>
                                  <span className="text-[8px] text-slate-400 shrink-0 font-mono">{comm.timeAgo}</span>
                                </div>
                                <p className="text-[10px] text-slate-200 mt-0.5 leading-snug break-words">
                                  {comm.text}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleCommentLike(session.id, comm.id)}
                                className={`flex flex-col items-center gap-0.5 p-1 transition cursor-pointer shrink-0 ${
                                  comm.userLiked ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'
                                }`}
                                title="Me gusta"
                              >
                                <Heart className={`w-3 h-3 ${comm.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                <span className="text-[8px] font-mono">{comm.likes}</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Quick Emojis strip - Tap to send directly! */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 shrink-0 bg-slate-950/70 rounded-full border border-slate-800/80">
                          <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wider pl-1.5 pr-0.5 shrink-0 flex items-center gap-1">
                            <span>⚡</span>
                            <span>Enviar emoji:</span>
                          </span>
                          {['❤️', '🔥', '👏', '🚀', '💯', '😂', '😍', '🙌', '💡', '💰', '✨', '👍', '💎', '🎉', '🥂', '👑'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                handleAddSessionComment(session.id, emoji);
                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { emoji, icon: emoji, pureEmoji: true }
                                }));
                              }}
                              className="p-1 hover:bg-slate-800 rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none"
                              title={`Enviar ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* New comment input & send form */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddSessionComment(session.id);
                          }}
                          className="relative flex items-center gap-1.5 pt-1 border-t border-white/10 shrink-0 w-full"
                        >
                          {/* 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque */}
                          {renderEmojiGlossary(session.id)}

                          {/* Bloque para escribir con el emoji dentro */}
                          <div className="flex-1 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full pl-2 pr-2.5 py-1 focus-within:border-rose-500 transition shadow-inner min-w-0">
                            {/* Emoji en el bloque para escribir: al pinchar sobre él abre el glosario de emojis */}
                            <button
                              type="button"
                              onClick={() => setShowEmojiPickerSessionId(prev => prev === session.id ? null : session.id)}
                              className="p-1 text-base sm:text-lg hover:scale-125 transition active:scale-95 cursor-pointer bg-transparent border-0 shrink-0 leading-none select-none"
                              title="Abrir glosario de emojis"
                              id={`btn-open-emoji-glossary-expo-${session.id}`}
                            >
                              😊
                            </button>

                            <input
                              type="text"
                              value={commentInputMap[session.id] || ''}
                              onChange={(e) => setCommentInputMap(prev => ({ ...prev, [session.id]: e.target.value }))}
                              placeholder="Escribe un comentario o emoji..."
                              className="flex-1 bg-transparent text-[10px] sm:text-[11px] text-white placeholder-slate-400 focus:outline-none min-w-0 px-1 py-0.5"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!(commentInputMap[session.id] || '').trim()}
                            className={`p-2 rounded-full transition cursor-pointer shrink-0 flex items-center justify-center ${
                              (commentInputMap[session.id] || '').trim()
                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                            title="Publicar comentario"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    )}
'''
    # Find the end of live-exposition-in-channel
    expo_end_marker = '{/* 🔴 VISTA EN VIVO CON CÁMARA GRABÁNDOTE EN DIRECTO'
    idx_marker = text.find(expo_end_marker)
    # The div closing live-exposition-in-channel is right before `idx_marker`
    div_close_expo = text.rfind('</div>', 0, idx_marker)
    text = text[:div_close_expo] + new_expo_comments + '\n                  ' + text[div_close_expo:]
    print('Successfully moved live-exposition-comments!')

# 2. NORMAL CARD COMMENTS
normal_comments_pattern = r'(\s*\{isCommentsOpenForThisSession && \(\s*\/\* 💬 COMENTARIOS DE USUARIOS Y POSIBILIDAD DE COMENTAR[^\n]*\*\/\s*<div\s+className="[^"]*"\s+id=\{`normal-card-comments-\$\{session\.id\}`\}[\s\S]*?<\/div>\s*\)\}\s*)'
match_normal = re.search(normal_comments_pattern, text)
print('Matched normal-card-comments:', bool(match_normal))
if match_normal:
    text = text[:match_normal.start()] + '\n' + text[match_normal.end():]

    new_normal_comments = '''
                {/* 💬 COMENTARIOS DE USUARIOS Y POSIBILIDAD DE COMENTAR - OCUPA TODO EL ANCHO DEL CANAL */}
                {isCommentsOpenForThisSession && (
                  <div 
                    className="absolute inset-x-0 bottom-0 z-50 w-full bg-[#0a0e1a]/98 backdrop-blur-2xl border-t-2 border-rose-500/70 rounded-b-[40px] sm:rounded-b-[48px] rounded-t-3xl p-3.5 sm:p-4.5 flex flex-col gap-2.5 shadow-[0_-20px_60px_rgba(0,0,0,0.98)] animate-slide-up pointer-events-auto text-left"
                    id={`normal-card-comments-${session.id}`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-1.5 text-left">
                        <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-wider">
                          Comentarios ({commentsCount})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCommentsSessionId(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition hover:bg-slate-800"
                        title="Cerrar comentarios"
                      >
                        <span className="text-[8px] font-mono text-slate-400">Pulsa 💬 para cerrar</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="w-full max-h-[130px] sm:max-h-[150px] overflow-y-auto space-y-1.5 pr-1 text-left select-text scrollbar-thin scrollbar-thumb-white/20">
                      {sessionComments.map((comm) => (
                        <div key={comm.id} className="flex items-start gap-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/80">
                          <img
                            src={comm.userAvatar}
                            alt={comm.userName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-700 mt-0.5"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-black text-rose-300 truncate">{comm.userName}</span>
                              <span className="text-[8px] text-slate-400 shrink-0 font-mono">{comm.timeAgo}</span>
                            </div>
                            <p className="text-[10px] text-slate-200 mt-0.5 leading-snug break-words">
                              {comm.text}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleCommentLike(session.id, comm.id)}
                            className={`flex flex-col items-center gap-0.5 p-1 transition cursor-pointer shrink-0 ${
                              comm.userLiked ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'
                            }`}
                            title="Me gusta"
                          >
                            <Heart className={`w-3 h-3 ${comm.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="text-[8px] font-mono">{comm.likes}</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Quick Emojis strip - Tap to send directly! */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 shrink-0 bg-slate-950/70 rounded-full border border-slate-800/80">
                      <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wider pl-1.5 pr-0.5 shrink-0 flex items-center gap-1">
                        <span>⚡</span>
                        <span>Enviar emoji:</span>
                      </span>
                      {['❤️', '🔥', '👏', '🚀', '💯', '😂', '😍', '🙌', '💡', '💰', '✨', '👍', '💎', '🎉', '🥂', '👑'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            handleAddSessionComment(session.id, emoji);
                            window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                              detail: { emoji, icon: emoji, pureEmoji: true }
                            }));
                          }}
                          className="p-1 hover:bg-slate-800 rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none"
                          title={`Enviar ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {/* Bloque para escribir con emoji dentro que abre glosario */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddSessionComment(session.id);
                      }}
                      className="relative flex items-center gap-1.5 pt-1 border-t border-white/10 shrink-0 w-full"
                    >
                      {/* 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque */}
                      {renderEmojiGlossary(session.id)}

                      {/* Bloque para escribir comentarios con el emoji dentro */}
                      <div className="flex-1 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full pl-2 pr-2.5 py-1 focus-within:border-rose-500 transition shadow-inner min-w-0">
                        {/* Emoji en el bloque para escribir: al pinchar sobre él abre el glosario de emojis */}
                        <button
                          type="button"
                          onClick={() => setShowEmojiPickerSessionId(prev => prev === session.id ? null : session.id)}
                          className="p-1 text-base sm:text-lg hover:scale-125 transition active:scale-95 cursor-pointer bg-transparent border-0 shrink-0 leading-none select-none"
                          title="Abrir glosario de emojis"
                          id={`btn-open-emoji-glossary-normal-${session.id}`}
                        >
                          😊
                        </button>

                        <input
                          type="text"
                          value={commentInputMap[session.id] || ''}
                          onChange={(e) => setCommentInputMap(prev => ({ ...prev, [session.id]: e.target.value }))}
                          placeholder="Escribe un comentario o emoji..."
                          className="flex-1 bg-transparent text-[10px] sm:text-[11px] text-white placeholder-slate-400 focus:outline-none min-w-0 px-1 py-0.5"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!(commentInputMap[session.id] || '').trim()}
                        className={`p-2 rounded-full transition cursor-pointer shrink-0 flex items-center justify-center ${
                          (commentInputMap[session.id] || '').trim()
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                        title="Publicar comentario"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
'''
    # Find closing of round-container-box
    action_col_marker = '{/* 📱 TIKTOK ACTION COLUMN ON THE RIGHT */}'
    idx_col = text.find(action_col_marker)
    # The div closing round-container-box is right before idx_col
    div_close_round = text.rfind('</div>', 0, idx_col)
    text = text[:div_close_round] + new_normal_comments + '\n              ' + text[div_close_round:]
    print('Successfully moved normal-card-comments!')

with open('src/components/TikTokFinanzasFeed.tsx', 'w') as f:
    f.write(text)
