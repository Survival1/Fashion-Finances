import { ModelProfile } from '../types';

/**
 * Shared computation for the official ranking + video Likes counter
 * so every container displaying the global total stays strictly synchronized.
 */
export function computeTotalRankingAndVideoLikes(models: ModelProfile[]): number {
  const list = [...models].sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
  let lastLikes = list[list.length - 1]?.totalLikes || 500;
  let rankingLikes = list.reduce((sum, m) => sum + (Number(m.totalLikes) || 0), 0);
  let count = list.length;

  while (count < 100) {
    const i = count;
    const likes = Math.max(100, Math.floor((lastLikes || 500) * 0.985) - (i % 5));
    rankingLikes += likes;
    lastLikes = likes;
    count++;
  }

  let videoLikes = 0;
  const seenVideoIds = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('saved_videos_')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            arr.forEach((v: any) => {
              if (v?.id && !seenVideoIds.has(v.id)) {
                seenVideoIds.add(v.id);
                videoLikes += Number(v.likes) || 0;
              }
            });
          }
        }
      }
    }

    const liveRaw = localStorage.getItem('coll_casting_live_videos');
    if (liveRaw) {
      const liveList = JSON.parse(liveRaw);
      if (Array.isArray(liveList)) {
        liveList.forEach((v: any) => {
          if (v?.id && !seenVideoIds.has(v.id)) {
            seenVideoIds.add(v.id);
            videoLikes += Number(v.likes) || 0;
          }
        });
      }
    }
  } catch (_) {}

  let extraLiveLikes = 0;
  try {
    extraLiveLikes = Number(localStorage.getItem('coll_casting_live_likes_extra') || '0') || 0;
  } catch (_) {}

  return rankingLikes + videoLikes + extraLiveLikes;
}
