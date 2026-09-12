import { HistoryItem } from '../types';

export const CURRENT_USER_EMAIL = 'Learner Profile';
export const CURRENT_USER_ID = 'learner_account';

const STORAGE_KEY_PREFIX = 'shikshasathi_history_';

/**
 * Fetch history strictly for the currently active user from backend API,
 * with resilient fallback to localStorage.
 */
export async function fetchUserHistory(
  userId: string = CURRENT_USER_ID,
  category?: string
): Promise<HistoryItem[]> {
  try {
    const params = new URLSearchParams();
    params.set('userId', userId);
    if (category && category !== 'all') {
      params.set('category', category);
    }

    const res = await fetch(`/api/history?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        // Cache full records to localStorage
        if (!category || category === 'all') {
          try {
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(data));
          } catch (e) {
            console.warn("Could not cache history locally:", e);
          }
        }
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend /api/history fetch failed, checking local cache:", err);
  }

  // Resilient fallback to local storage
  try {
    const local = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (local) {
      const parsed: HistoryItem[] = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const userItems = parsed.filter(item => item.userId === userId);
        if (category && category !== 'all') {
          return userItems.filter(item => item.category === category);
        }
        return userItems;
      }
    }
  } catch (e) {
    console.warn("Error reading local history fallback:", e);
  }

  return [];
}

/**
 * Record a new action to the backend database & local cache,
 * then dispatches a real-time event so the UI updates immediately without reload.
 */
export async function recordUserHistory(record: {
  userId?: string;
  category: 'interview' | 'quiz' | 'mindmap' | 'flashcards' | 'diagram' | 'chat';
  title: string;
  summary: string;
  data?: any;
}): Promise<HistoryItem> {
  const userId = record.userId || CURRENT_USER_ID;
  const payload = {
    userId,
    category: record.category,
    title: record.title,
    summary: record.summary,
    data: record.data || {}
  };

  let savedItem: HistoryItem | null = null;

  try {
    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      savedItem = await res.json();
    }
  } catch (err) {
    console.warn("Failed to POST history to server:", err);
  }

  // If server was offline or failed, generate valid local item
  if (!savedItem) {
    savedItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      category: record.category,
      title: record.title,
      summary: record.summary,
      createdAt: new Date().toISOString(),
      data: record.data || {}
    };
  }

  // Update client cache for immediate persistence
  try {
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    const existing: HistoryItem[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter(i => i.id !== savedItem!.id);
    const updated = [savedItem, ...filtered];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save history to localStorage:", e);
  }

  // Dispatch custom window event for real-time reactive UI update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<HistoryItem>('app:history_updated', {
        detail: savedItem
      })
    );
  }

  return savedItem;
}

/**
 * Delete a specific record by ID
 */
export async function deleteUserHistoryItem(
  id: string,
  userId: string = CURRENT_USER_ID
): Promise<boolean> {
  try {
    await fetch(`/api/history/${id}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn("Failed to delete history on server:", err);
  }

  // Remove from local storage
  try {
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const existing: HistoryItem[] = JSON.parse(raw);
      const updated = existing.filter(i => i.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<{ id: string; userId: string }>('app:history_deleted', {
        detail: { id, userId }
      })
    );
  }

  return true;
}

/**
 * Clear all records for active user
 */
export async function clearUserHistory(
  userId: string = CURRENT_USER_ID
): Promise<boolean> {
  try {
    await fetch(`/api/history?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn("Failed to clear history on server:", err);
  }

  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}`);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<{ userId: string }>('app:history_cleared', {
        detail: { userId }
      })
    );
  }

  return true;
}
