/**
 * ActivityFeed.jsx — Integration Phase: real-time Soroban event feed
 * Polls the Soroban RPC for recent contract events every 30 seconds.
 */
import { useEffect, useState, useCallback } from 'react';
import { fetchContractEvents, CONTRACT_ID } from '../services/soroban';

const CONTRACT_EXPLORER = `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;

export default function ActivityFeed() {
  const [events, setEvents] = useState(() => {
    const cached = localStorage.getItem('smartsplit_events');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const evs = await fetchContractEvents();
      setEvents(evs);
      localStorage.setItem('smartsplit_events', JSON.stringify(evs));
    } catch {
      // silent fail — feed shows empty or keeps cache
    } finally {
      setLoading(false);
      setLastRefresh(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 30_000);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(13,20,37,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="white" />
              <path d="M20.188 10.934a8 8 0 1 0-.178 2.006" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Activity Feed
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Live Soroban contract events</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loading
            ? <div className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full spin-slow" />
            : <span className="w-2 h-2 rounded-full pulse-cyan" style={{ background: '#00d4ff', display: 'inline-block' }} />
          }
          <button
            id="activity-feed-refresh"
            onClick={load}
            className="text-xs px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Event list */}
      <div className="p-4 space-y-2 max-h-56 overflow-y-auto">
        {loading && events.length === 0 && (
          <div className="py-6 text-center">
            <div className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full spin-slow mb-2" />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fetching contract events…</p>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="py-6 text-center space-y-2">
            <p className="text-2xl">📡</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No recent activity</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Events appear here when the contract is called
            </p>
            <a
              href={CONTRACT_EXPLORER}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs hover:opacity-80 transition-opacity mt-1"
              style={{ color: '#00d4ff' }}
            >
              View contract on Explorer →
            </a>
          </div>
        )}

        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-start gap-3 p-3 rounded-2xl animate-fade-in"
            style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.08)' }}
          >
            <span className="mt-0.5 text-base shrink-0">⚡</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {Array.isArray(ev.topics) ? ev.topics.join(' · ') : 'Contract Event'}
                </span>
                <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{ev.timestamp}</span>
              </div>
              <p className="text-xs mt-0.5 font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                Ledger #{ev.ledger}
                {ev.value !== null && ev.value !== undefined && ` · ${String(ev.value)}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lastRefresh && (
        <div className="px-5 pb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          Last updated: {lastRefresh} · auto-refreshes every 30s
        </div>
      )}
    </div>
  );
}
