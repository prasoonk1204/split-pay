import { TrendingUp, RefreshCw, Circle } from 'lucide-react';

export default function BalanceCard({ balance, publicKey, isLoading }) {
  const isConnected = !!publicKey;

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: '#0c0c0e',
        border: isConnected ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid #1a1a24',
        boxShadow: isConnected ? '0 0 30px rgba(0, 242, 255, 0.04)' : 'none',
      }}
    >
      {/* Subtle tech dots background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: isConnected ? '#00f2ff' : '#4b5563' }}
            >
              Account Balance
            </p>
            <p className="text-[10px] font-medium text-zinc-500">
              Stellar Testnet
            </p>
          </div>
          
          {isConnected ? (
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(0, 242, 255, 0.06)',
                border: '1px solid rgba(0, 242, 255, 0.2)',
                color: '#00f2ff',
              }}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Active</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-zinc-800 text-zinc-500"
            >
              <Circle className="w-2.5 h-2.5 fill-zinc-800 text-zinc-800" />
              <span>Offline</span>
            </div>
          )}
        </div>

        {/* Balance display */}
        <div className="mb-6">
          <div className="flex items-end gap-2.5 h-12">
            {isLoading ? (
              <div className="h-10 w-40 rounded-lg shimmer" style={{ background: 'rgba(0,242,255,0.05)' }} />
            ) : (
              <>
                <span
                  className="font-display font-bold text-4xl leading-none text-white text-glow-cyan"
                  style={{
                    color: isConnected ? '#ffffff' : '#4b5563',
                  }}
                >
                  {isConnected ? balance : '0.00'}
                </span>
                <span
                  className="font-display font-bold text-lg mb-0.5"
                  style={{ color: isConnected ? 'rgba(0, 242, 255, 0.7)' : '#4b5563' }}
                >
                  XLM
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom info row */}
        <div
          className="flex items-center justify-between pt-4 border-t border-zinc-900"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ 
                background: isConnected ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)', 
                border: isConnected ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid #1a1a24' 
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={isConnected ? '#00f2ff' : '#4b5563'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke={isConnected ? '#00f2ff' : '#4b5563'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke={isConnected ? '#00f2ff' : '#4b5563'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {isConnected ? `${publicKey.slice(0, 8)}...` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600">
            <RefreshCw className={`w-3 h-3 ${isConnected ? 'spin-slow' : ''}`} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
