import { TrendingUp, RefreshCw } from 'lucide-react';

export default function BalanceCard({ balance, publicKey }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0f1d35 50%, #130d2e 100%)',
        border: '1px solid rgba(0,212,255,0.15)',
        boxShadow: '0 0 40px rgba(0,212,255,0.08), 0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Background glows */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'rgba(0,212,255,0.7)' }}
            >
              Total Balance
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Stellar Testnet
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <TrendingUp className="w-3 h-3" style={{ color: '#10b981' }} />
            <span className="text-xs font-semibold" style={{ color: '#10b981' }}>Active</span>
          </div>
        </div>

        {/* Balance display */}
        <div className="mb-6">
          <div className="flex items-end gap-3">
            <span
              className="font-display font-bold text-5xl leading-none"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(0,212,255,0.9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {balance}
            </span>
            <span
              className="font-display font-bold text-xl mb-1"
              style={{ color: 'rgba(0,212,255,0.6)' }}
            >
              XLM
            </span>
          </div>
        </div>

        {/* Bottom info row */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {publicKey ? `${publicKey.slice(0, 8)}...` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
