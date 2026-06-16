/**
 * WalletModal.jsx — Integration Phase multi-wallet picker overlay
 * Shows all supported wallets, marks installed ones, lets user pick.
 */
import { useEffect, useState } from 'react';
import { getSupportedWallets, StellarWalletsKit, initKit } from '../services/walletKit';

export default function WalletModal({ onConnected, onClose }) {
  const [wallets, setWallets] = useState([]);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    getSupportedWallets().then(setWallets).catch(() => setWallets([]));
  }, []);

  const handlePick = async (wallet) => {
    setBusy(wallet.id);
    try {
      initKit();
      StellarWalletsKit.setWallet(wallet.id);
      // 🔥 CRITICAL FIX: fetchAddress() initiates the connection prompt in the extension.
      // getAddress() only reads from the Kit's local memory, which is empty right now.
      const { address } = await StellarWalletsKit.fetchAddress();
      onConnected(address);
    } catch (err) {
      console.error('WalletModal handlePick Error:', err);
      onConnected(null, err);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden animate-scale-in"
        style={{
          background: 'linear-gradient(160deg, rgba(13,18,40,0.98) 0%, rgba(8,10,22,0.98) 100%)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 80px rgba(0,212,255,0.1), 0 32px 64px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h2 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Connect Wallet
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Select your Stellar wallet to continue
            </p>
          </div>
          <button
            id="wallet-modal-close"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            ✕
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
          {wallets.length === 0 ? (
            <div className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              <div className="spin-slow inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full mb-3" />
              <p className="text-xs">Discovering wallets…</p>
            </div>
          ) : (
            wallets.map((w) => (
              <button
                id={`wallet-option-${w.id}`}
                key={w.id}
                onClick={() => handlePick(w)}
                disabled={!!busy}
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 group disabled:opacity-60"
                style={{
                  background: w.isAvailable ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)',
                  border: w.isAvailable ? '1px solid rgba(0,212,255,0.15)' : '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = w.isAvailable ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)'; }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {w.icon
                    ? <img src={w.icon} alt={w.name} className="w-6 h-6 object-contain" />
                    : <span className="text-lg">👛</span>
                  }
                </div>

                {/* Name & status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{w.name}</span>
                    {w.isAvailable && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                        ✓ Installed
                      </span>
                    )}
                    {!w.isAvailable && (
                      <a href={w.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                        className="px-1.5 py-0.5 rounded text-xs font-medium hover:opacity-80 transition-opacity"
                        style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
                        Install
                      </a>
                    )}
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{w.url}</p>
                </div>

                {/* Arrow or spinner */}
                {busy === w.id
                  ? <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full spin-slow shrink-0" />
                  : <span className="text-xs shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--text-muted)' }}>›</span>
                }
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            🔒 Your keys never leave your wallet. SmartSplit is non-custodial.
          </span>
        </div>
      </div>
    </div>
  );
}
