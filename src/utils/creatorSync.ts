// Shared synchronization helper for creator bios and links between ModelFacebookProfile and CastingLiveSection

export interface SynchronizedBioData {
  bio: string;
  website: string;
}

export const DEFAULT_SYNCHRONIZED_BIOS: Record<string, SynchronizedBioData> = {
  'adrianalima': {
    bio: 'Top Model internacional & Fashion Ambassador ✨\nPasarelas de Milán, París y Nueva York 👠\n👇 COLECCIÓN & MASTERCLASS 👇',
    website: 'adrianalima.com/runway-vip...'
  },
  'adrianalima_w1': {
    bio: 'Top Model internacional & Fashion Ambassador ✨\nPasarelas de Milán, París y Nueva York 👠\n👇 COLECCIÓN & MASTERCLASS 👇',
    website: 'adrianalima.com/runway-vip...'
  },
  'alexandervance': {
    bio: 'Embajador de Alta Costura Masculina 💼\nInversor en Marcas de Lujo y Diseñadores Emergentes 📈\n👇 MASTERCLASS INVERSIÓN 👇',
    website: 'alexandervance.luxury/invest...'
  },
  'alexandervance_m1': {
    bio: 'Embajador de Alta Costura Masculina 💼\nInversor en Marcas de Lujo y Diseñadores Emergentes 📈\n👇 MASTERCLASS INVERSIÓN 👇',
    website: 'alexandervance.luxury/invest...'
  },
  'alessandraambrosio': {
    bio: 'Supermodelo & Emprendedora DeFi 👑\nInversiones en Moda Sostenible & Colecciones Exclusivas ✨\n👇 ACCESO EXCLUSIVO 👇',
    website: 'alessandraambrosio.com/vip...'
  },
  'alessandraambrosio_w2': {
    bio: 'Supermodelo & Emprendedora DeFi 👑\nInversiones en Moda Sostenible & Colecciones Exclusivas ✨\n👇 ACCESO EXCLUSIVO 👇',
    website: 'alessandraambrosio.com/vip...'
  },
  'sophialoren': {
    bio: 'Streetwear francés & Icono Cinematográfico 🌟\nDesfiles urbanos, arte y alta costura parisina ✨\n👇 DESFILE Y LOOKS 👇',
    website: 'sophialoren.paris/collection...'
  },
  'sophialoren_w3': {
    bio: 'Streetwear francés & Icono Cinematográfico 🌟\nDesfiles urbanos, arte y alta costura parisina ✨\n👇 DESFILE Y LOOKS 👇',
    website: 'sophialoren.paris/collection...'
  },
  'candiceswanepoel': {
    bio: 'Ángel Icónico de Pasarela ✨\nDirectora creativa & Fashion Tech Investor 💎\n👇 SHOWROOM PRIVADO 👇',
    website: 'candiceswanepoel.com/paris...'
  },
  'candiceswanepoel_w4': {
    bio: 'Ángel Icónico de Pasarela ✨\nDirectora creativa & Fashion Tech Investor 💎\n👇 SHOWROOM PRIVADO 👇',
    website: 'candiceswanepoel.com/paris...'
  },
  'kortajarena': {
    bio: 'Top Model & Actor Internacional 🎬\nEstilo sartorial, cine y embajador de alta costura 🕶️\n👇 PRÓXIMOS PROYECTOS 👇',
    website: 'kortajarena.actor/projects...'
  },
  'kortajarena_m2': {
    bio: 'Top Model & Actor Internacional 🎬\nEstilo sartorial, cine y embajador de alta costura 🕶️\n👇 PRÓXIMOS PROYECTOS 👇',
    website: 'kortajarena.actor/projects...'
  }
};

export function cleanUsername(username?: string): string {
  if (!username) return '';
  return username.toLowerCase().trim().replace(/^@/, '');
}

export function getBaseUsername(username?: string): string {
  const clean = cleanUsername(username);
  return clean.replace(/_w\d+|_m\d+$/, '');
}

export function getSynchronizedBioAndWebsite(
  username?: string,
  userId?: string,
  fallbackBio?: string,
  fallbackWebsite?: string
): SynchronizedBioData {
  const clean = cleanUsername(username);
  const base = getBaseUsername(username);

  if (typeof window !== 'undefined') {
    const customBio = localStorage.getItem(`custom_model_bio_${clean}`) ||
                      localStorage.getItem(`custom_model_bio_${base}`) ||
                      (userId ? localStorage.getItem(`custom_model_bio_${userId}`) : null);
    const customWebsite = localStorage.getItem(`custom_model_website_${clean}`) ||
                          localStorage.getItem(`custom_model_website_${base}`) ||
                          (userId ? localStorage.getItem(`custom_model_website_${userId}`) : null);

    if (customBio || customWebsite) {
      const preset = DEFAULT_SYNCHRONIZED_BIOS[clean] || DEFAULT_SYNCHRONIZED_BIOS[base];
      return {
        bio: customBio || fallbackBio || preset?.bio || '',
        website: customWebsite || fallbackWebsite || preset?.website || ''
      };
    }
  }

  const preset = DEFAULT_SYNCHRONIZED_BIOS[clean] || 
                 DEFAULT_SYNCHRONIZED_BIOS[base] ||
                 (clean.includes('adriana') ? DEFAULT_SYNCHRONIZED_BIOS['adrianalima'] : null) ||
                 (clean.includes('alexander') ? DEFAULT_SYNCHRONIZED_BIOS['alexandervance'] : null);

  const chosenBio = fallbackBio || preset?.bio || '';
  const chosenWebsite = fallbackWebsite || preset?.website || (clean ? `${clean}.com/vip...` : 'adrianalima.com/runway-vip...');

  return {
    bio: chosenBio,
    website: chosenWebsite
  };
}

export function saveSynchronizedBioAndWebsite(
  username: string,
  bio: string,
  website: string,
  userId?: string
) {
  if (typeof window === 'undefined') return;

  const clean = cleanUsername(username);
  const base = getBaseUsername(username);

  const trimmedBio = bio.trim();
  const trimmedWebsite = website.trim();

  localStorage.setItem(`custom_model_bio_${clean}`, trimmedBio);
  localStorage.setItem(`custom_model_bio_${base}`, trimmedBio);
  localStorage.setItem('custom_model_bio', trimmedBio);

  if (userId) {
    localStorage.setItem(`custom_model_bio_${userId}`, trimmedBio);
  }

  if (trimmedWebsite) {
    localStorage.setItem(`custom_model_website_${clean}`, trimmedWebsite);
    localStorage.setItem(`custom_model_website_${base}`, trimmedWebsite);
    if (userId) {
      localStorage.setItem(`custom_model_website_${userId}`, trimmedWebsite);
    }
  }

  window.dispatchEvent(
    new CustomEvent('sync_creator_profile', {
      detail: { username: clean, bio: trimmedBio, website: trimmedWebsite, userId }
    })
  );
}
