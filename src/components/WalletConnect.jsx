import { Wallet, Zap } from 'lucide-react';

export default function WalletConnect({ publicKey, onConnect, onDisconnect, loading }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 flex items-center justify-between gap-4">
      {/* Left: icon + info */}
      <div className="flex items-center gap-4">
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: publicKey
              ? 'rgba(0, 242, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.02)',
            border: publicKey
              ? '1px solid rgba(0, 242, 255, 0.2)'
              : '1px solid #1a1a24',
          }}
        >
          <Wallet
            className="w-5 h-5"
            style={{ color: publicKey ? '#00f2ff' : '#4b5563' }}
          />
          {publicKey && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full pulse-cyan"
              style={{
                background: '#00f2ff',
                border: '2px solid #000000',
                boxShadow: '0 0 8px rgba(0,242,255,0.7)',
              }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">
            {publicKey ? 'Connected' : 'Stellar Wallet'}
          </p>
          {publicKey ? (
            <p className="text-xs font-mono font-bold text-zinc-200">
              {formatAddress(publicKey)}
            </p>
          ) : (
            <p className="text-xs font-bold text-zinc-400">
              Disconnected
            </p>
          )}
        </div>
      </div>

      {/* Right: CTA button */}
      {publicKey ? (
        <button
          id="disconnect-wallet-button"
          onClick={onDisconnect}
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-800 text-zinc-400 transition-all duration-200 hover:text-red-400 hover:border-red-900/40 hover:bg-red-950/20 active:scale-95"
        >
          Disconnect
        </button>
      ) : (
        <button
          id="connect-wallet-button"
          onClick={onConnect}
          disabled={loading}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-black"
          style={{
            background: loading
              ? 'rgba(0, 242, 255, 0.2)'
              : '#00f2ff',
            boxShadow: loading ? 'none' : '0 0 15px rgba(0,242,255,0.2)',
          }}
        >
          {loading ? (
            <>
              <svg className="w-3.5 h-3.5 spin-slow" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
