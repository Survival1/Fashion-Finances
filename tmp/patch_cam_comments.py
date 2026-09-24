with open('src/components/TikTokFinanzasFeed.tsx', 'r') as f:
    text = f.read()

import re

# 1. Update live-camera-comments to be moved to direct child of live-camera-broadcast-fullscreen
# Find where live-camera-comments is:
cam_comments_pattern = r'(\s*\{isCommentsOpenForThisSession && \(\s*<div\s+className="[^"]*"\s+id=\{`live-camera-comments-\$\{session\.id\}`\}[\s\S]*?<\/div>\s*\)\}\s*)'

match = re.search(cam_comments_pattern, text)
print('Matched live-camera-comments:', bool(match))
if match:
    full_comment_block = match.group(1)
    # Remove from current position inside the toolbar:
    text = text[:match.start()] + '\n' + text[match.end():]
    
    # New full-width live camera comments markup:
    new_comments_markup = '''
                    {/* 💬 COMENTARIOS EN VIVO EN LA PARTE INFERIOR - OCUPA TODO EL ANCHO DEL CANAL */}
                    {isCommentsOpenForThisSession && (
                      <div 
                        className="absolute inset-x-0 bottom-0 z-50 w-full bg-[#0a0e1a]/98 backdrop-blur-2xl border-t-2 border-rose-500/70 rounded-b-[40px] sm:rounded-b-[48px] rounded-t-3xl p-3.5 sm:p-4.5 flex flex-col gap-2.5 shadow-[0_-20px_60px_rgba(0,0,0,0.98)] animate-slide-up text-left pointer-events-auto"
                        id={`live-camera-comments-${session.id}`}
                      >
                        {/* Header con botón para cerrar */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-wider">
                              Comentarios en directo
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
                        <div className="w-full max-h-[130px] sm:max-h-[150px] overflow-y-auto space-y-1.5 pr-1 select-text scrollbar-thin scrollbar-thumb-white/20">
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
                                <span className="text-[7.5px]">{comm.likes}</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Quick emojis - Tap to send directly! */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 shrink-0 bg-slate-950/70 rounded-full border border-slate-800/80">
                          <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wider pl-1.5 pr-0.5 shrink-0 flex items-center gap-1">
                            <span>⚡</span>
                            <span>Enviar emoji:</span>
                          </span>
                          {['❤️', '🔥', '👏', '🚀', '💯', '💎', '✨', '😍', '😂', '🙌', '💡', '💰', '👍', '🎉', '🥂', '👑'].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => {
                                handleAddSessionComment(session.id, em);
                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { emoji: em, icon: em, pureEmoji: true }
                                }));
                              }}
                              className="p-1 hover:bg-slate-800 rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none"
                              title={`Enviar ${em}`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>

                        {/* Comment input form with emoji trigger inside writing block */}
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
                              id={`btn-open-emoji-glossary-cam-${session.id}`}
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
    # Insert right before the closing tag of live-camera-broadcast-fullscreen
    # The end of live-camera-broadcast-fullscreen is followed by `) : (`
    target_pos = text.find(') : (', match.start())
    # find the `</div>` before `) : (`
    div_close_pos = text.rfind('</div>', 0, target_pos)
    text = text[:div_close_pos] + new_comments_markup + '\n                  ' + text[div_close_pos:]
    print('Successfully moved live-camera-comments to direct child!')

with open('src/components/TikTokFinanzasFeed.tsx', 'w') as f:
    f.write(text)
