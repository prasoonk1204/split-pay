/**
 * ContractPanel.jsx — Integration Phase Soroban contract interaction
 * Calls the Stellar Native Asset Contract (SAC) transfer() function.
 * Shows pending → success/error with classified error messages.
 */
import { useState } from 'react';
import { sacTransfer, classifyError, CONTRACT_ID } from '../services/soroban';

const EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/tx/';
const CONTRACT_EXPLORER = `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;

export default function ContractPanel({ publicKey, onResult }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle'); // idle | pending | success | error
  const [txHash, setTxHash] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!publicKey || !recipient.trim() || !amount) return;

    setStatus('pending');
    setTxHash('');
    setErrorInfo(null);

    try {
      const result = await sacTransfer(publicKey, recipient.trim(), amount);
      setTxHash(result.hash);
      setStatus('success');
      if (onResult) onResult({ type: 'success', hash: result.hash });
    } catch (err) {
      const classified = classifyError(err);
      setErrorInfo(classified);
      setStatus('error');
      if (onResult) onResult({ type: 'error', errorType: classified.type });
    }
  };

  const reset = () => {
    setStatus('idle');
    setTxHash('');
    setErrorInfo(null);
  };

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(13,20,37,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(124,58,237,0.2)',
        boxShadow: '0 0 40px rgba(124,58,237,0.06)',
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Split &amp; Pay
            </h3>
            <a
              href={CONTRACT_EXPLORER}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              {CONTRACT_ID.slice(0, 8)}…{CONTRACT_ID.slice(-6)}
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">

        {status === 'idle' && (
          <form onSubmit={handleTransfer} className="space-y-3" id="contract-transfer-form">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Recipient Address
              </label>
              <input
                id="contract-recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="G…"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono placeholder-gray-600 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Amount (XLM)
              </label>
              <input
                id="contract-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.0000001"
                step="any"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm placeholder-gray-600 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
              />
            </div>

            <button
              id="contract-transfer-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.01] hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: 'white',
                boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              }}
            >
              ⚡ Transfer via Soroban
            </button>
          </form>
        )}

        {status === 'pending' && (
          <div className="py-6 flex flex-col items-center gap-4">
            {/* Animated ring */}
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent spin-slow" />
              <div className="absolute inset-2 rounded-full border border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent"
                style={{ animation: 'spin 1.5s linear infinite reverse' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Submitting to Soroban…</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Simulating → Signing → Broadcasting</p>
            </div>
            {/* Pulse bar */}
            <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(124,58,237,0.1)' }}>
              <div className="h-full rounded-full shimmer" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)', backgroundSize: '200%' }} />
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span className="text-xl">✅</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: '#10b981' }}>Contract call successful!</p>
                <p className="text-xs mt-0.5 truncate font-mono" style={{ color: 'var(--text-muted)' }}>{txHash}</p>
              </div>
            </div>
            <a
              href={`${EXPLORER_BASE}${txHash}`}
              target="_blank"
              rel="noreferrer"
              id="view-on-explorer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              🔍 View on Stellar Explorer →
            </a>
            <button onClick={reset} className="w-full py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>
              New Transfer
            </button>
          </div>
        )}

        {status === 'error' && errorInfo && (
          <div className="space-y-3">
            {/* Classified error card */}
            <div className="p-3.5 rounded-2xl space-y-1"
              style={{
                background: errorInfo.type === 'insufficient_balance'
                  ? 'rgba(234,179,8,0.08)'
                  : 'rgba(239,68,68,0.08)',
                border: `1px solid ${errorInfo.type === 'insufficient_balance' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
              <p className="text-sm font-semibold"
                style={{ color: errorInfo.type === 'insufficient_balance' ? '#eab308' : '#f87171' }}>
                {errorInfo.type === 'wallet_not_found' && '🔌 Wallet Not Found'}
                {errorInfo.type === 'user_rejected' && '🚫 Cancelled by User'}
                {errorInfo.type === 'insufficient_balance' && '💸 Insufficient Balance'}
                {errorInfo.type === 'generic' && '⚠️ Transaction Failed'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{errorInfo.message}</p>
            </div>
            <button onClick={reset} className="w-full py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
