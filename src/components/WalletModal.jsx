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
      const { address } = await StellarWalletsKit.fetchAddress();
      onConnected(address, null, wallet.id);
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
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: '#0c0c0e',
          border: '1px solid rgba(0, 242, 255, 0.2)',
          boxShadow: '0 0 40px rgba(0,242,255,0.05), 0 20px 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-900">
          <div>
            <h2 className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Connect Wallet
            </h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Select your Stellar extension to login
            </p>
          </div>
          <button
            id="wallet-modal-close"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:bg-zinc-800 text-zinc-500 hover:text-white border border-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
          {wallets.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              <div className="spin-slow inline-block w-4 h-4 border border-cyan-400 border-t-transparent rounded-full mb-2" />
              <p className="text-[10px]">Discovering wallets…</p>
            </div>
          ) : (
            wallets.map((w) => (
              <button
                id={`wallet-option-${w.id}`}
                key={w.id}
                onClick={() => handlePick(w)}
                disabled={!!busy}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group disabled:opacity-60"
                style={{
                  background: w.isAvailable ? 'rgba(0,242,255,0.02)' : 'transparent',
                  border: w.isAvailable ? '1px solid rgba(0,242,255,0.1)' : '1px solid #1a1a24',
                }}
                onMouseEnter={(e) => { if (!busy) { e.currentTarget.style.background = 'rgba(0,242,255,0.06)'; e.currentTarget.style.borderColor = '#00f2ff'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = w.isAvailable ? 'rgba(0,242,255,0.02)' : 'transparent'; e.currentTarget.style.borderColor = w.isAvailable ? 'rgba(0,242,255,0.1)' : '#1a1a24'; }}
              >
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 bg-zinc-950 border border-zinc-800">
                  {w.icon ? (
                    <img src={w.icon} alt={w.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="text-sm">👛</span>
                  )}
                </div>

                {/* Name & status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{w.name}</span>
                    {w.isAvailable && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-400 border border-emerald-900/30">
                        Installed
                      </span>
                    )}
                    {!w.isAvailable && (
                      <a href={w.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                        className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-opacity">
                        Install
                      </a>
                    )}
                  </div>
                  <p className="text-[9px] text-zinc-600 truncate mt-0.5">{w.url}</p>
                </div>

                {/* Arrow or spinner */}
                {busy === w.id ? (
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full spin-slow shrink-0" />
                ) : (
                  <span className="text-xs shrink-0 transition-transform group-hover:translate-x-0.5 text-zinc-600">›</span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center gap-2 border-t border-zinc-900 bg-zinc-950/40">
          <span className="text-[9px] text-zinc-600 font-medium">
            🔒 Your keys never leave your device. SplitPay is non-custodial.
          </span>
        </div>
      </div>
    </div>
  );
}
