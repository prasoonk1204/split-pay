import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import BalanceCard from './components/BalanceCard';
import SplitPaymentForm from './components/SplitPaymentForm';
import TransactionStatus from './components/TransactionStatus';
import Background3D from './components/Background3D';
import FreighterNotice from './components/FreighterNotice';
import { connectWallet, getAccountBalance, sendPayment } from './services/stellar';

function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);

  // Transaction State
  const [txStatus, setTxStatus] = useState('idle'); // idle, success, error
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState('');

  // Freighter missing notice
  const [showFreighterNotice, setShowFreighterNotice] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    setShowFreighterNotice(false);
    try {
      const pk = await connectWallet();
      if (pk) {
        setPublicKey(pk);
        await updateBalance(pk);
      }
    } catch (error) {
      const msg = error?.message?.toLowerCase() ?? '';
      // Show the install notice when Freighter extension is not present
      if (
        msg.includes('freighter') ||
        msg.includes('not installed') ||
        msg.includes('not connected') ||
        msg.includes('extension')
      ) {
        setShowFreighterNotice(true);
      }
      console.error('Wallet connection failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    setBalance('0.00');
    setTxStatus('idle');
    setShowFreighterNotice(false);
  };

  const updateBalance = async (pk) => {
    try {
      const bal = await getAccountBalance(pk);
      setBalance(bal);
    } catch {
      setBalance('Error');
    }
  };

  const handleSendPayment = async (recipient, amount) => {
    if (!publicKey) return;

    setLoading(true);
    setTxStatus('idle');
    setTxError('');
    setTxHash('');

    try {
      const result = await sendPayment(publicKey, recipient, amount);
      setTxStatus('success');
      setTxHash(result.hash);
      setTimeout(() => updateBalance(publicKey), 4000);
    } catch (error) {
      setTxStatus('error');
      setTxError(error.message || 'Transaction failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', position: 'relative' }}>

      {/* ── 3D animated background ── */}
      <Background3D />

      {/* ── Freighter not-installed toast ── */}
      <FreighterNotice
        show={showFreighterNotice}
        onClose={() => setShowFreighterNotice(false)}
      />

      {/* ── Ambient background blobs (CSS layer) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ── Main UI content ── */}
      <div className="relative min-h-screen flex flex-col items-center justify-start py-10 px-4" style={{ zIndex: 2 }}>

        {/* Navbar */}
        <nav className="w-full max-w-lg mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                boxShadow: '0 0 20px rgba(0,212,255,0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
              SmartSplit
            </span>
          </div>

          {/* Network badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.15)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full pulse-cyan"
              style={{ background: '#00d4ff', boxShadow: '0 0 8px rgba(0,212,255,0.8)' }}
            />
            <span className="text-xs font-medium" style={{ color: '#00d4ff' }}>
              Stellar Testnet
            </span>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10 animate-slide-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-5"
            style={{
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.25)',
              color: '#a78bfa',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Powered by Stellar Blockchain
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-3 gradient-text">
            Smart Split &amp; Pay
          </h1>
          <p className="text-base max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Split bills instantly and send XLM to anyone on the Stellar network.
          </p>
        </div>

        {/* Cards */}
        <div className="w-full max-w-lg space-y-4 animate-slide-up" style={{ animationDelay: '0.08s' }}>
          <WalletConnect
            publicKey={publicKey}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            loading={loading && !publicKey}
          />

          {publicKey && (
            <div className="space-y-4 animate-slide-up">
              <BalanceCard balance={balance} publicKey={publicKey} />
              <SplitPaymentForm onSend={handleSendPayment} loading={loading} />
              {txStatus !== 'idle' && (
                <TransactionStatus
                  status={txStatus}
                  error={txError}
                  hash={txHash}
                  onClear={() => setTxStatus('idle')}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built on{' '}
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)' }}
              className="hover:text-white transition-colors"
            >
              Stellar
            </a>
            {' '}· Testnet only · Not financial advice
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
