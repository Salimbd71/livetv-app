import { useState, useEffect } from "react";

const MOVIES_M3U8_URL =
  "https://raw.githubusercontent.com/ahan443/FAST-IPTV/refs/heads/main/z.m3u";

export interface Movie {
  name: string;
  url: string;
  category: string;
  logo?: string;
}

// Module-level cache — survives re-renders and page navigation
let _cache: Movie[] | null = null;
let _promise: Promise<Movie[]> | null = null;

function parseM3U8(text: string): Movie[] {
  const movies: Movie[] = [];
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("#EXTINF")) continue;

    // Extract tvg-logo
    const logoMatch = line.match(/tvg-logo="([^"]*)"/);
    const logo = logoMatch ? logoMatch[1] : undefined;

    // Extract group-title
    const groupMatch = line.match(/group-title="([^"]*)"/);
    const category = groupMatch ? groupMatch[1] : "Other";

    // Extract name (after the last comma)
    const commaIdx = line.lastIndexOf(",");
    const name = commaIdx >= 0 ? line.slice(commaIdx + 1).trim() : "Unknown";

    // Next non-comment line is the URL
    let url = "";
    for (let j = i + 1; j < lines.length; j++) {
      if (!lines[j].startsWith("#")) {
        url = lines[j].trim();
        i = j; // skip consumed lines
        break;
      }
    }

    if (url && name) {
      movies.push({ name, url, category, logo: logo || undefined });
    }
  }
  return movies;
}

function fetchMovies(): Promise<Movie[]> {
  if (_promise) return _promise;
  _promise = fetch(MOVIES_M3U8_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(text => {
      const movies = parseM3U8(text);
      _cache = movies;
      return movies;
    })
    .catch(err => {
      _promise = null;
      throw err;
    });
  return _promise;
}

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>(_cache ?? []);
  const [loading, setLoading] = useState<boolean>(!_cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cache) return;
    fetchMovies()
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => {
        setError("মুভি লোড করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।");
        setLoading(false);
      });
  }, []);

  const retry = () => {
    _cache = null;
    _promise = null;
    setError(null);
    setLoading(true);
    fetchMovies()
      .then(data => { setMovies(data); setLoading(false); })
      .catch(() => { setError("মুভি লোড করা সম্ভব হয়নি।"); setLoading(false); });
  };

  return { movies, loading, error, retry };
}
