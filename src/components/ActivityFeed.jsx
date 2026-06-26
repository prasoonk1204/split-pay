import { useEffect, useState, useCallback } from 'react';
import { fetchContractEvents, CONTRACT_ID } from '../services/soroban';

const CONTRACT_EXPLORER = `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;

export default function ActivityFeed() {
  const [events, setEvents] = useState(() => {
    const cached = localStorage.getItem('splitpay_events');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      const evs = await fetchContractEvents();
      
      setEvents(prev => {
        const isIdentical = prev.length === evs.length && prev.every((e, i) => e.id === evs[i].id);
        if (isIdentical) return prev;
        
        localStorage.setItem('splitpay_events', JSON.stringify(evs, (_, v) => 
          typeof v === 'bigint' ? v.toString() : v
        ));
        return evs;
      });
    } catch {
      // silent fail
    } finally {
      setLoading(false);
      setLastRefresh(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    const timer = setInterval(load, 15000); // 15s interval is great for testnet polling
    return () => {
      clearTimeout(t);
      clearInterval(timer);
    };
  }, [load]);

  return (
    <div
      className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#00f2ff" />
              <path d="M20.188 10.934a8 8 0 1 0-.178 2.006" stroke="#00f2ff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
              On-Chain Activity
            </h3>
            <p className="text-[10px] text-zinc-500">Live Soroban events</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full spin-slow" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full pulse-cyan" style={{ background: '#00f2ff' }} />
          )}
          <button
            id="activity-feed-refresh"
            onClick={load}
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all hover:bg-zinc-800 border border-zinc-800 text-zinc-400"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Event list */}
      <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
        {loading && events.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-block w-4 h-4 border border-cyan-400 border-t-transparent rounded-full spin-slow mb-2" />
            <p className="text-[10px] text-zinc-500">Fetching events…</p>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="py-12 text-center space-y-2">
            <p className="text-xl">📡</p>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No Activity Found</p>
            <p className="text-[10px] text-zinc-600 max-w-[180px] mx-auto leading-relaxed">
              Events will appear here when splits are executed on-chain.
            </p>
            <a
              href={CONTRACT_EXPLORER}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[10px] text-cyan-400 hover:underline mt-2 font-medium"
            >
              View on Explorer →
            </a>
          </div>
        )}

        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-900 bg-zinc-950/60 animate-fade-in"
          >
            <span className="text-[10px] shrink-0 mt-0.5">⚡</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold truncate text-zinc-200">
                  {Array.isArray(ev.topics) ? ev.topics.join(' · ') : 'Contract Event'}
                </span>
                <span className="text-[9px] shrink-0 text-zinc-600 font-medium">{ev.timestamp}</span>
              </div>
              <p className="text-[10px] mt-1 font-mono text-zinc-500 truncate">
                Ledger #{ev.ledger}
                {ev.value !== null && ev.value !== undefined && (() => {
                  try {
                    const stroops = BigInt(ev.value);
                    const xlm = Number(stroops) / 1e7;
                    return ` · ${xlm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 })} XLM`;
                  } catch {
                    return ` · ${ev.value}`;
                  }
                })()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lastRefresh && (
        <div className="px-5 pb-4 text-[9px] text-zinc-600 font-medium">
          Last sync: {lastRefresh} · Polls every 15s
        </div>
      )}
    </div>
  );
}
