import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://fgebgjyzakthnflnkyjq.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZWJnanl6YWt0aG5mbG5reWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjcyNTUsImV4cCI6MjA4OTAwMzI1NX0.eCMn1bEKXefsdUp1Uag8C4keZU_KzDmsPY330NAYRRE';

const CHUNK_SIZE = 1800;
const CHUNK_COUNT_SUFFIX = '__chunk_count';
const CHUNK_KEY_SEPARATOR = '__chunk_';

function getChunkCountKey(key: string) {
  return `${key}${CHUNK_COUNT_SUFFIX}`;
}

function getChunkKey(key: string, index: number) {
  return `${key}${CHUNK_KEY_SEPARATOR}${index}`;
}

async function removeChunkedValue(key: string) {
  const chunkCountValue = await SecureStore.getItemAsync(getChunkCountKey(key));
  const chunkCount = Number.parseInt(chunkCountValue ?? '0', 10);

  await SecureStore.deleteItemAsync(key);
  await SecureStore.deleteItemAsync(getChunkCountKey(key));

  if (chunkCount > 0) {
    await Promise.all(
      Array.from({ length: chunkCount }, (_, index) => SecureStore.deleteItemAsync(getChunkKey(key, index)))
    );
  }
}

const secureChunkStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const chunkCountValue = await SecureStore.getItemAsync(getChunkCountKey(key));
    const chunkCount = Number.parseInt(chunkCountValue ?? '0', 10);

    if (chunkCount > 0) {
      const chunks = await Promise.all(
        Array.from({ length: chunkCount }, (_, index) => SecureStore.getItemAsync(getChunkKey(key, index)))
      );

      if (chunks.some((chunk) => chunk == null)) {
        console.error('[Supabase] Incomplete chunked session payload for key:', key);
        return null;
      }

      return chunks.join('');
    }

    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await removeChunkedValue(key);

    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }

    const chunks = Array.from({ length: Math.ceil(value.length / CHUNK_SIZE) }, (_, index) =>
      value.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE)
    );

    await SecureStore.setItemAsync(getChunkCountKey(key), String(chunks.length));
    await Promise.all(chunks.map((chunk, index) => SecureStore.setItemAsync(getChunkKey(key, index), chunk)));
  },
  removeItem: async (key: string): Promise<void> => {
    await removeChunkedValue(key);
  },
};

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are missing.');
}

console.log('[Supabase] Initializing client:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureChunkStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
