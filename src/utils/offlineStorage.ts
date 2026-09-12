/**
 * ShikshaSathi Offline Storage & API Response Caching Utility
 * 
 * Provides resilient offline caching for rural students:
 * 1. Uses CacheStorage API (if supported) and localStorage fallback.
 * 2. Provides fetchWithOfflineFallback for seamless GET requests.
 * 3. Persists generated lessons, flashcards, mind maps, and quiz results offline.
 */

const OFFLINE_LESSONS_KEY = 'shikshasathi_offline_lessons_v1';
const OFFLINE_API_CACHE_NAME = 'shikshasathi-api-cache-v1';

export interface SavedLesson {
  id: string;
  title: string;
  topic: string;
  content: string;
  dialect: string;
  timestamp: number;
  type: 'lesson' | 'quiz' | 'mindmap' | 'interview' | 'flashcard';
}

/**
 * Save a generated lesson or study material for offline review
 */
export function saveOfflineLesson(lesson: Omit<SavedLesson, 'timestamp'>): void {
  try {
    const existing = getOfflineLessons();
    const updated: SavedLesson[] = [
      { ...lesson, timestamp: Date.now() },
      ...existing.filter(item => item.id !== lesson.id)
    ].slice(0, 100); // retain up to 100 offline lessons
    
    localStorage.setItem(OFFLINE_LESSONS_KEY, JSON.stringify(updated));
    console.log(`[OfflineStorage] Saved lesson "${lesson.title}" for offline study.`);
  } catch (err) {
    console.warn('[OfflineStorage] Error saving offline lesson:', err);
  }
}

/**
 * Retrieve all offline lessons saved locally
 */
export function getOfflineLessons(): SavedLesson[] {
  try {
    const data = localStorage.getItem(OFFLINE_LESSONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn('[OfflineStorage] Error reading offline lessons:', err);
    return [];
  }
}

/**
 * Fetch wrapper that transparently uses CacheStorage and network fallback.
 * Ideal for rural areas with intermittent connectivity.
 */
export async function fetchWithOfflineCache<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<{ data: T; fromCache: boolean }> {
  const isGet = !options?.method || options.method.toUpperCase() === 'GET';

  // For non-GET requests (e.g. POST AI generation), try network directly
  if (!isGet) {
    const res = await fetch(url, options);
    const data = await res.json();
    return { data, fromCache: false };
  }

  // Check if CacheStorage is available in the browser
  const hasCacheStorage = typeof caches !== 'undefined';

  try {
    // 1. Attempt network fetch first (with a short timeout so rural students don't hang)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const clonedRes = res.clone();
      const data = await res.json();

      // Update CacheStorage asynchronously in background
      if (hasCacheStorage) {
        caches.open(OFFLINE_API_CACHE_NAME).then(cache => {
          cache.put(url, clonedRes);
        }).catch(() => {});
      }

      // Also backup small JSON to localStorage for complete reliability
      try {
        localStorage.setItem(`api_cache_${url}`, JSON.stringify({
          timestamp: Date.now(),
          data
        }));
      } catch (_) {}

      return { data, fromCache: false };
    }
  } catch (netErr) {
    console.warn(`[OfflineStorage] Network request failed for ${url}. Attempting to serve from offline cache...`, netErr);
  }

  // 2. Fallback to CacheStorage
  if (hasCacheStorage) {
    try {
      const cache = await caches.open(OFFLINE_API_CACHE_NAME);
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        const data = await cachedResponse.json();
        console.log(`[OfflineStorage] Serving cached response for ${url}`);
        return { data, fromCache: true };
      }
    } catch (cacheErr) {
      console.warn('[OfflineStorage] CacheStorage read error:', cacheErr);
    }
  }

  // 3. Fallback to localStorage cache
  try {
    const localData = localStorage.getItem(`api_cache_${url}`);
    if (localData) {
      const parsed = JSON.parse(localData);
      console.log(`[OfflineStorage] Serving localStorage backup for ${url}`);
      return { data: parsed.data, fromCache: true };
    }
  } catch (_) {}

  throw new Error(`Offline: No cached data available for ${url}. Please reconnect to fetch new content.`);
}
