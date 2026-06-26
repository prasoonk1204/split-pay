import { useState, useEffect } from 'react';

// ── Components ────────────────────────────────────────
import WalletConnect from './components/WalletConnect';
import BalanceCard from './components/BalanceCard';
import FreighterNotice from './components/FreighterNotice';
import WalletModal from './components/WalletModal';
import ContractPanel from './components/ContractPanel';
import ActivityFeed from './components/ActivityFeed';
import SavedGroups from './components/SavedGroups';
import DevLabs from './components/DevLabs';
import OnboardingWizard from './components/OnboardingWizard';

// ── Services ─────────────────────────────────────────────────────────────────
import {
  getAccountBalance,
  disconnectKit,
  classifyError,
} from './services/stellar';

import { StellarWalletsKit, initKit } from './services/walletKit';

function App() {
  // ── Shared state ─────────────────────────────────────────────────────────────
  const [publicKey, setPublicKey] = useState(() => {
    return localStorage.getItem('splitpay_address') || null;
  });
  const [balance, setBalance] = useState('0.00');

  // ── Active tab navigation state ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Pre-populated split form template state ───────────────────────────────────
  const [prepopulatedPayees, setPrepopulatedPayees] = useState(null);
  const [prepopulatedSplitCount, setPrepopulatedSplitCount] = useState(2);

  // ── Multi-wallet modal state ─────────────────────────────────────────────────
  const [showWalletModal, setShowWalletModal] = useState(false);

  // ── Freighter missing notice toast state ──────────────────────────────────────
  const [showFreighterNotice, setShowFreighterNotice] = useState(false);

  // ── Loading state ────────────────────────────────────────────────────────────
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

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

  // Auto-reconnect flow
  useEffect(() => {
    const savedAddress = localStorage.getItem('splitpay_address');
    const savedType = localStorage.getItem('splitpay_walletType');
    if (savedAddress && savedType) {
      initKit();
      StellarWalletsKit.setWallet(savedType);
      setTimeout(() => {
        updateBalance(savedAddress);
      }, 0);
    }
  }, []);

  const handleConnect = () => {
    setShowFreighterNotice(false);
    setShowWalletModal(true);
  };

  const handleWalletConnected = async (address, err, walletType = 'freighter') => {
    setShowWalletModal(false);
    if (err || !address) {
      const classified = classifyError(err || new Error('user_closed'));
      if (classified.type === 'wallet_not_found') setShowFreighterNotice(true);
      return;
    }
    setPublicKey(address);
    // Cache the session
    localStorage.setItem('splitpay_address', address);
    localStorage.setItem('splitpay_walletType', walletType);
    await updateBalance(address);
  };

  const handleDisconnect = () => {
    disconnectKit();
    setPublicKey(null);
    setBalance('0.00');
    localStorage.removeItem('splitpay_address');
    localStorage.removeItem('splitpay_walletType');
    setShowFreighterNotice(false);
  };

  const handleContractResult = ({ type }) => {
    if (type === 'success') {
      setTimeout(() => updateBalance(publicKey), 5000);
    }
  };

  const handleLoadGroup = (group) => {
    setPrepopulatedPayees(group.payees);
    setPrepopulatedSplitCount(group.payees.length + 1);
    setActiveTab('dashboard');
  };

  const handleFaucetSuccess = (addr) => {
    if (addr === publicKey) {
      updateBalance(publicKey);
    }
  };

  return (
    <div className="min-h-screen mesh-bg relative pb-10" style={{ background: 'var(--bg-primary)' }}>

      {/* Freighter not-installed toast */}
      <FreighterNotice
        show={showFreighterNotice}
        onClose={() => setShowFreighterNotice(false)}
      />

      {/* Multi-wallet modal */}
      {showWalletModal && (
        <WalletModal
          onConnected={handleWalletConnected}
          onClose={() => setShowWalletModal(false)}
        />
      )}

      {/* Ambient background glows - cyan only */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(0,242,255,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, rgba(0,242,255,0.15) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      {/* Main UI */}
      <div className="relative min-h-screen flex flex-col items-center justify-start py-6 sm:py-10 px-4 sm:px-6" style={{ zIndex: 2 }}>

        {/* Navbar */}
        <nav className="w-full max-w-7xl mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative" style={{ zIndex: 10 }}>
          
          {/* Top Row on Mobile: Logo & Network Badge */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00f2ff 0%, #008b9b 100%)', boxShadow: '0 0 15px rgba(0,242,255,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                SplitPay
              </span>
            </div>

            {/* Mobile Network badge */}
            <div className="flex sm:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03]">
              <span className="w-1.5 h-1.5 rounded-full pulse-cyan" style={{ background: '#00f2ff', boxShadow: '0 0 8px rgba(0,242,255,0.6)' }} />
              <span className="text-[9px] font-bold tracking-wider uppercase text-cyan-400">Testnet</span>
            </div>
          </div>

          {/* Navigation Tabs - Stretch full width on mobile, stack beautifully */}
          <div className="flex justify-center w-full sm:w-auto">
            <div className="flex gap-0.5 bg-[#0c0c0e] border border-zinc-800 rounded-xl p-1 w-full max-w-md sm:max-w-none sm:w-auto justify-between sm:justify-start">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'groups', label: 'Saved Groups' },
                { id: 'labs', label: 'Dev Labs' },
                { id: 'guide', label: 'User Guide' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-150 flex-1 sm:flex-initial text-center ${
                    activeTab === tab.id
                      ? 'bg-[#00f2ff] text-black shadow-[0_0_10px_rgba(0,242,255,0.15)] font-extrabold'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop-only Network badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0"
            style={{ background: 'rgba(0,242,255,0.04)', border: '1px solid rgba(0,242,255,0.1)' }}>
            <span className="w-2 h-2 rounded-full pulse-cyan" style={{ background: '#00f2ff', boxShadow: '0 0 8px rgba(0,242,255,0.6)' }} />
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#00f2ff' }}>Stellar Testnet</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(0,242,255,0.05)', border: '1px solid rgba(0,242,255,0.15)', color: '#00f2ff' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Soroban Smart Contracts
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-3 gradient-text">
            {activeTab === 'dashboard' && 'SplitPay'}
            {activeTab === 'groups' && 'Saved Contact Groups'}
            {activeTab === 'labs' && 'Developer Diagnostics'}
            {activeTab === 'guide' && 'Getting Started Guide'}
          </h1>
          <p className="text-xs max-w-sm mx-auto leading-relaxed text-zinc-400">
            {activeTab === 'dashboard' && 'Split bills instantly, send XLM to anyone, and record payments on-chain via Soroban.'}
            {activeTab === 'groups' && 'Manage reusable splits templates for your friends, roommates, or trip partners.'}
            {activeTab === 'labs' && 'Fund any testnet account with Friendbot and inspect deployed smart contract parameters.'}
            {activeTab === 'guide' && 'An interactive walk-through on setting up Freighter, configuring testnet, and splitting bills.'}
          </p>
        </div>

        {/* ── Active Tab View Rendering ── */}
        <div className="w-full max-w-7xl mx-auto animate-slide-up" style={{ animationDelay: '0.08s' }}>
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Wallet Info, Balance & Quick Guide */}
              <div className="space-y-6">
                <WalletConnect
                  publicKey={publicKey}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  loading={false}
                />
                <BalanceCard
                  balance={balance}
                  publicKey={publicKey}
                  isLoading={isFetchingBalance}
                />
                
                {/* Quick Guide */}
                <div className="rounded-2xl p-5 border border-zinc-800 bg-[#070709] text-xs space-y-3">
                  <h4 className="font-semibold text-cyan-400 uppercase tracking-widest text-[10px]">How it works</h4>
                  <ul className="space-y-3.5 text-zinc-400 font-medium">
                    <li className="flex gap-2.5">
                      <span className="text-cyan-400 select-none">01</span>
                      <span>Connect your Freighter or LOBSTR Stellar wallet configured to Testnet.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-cyan-400 select-none">02</span>
                      <span>Enter the total amount and payees to execute an atomic split via smart contract.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-cyan-400 select-none">03</span>
                      <span>Watch real-time transaction events stream directly to the on-chain activity feed.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 2: Contract Split Form */}
              <div className="lg:col-span-1">
                <ContractPanel
                  publicKey={publicKey}
                  onResult={handleContractResult}
                  onConnectWallet={handleConnect}
                  prepopulatedPayees={prepopulatedPayees}
                  prepopulatedSplitCount={prepopulatedSplitCount}
                  onClearPrepopulation={() => {
                    setPrepopulatedPayees(null);
                    setPrepopulatedSplitCount(2);
                  }}
                />
              </div>

              {/* Column 3: Live Activity Feed */}
              <div className="lg:col-span-1">
                <ActivityFeed />
              </div>

            </div>
          )}

          {activeTab === 'groups' && (
            <SavedGroups onLoadGroup={handleLoadGroup} />
          )}

          {activeTab === 'labs' && (
            <DevLabs publicKey={publicKey} onFaucetSuccess={handleFaucetSuccess} />
          )}

          {activeTab === 'guide' && (
            <OnboardingWizard publicKey={publicKey} onTriggerConnect={handleConnect} />
          )}

        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-[10px] tracking-wider uppercase text-zinc-600">
            Built on{' '}
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer"
              className="text-zinc-500 hover:text-cyan-400 transition-colors">
              Stellar Network
            </a>
            {' '}· Soroban Smart Contracts · Testnet only
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
