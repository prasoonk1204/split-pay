import { Wallet, Zap } from 'lucide-react';

export default function WalletConnect({ publicKey, onConnect, onDisconnect, loading }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div
      className="border-gradient rounded-2xl p-px"
      style={{ background: 'transparent' }}
    >
      <div
        className="glass-strong rounded-2xl p-5 flex items-center justify-between gap-4"
        style={{
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Left: icon + info */}
        <div className="flex items-center gap-4">
          <div
            className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: publicKey
                ? 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(124,58,237,0.15) 100%)'
                : 'rgba(255,255,255,0.04)',
              border: publicKey
                ? '1px solid rgba(0,212,255,0.25)'
                : '1px solid var(--border-subtle)',
            }}
          >
            <Wallet
              className="w-5 h-5"
              style={{ color: publicKey ? '#00d4ff' : 'var(--text-muted)' }}
            />
            {publicKey && (
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full pulse-cyan"
                style={{
                  background: '#00d4ff',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 0 8px rgba(0,212,255,0.7)',
                }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-medium uppercase tracking-widest mb-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {publicKey ? 'Connected' : 'Wallet'}
            </p>
            {publicKey ? (
              <p
                className="text-sm font-mono font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatAddress(publicKey)}
              </p>
            ) : (
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Freighter Wallet
              </p>
            )}
          </div>
        </div>

        {/* Right: CTA button */}
        {publicKey ? (
          <button
            id="disconnect-wallet-button"
            onClick={onDisconnect}
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Disconnect
          </button>
        ) : (
          <button
            id="connect-wallet-button"
            onClick={onConnect}
            disabled={loading}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: loading
                ? 'rgba(0,212,255,0.1)'
                : 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
              boxShadow: loading ? 'none' : '0 0 20px rgba(0,212,255,0.25), 0 4px 12px rgba(0,0,0,0.3)',
              color: '#fff',
              border: 'none',
            }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Connect Wallet
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
