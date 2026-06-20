import { useState, useEffect } from 'react';

// ── Core Phase components (unchanged) ────────────────────────────────────────
import WalletConnect from './components/WalletConnect';
import BalanceCard from './components/BalanceCard';
import Background3D from './components/Background3D';
import FreighterNotice from './components/FreighterNotice';

// ── Integration Phase components ────────────────────────────────────────────────────
import WalletModal from './components/WalletModal';
import ContractPanel from './components/ContractPanel';
import ActivityFeed from './components/ActivityFeed';

// ── Services ─────────────────────────────────────────────────────────────────
import {
  connectWallet,
  getAccountBalance,
  openKitModal,
  disconnectKit,
  classifyError,
} from './services/stellar';

import { StellarWalletsKit, initKit } from './services/walletKit';

function App() {
  // ── Shared state ─────────────────────────────────────────────────────────────
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);

  // ── Integration Phase: multi-wallet modal state ────────────────────────────────────
  const [showWalletModal, setShowWalletModal] = useState(false);

  // ── Core Phase: Freighter missing notice ─────────────────────────────────────
  const [showFreighterNotice, setShowFreighterNotice] = useState(false);

  // ── Hardening Phase: Loading/Caching state ───────────────────────────────────────
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  // Auto-reconnect flow
  useEffect(() => {
    const savedAddress = localStorage.getItem('smartsplit_address');
    const savedType = localStorage.getItem('smartsplit_walletType');
    if (savedAddress && savedType) {
      initKit();
      StellarWalletsKit.setWallet(savedType);
      setPublicKey(savedAddress);
      updateBalance(savedAddress);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────

  const updateBalance = async (pk) => {
    setIsFetchingBalance(true);
    try {
      const bal = await getAccountBalance(pk);
      setBalance(bal);
    } catch {
      setBalance('Error');
    } finally {
      setIsFetchingBalance(false);
    }
  };

  // ── Integration Phase: open multi-wallet modal ─────────────────────────────────────
  const handleConnect = () => {
    setShowFreighterNotice(false);
    setShowWalletModal(true);
  };

  // Called when user picks a wallet in WalletModal
  const handleWalletConnected = async (address, err, walletType = 'freighter') => {
    setShowWalletModal(false);
    if (err || !address) {
      const classified = classifyError(err || new Error('user_closed'));
      if (classified.type === 'wallet_not_found') setShowFreighterNotice(true);
      return;
    }
    setPublicKey(address);
    // Cache the session
    localStorage.setItem('smartsplit_address', address);
    localStorage.setItem('smartsplit_walletType', walletType);
    await updateBalance(address);
  };

  const handleDisconnect = () => {
    disconnectKit();
    setPublicKey(null);
    setBalance('0.00');
    localStorage.removeItem('smartsplit_address');
    localStorage.removeItem('smartsplit_walletType');
    setShowFreighterNotice(false);
  };

  // ── Integration Phase: Contract Panel result handler ────────────────────────────────
  const handleContractResult = ({ type, hash, errorType }) => {
    if (type === 'success') {
      setTimeout(() => updateBalance(publicKey), 5000);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', position: 'relative' }}>

      {/* ── 3D animated background (Core Phase, unchanged) ── */}
      <Background3D />

      {/* ── Freighter not-installed toast (Core Phase, unchanged) ── */}
      <FreighterNotice
        show={showFreighterNotice}
        onClose={() => setShowFreighterNotice(false)}
      />

      {/* ── Integration Phase: Multi-wallet modal ── */}
      {showWalletModal && (
        <WalletModal
          onConnected={handleWalletConnected}
          onClose={() => setShowWalletModal(false)}
        />
      )}

      {/* ── Ambient background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* ── Main UI ── */}
      <div className="relative min-h-screen flex flex-col items-center justify-start py-6 sm:py-10 px-4 sm:px-6" style={{ zIndex: 2 }}>

        {/* Navbar */}
        <nav className="w-full max-w-4xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
              SmartSplit
            </span>
          </div>

          {/* Network badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <span className="w-2 h-2 rounded-full pulse-cyan" style={{ background: '#00d4ff', boxShadow: '0 0 8px rgba(0,212,255,0.8)' }} />
            <span className="text-xs font-medium" style={{ color: '#00d4ff' }}>Stellar Testnet</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-5"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powered by Stellar Blockchain · Soroban Smart Contracts
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-3 gradient-text">
            Smart Split &amp; Pay
          </h1>
          <p className="text-base max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Split bills instantly, send XLM to anyone, and record splits on-chain via Soroban.
          </p>
        </div>

        {/* ── Layout: single column (disconnected) / two-column (connected) ── */}
        <div className={`w-full ${publicKey ? 'max-w-4xl' : 'max-w-lg'} animate-slide-up`} style={{ animationDelay: '0.08s' }}>

          {publicKey ? (
            /* ── Connected: two-column layout ── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-4">
                <WalletConnect
                  publicKey={publicKey}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  loading={loading && !publicKey}
                />
                <BalanceCard balance={balance} publicKey={publicKey} isLoading={isFetchingBalance} />
                <ContractPanel
                  publicKey={publicKey}
                  onResult={handleContractResult}
                />
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <ActivityFeed />
              </div>
            </div>
          ) : (
            /* ── Disconnected: single column ── */
            <div className="space-y-4">
              <WalletConnect
                publicKey={publicKey}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                loading={loading && !publicKey}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built on{' '}
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition-colors">
              Stellar
            </a>
            {' '}· Soroban Smart Contracts · Testnet only · Not financial advice
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
