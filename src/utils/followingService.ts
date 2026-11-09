// Service for synchronizing followed users across the app (Creator profiles, Seguidos card from z.png, etc.)

export interface FollowedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role?: string;
  bio?: string;
  online?: boolean;
}

export const DEFAULT_FOLLOWED_USERS: FollowedUser[] = [
  { id: 'fol-1', name: 'Adriana Lima', username: 'adrianalima_w1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Modelo internacional y apasionado/a del fitness.', online: true },
  { id: 'fol-2', name: 'Alessandra Ambrosio', username: 'alessandraambrosio_w2', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Top Model de pasarela y embajadora de la moda sostenible.', online: true },
  { id: 'fol-3', name: 'Candice Swanepoel', username: 'candiceswanepoel_w3', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Ángel icónico y diseñadora de moda ecológica.', online: true },
  { id: 'fol-4', name: 'Sophia Loren', username: 'sophialoren_w3', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', role: 'model', bio: 'Promotora oficial de marcas sustentables y nuevos talentos colectivos', online: true },
  { id: 'fol-5', name: 'Alexander Vance', username: 'alexandervance1', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Creador/a de trends y embajador/a de marcas de alta.', online: true },
  { id: 'fol-6', name: 'Isabella Dubois', username: 'isabelladubois2', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Enfocado/a en el empoderamiento y nuevos negocios creativos.', online: true },
  { id: 'fol-7', name: 'Elena Rostova', username: 'elenarostova', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Estilo de vida, moda urbana e innovación sostenible.', online: false },
  { id: 'fol-8', name: 'Mia Kincaid', username: 'miakincaid', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Influencer de estilo de vida, mentor de creadores emergentes.', online: true },
  { id: 'fol-9', name: 'Marcus Vance', username: 'marcusvance_m2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Modelo de pasarela y consultor de moda masculina.', online: true },
  { id: 'fol-10', name: 'Sienna Cole', username: 'siennacole_w4', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Estilismo prêt-à-porter y creadora de tendencias.', online: true },
  { id: 'fol-11', name: 'Liam Cooper', username: 'liamcooper_m3', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Diseño vanguardista y fotografía de pasarela.', online: true },
  { id: 'fol-12', name: 'Gisele Bündchen', username: 'giselebundchen_w5', avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Top model internacional e icono de la moda.', online: true },
  { id: 'fol-13', name: 'Carmen de la Cruz', username: 'carmen_moda', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'model', bio: 'Amante de la costura prêt-à-porter y la financiación ética', online: true },
  { id: 'fol-14', name: 'Valentina Rose', username: 'valentinarose_w6', avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=200', role: 'model', bio: 'Creadora de moda, pasarela y proyectos de financiamiento colectivo.', online: true }
];

export const getFollowedUsersFromStorage = (): FollowedUser[] => {
  try {
    const raw = localStorage.getItem('coll_following');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  // Initialize default if not present
  try {
    localStorage.setItem('coll_following', JSON.stringify(DEFAULT_FOLLOWED_USERS));
  } catch (_) {}
  return DEFAULT_FOLLOWED_USERS;
};

export const cleanUsername = (username?: string): string => {
  if (!username) return '';
  return username.toLowerCase().replace(/^@/, '').trim();
};

export const isUserFollowedInStorage = (username?: string, name?: string): boolean => {
  if (!username && !name) return false;
  const list = getFollowedUsersFromStorage();
  const targetUser = cleanUsername(username);
  const targetName = (name || '').toLowerCase().trim();

  return list.some(item => {
    const itemUser = cleanUsername(item.username);
    const itemName = (item.name || '').toLowerCase().trim();
    return (targetUser && itemUser === targetUser) || (targetName && itemName === targetName);
  });
};

export const toggleFollowUserInStorage = (user: {
  id?: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  role?: string;
}): { isFollowing: boolean; nextList: FollowedUser[] } => {
  const currentList = getFollowedUsersFromStorage();
  const targetUser = cleanUsername(user.username);
  const targetName = (user.name || '').toLowerCase().trim();

  const isCurrentlyFollowing = currentList.some(item => {
    const itemUser = cleanUsername(item.username);
    const itemName = (item.name || '').toLowerCase().trim();
    return (targetUser && itemUser === targetUser) || (targetName && itemName === targetName);
  });

  let nextList: FollowedUser[];

  if (isCurrentlyFollowing) {
    // Unfollow: remove from list
    nextList = currentList.filter(item => {
      const itemUser = cleanUsername(item.username);
      const itemName = (item.name || '').toLowerCase().trim();
      return !(targetUser && itemUser === targetUser) && !(targetName && itemName === targetName);
    });
  } else {
    // Follow: add to list
    const newFollowed: FollowedUser = {
      id: user.id || `fol-${Date.now()}`,
      name: user.name,
      username: user.username,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: user.role || 'model',
      bio: user.bio || 'Creadora destacada en Fashion Finances.',
      online: true
    };
    nextList = [newFollowed, ...currentList];
  }

  try {
    localStorage.setItem('coll_following', JSON.stringify(nextList));
  } catch (e) {
    console.error('Error saving coll_following:', e);
  }

  // Dispatch global sync event across the entire app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sync-following-list', { detail: nextList }));
  }

  return {
    isFollowing: !isCurrentlyFollowing,
    nextList
  };
};
