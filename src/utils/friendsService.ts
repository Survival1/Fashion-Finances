// Service for synchronizing friends across the app (Profile z.png, Mis Finanzas image.png, etc.)

export interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role?: string;
  bio?: string;
  online?: boolean;
  addedMe?: boolean;
  isNew?: boolean;
}

export const DEFAULT_FRIENDS: FriendUser[] = [
  {
    id: 'friend-1',
    name: 'Adriana Lima',
    username: 'adrianalima_w1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Modelo internacional y apasionado/a del fitness.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-2',
    name: 'Alexander Vance',
    username: 'alexandervance1',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Creador/a de trends y embajador/a de marcas de alta.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-3',
    name: 'Isabella Dubois',
    username: 'isabelladubois2',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Enfocado/a en el empoderamiento y nuevos negocios creativos.',
    online: true,
    addedMe: false
  },
  {
    id: 'friend-4',
    name: 'Mia Kincaid',
    username: 'miakincaid',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Influencer de estilo de vida, mentor de creadores emergentes.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-5',
    name: 'Elena Rostova',
    username: 'elenarostova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Estilo de vida, moda urbana e innovación sostenible.',
    online: false,
    addedMe: true
  },
  {
    id: 'friend-6',
    name: 'Alessandra Ambrosio',
    username: 'alessandraambrosio_w2',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Top Model de pasarela y embajadora de la moda sostenible.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-7',
    name: 'Candice Swanepoel',
    username: 'candiceswanepoel_w3',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Ángel icónico y diseñadora de moda ecológica.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-8',
    name: 'Sophia Loren',
    username: 'sophialoren_w3',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    role: 'model',
    bio: 'Promotora oficial de marcas sustentables y nuevos talentos colectivos.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-9',
    name: 'Marcus Vance',
    username: 'marcusvance_m2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Modelo de pasarela y consultor de moda masculina.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-10',
    name: 'Sienna Cole',
    username: 'siennacole_w4',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Estilismo prêt-à-porter y creadora de tendencias.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-11',
    name: 'Liam Cooper',
    username: 'liamcooper_m3',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Diseño vanguardista y fotografía de pasarela.',
    online: true,
    addedMe: true
  },
  {
    id: 'friend-12',
    name: 'Gisele Bündchen',
    username: 'giselebundchen_w5',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=200',
    role: 'model',
    bio: 'Top model internacional e icono de la moda.',
    online: true,
    addedMe: true
  }
];

export const getFriendsFromStorage = (excludeSelf?: { id?: string; username?: string; name?: string }): FriendUser[] => {
  let list: FriendUser[] = DEFAULT_FRIENDS;
  try {
    const raw = localStorage.getItem('coll_friends');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    } else {
      localStorage.setItem('coll_friends', JSON.stringify(DEFAULT_FRIENDS));
    }
  } catch (_) {}

  // Also include accepted extra friends from ff_accepted_extra_friends if not yet merged
  try {
    const rawExtra = localStorage.getItem('ff_accepted_extra_friends');
    if (rawExtra) {
      const parsedExtra = JSON.parse(rawExtra);
      if (Array.isArray(parsedExtra)) {
        parsedExtra.forEach((extra: any) => {
          const exists = list.some(f => 
            (extra.username && f.username?.toLowerCase() === extra.username.toLowerCase()) ||
            (extra.id && f.id === extra.id)
          );
          if (!exists) {
            list = [extra, ...list];
          }
        });
      }
    }
  } catch (_) {}

  if (excludeSelf) {
    const selfId = (excludeSelf.id || '').toLowerCase().trim();
    const selfUser = (excludeSelf.username || '').toLowerCase().replace(/^@/, '').trim();
    const selfName = (excludeSelf.name || '').toLowerCase().trim();

    list = list.filter(item => {
      if (!item) return false;
      const itemId = (item.id || '').toLowerCase().trim();
      const itemUser = (item.username || '').toLowerCase().replace(/^@/, '').trim();
      const itemName = (item.name || '').toLowerCase().trim();

      const isSelf = 
        (selfId && itemId && selfId === itemId) ||
        (selfUser && itemUser && selfUser === itemUser) ||
        (selfName && itemName && selfName === itemName) ||
        ((selfName.includes('adriana') || selfUser.includes('adrianalima')) && 
         (itemName.includes('adriana') || itemUser.includes('adrianalima') || itemId === 'friend-1'));

      return !isSelf;
    });
  }

  return list;
};

export const saveFriendsToStorage = (friends: FriendUser[]) => {
  try {
    localStorage.setItem('coll_friends', JSON.stringify(friends));
  } catch (e) {
    console.error('Error saving coll_friends:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sync-friends-list', { detail: friends }));
    window.dispatchEvent(new CustomEvent('sync-friend-requests'));
  }
};
