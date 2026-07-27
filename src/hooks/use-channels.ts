import { useState, useEffect } from "react";

const FIREBASE_URL =
  "https://iptv-admin-954a5-default-rtdb.asia-southeast1.firebasedatabase.app/channels.json";

export interface Channel {
  name: string;
  url: string;
  category: string;
  logo?: string;
}

// Module-level cache — survives re-renders and page navigation
// so we fetch only once per browser session
let _cache: Channel[] | null = null;
let _promise: Promise<Channel[]> | null = null;

function fetchChannels(): Promise<Channel[]> {
  if (_promise) return _promise;
  _promise = fetch(FIREBASE_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data: unknown) => {
      // Firebase can return an array or a key→object map
      const arr: Channel[] = Array.isArray(data)
        ? (data as Channel[])
        : Object.values(data as Record<string, Channel>);
      _cache = arr;
      return arr;
    })
    .catch(err => {
      _promise = null; // allow retry on next mount
      throw err;
    });
  return _promise;
}

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>(_cache ?? []);
  const [loading, setLoading] = useState<boolean>(!_cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cache) return; // already loaded
    fetchChannels()
      .then(data => {
        setChannels(data);
        setLoading(false);
      })
      .catch(() => {
        setError("চ্যানেল লোড করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।");
        setLoading(false);
      });
  }, []);

  const retry = () => {
    _cache = null;
    _promise = null;
    setError(null);
    setLoading(true);
    fetchChannels()
      .then(data => { setChannels(data); setLoading(false); })
      .catch(() => { setError("চ্যানেল লোড করা সম্ভব হয়নি।"); setLoading(false); });
  };

  return { channels, loading, error, retry };
}
