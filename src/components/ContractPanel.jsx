import { useState, useEffect } from 'react';
import { sacTransfer, classifyError, CONTRACT_ID } from '../services/soroban';
import { Lock, HelpCircle } from 'lucide-react';

const EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/tx/';
const CONTRACT_EXPLORER = `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;

export default function ContractPanel({ 
  publicKey, 
  onResult, 
  onConnectWallet,
  prepopulatedPayees,
  prepopulatedSplitCount,
  onClearPrepopulation
}) {
  const [amount, setAmount] = useState('');
  const [splitCount, setSplitCount] = useState(2);
  const [recipients, setRecipients] = useState(['']);
  const [status, setStatus] = useState('idle'); // idle | pending | success | error
  const [txHash, setTxHash] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);

  const isConnected = !!publicKey;

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (prepopulatedPayees) {
      setSplitCount(prepopulatedSplitCount);
      setRecipients(prepopulatedPayees);
      if (onClearPrepopulation) onClearPrepopulation();
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [prepopulatedPayees, prepopulatedSplitCount, onClearPrepopulation]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!isConnected) return;
    const activeRecipients = recipients.map(r => r.trim()).filter(Boolean);
    if (activeRecipients.length !== splitCount - 1 || !amount) return;

    setStatus('pending');
    setTxHash('');
    setErrorInfo(null);

    try {
      const safeDivisor = Math.max(2, parseInt(splitCount, 10) || 2);
      const splitValue = (parseFloat(amount) / safeDivisor).toFixed(7);
      const result = await sacTransfer(publicKey, activeRecipients, splitValue);
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
      className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] relative overflow-hidden transition-all duration-300"
      style={{
        boxShadow: isConnected ? '0 0 35px rgba(0, 242, 255, 0.02)' : 'none',
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00f2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="#00f2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="#00f2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                Split &amp; Pay
              </h3>
              <a
                href={CONTRACT_EXPLORER}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                Contract: {CONTRACT_ID.slice(0, 6)}…{CONTRACT_ID.slice(-4)}
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400 cursor-help" />
          </div>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-5 relative">
        {/* Connection Required Lock Overlay */}
        {!isConnected && (
          <div className="absolute inset-0 z-30 bg-[#0c0c0e]/85 backdrop-filter backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4 text-zinc-500" />
            </div>
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest mb-1">
              Wallet Offline
            </h4>
            <p className="text-[10px] text-zinc-500 max-w-[200px] mb-4">
              Connect your Stellar wallet to interact with the Soroban smart contract.
            </p>
            <button
              onClick={onConnectWallet}
              className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black bg-[#00f2ff] hover:bg-[#00d4ff] transition-all"
              style={{ boxShadow: '0 0 12px rgba(0,242,255,0.2)' }}
            >
              Connect Wallet
            </button>
          </div>
        )}

        <div className={!isConnected ? 'opacity-25 pointer-events-none' : ''}>
          {status === 'idle' && (
            <form onSubmit={handleTransfer} className="space-y-4" id="contract-transfer-form">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Total Amount (XLM)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.0000001"
                    step="any"
                    required
                    disabled={!isConnected}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs placeholder-zinc-700 outline-none transition-all font-semibold bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-500/50"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 text-center">
                    Split Count
                  </label>
                  <input
                    type="number"
                    value={splitCount}
                    onChange={(e) => {
                      setSplitCount(e.target.value);
                      const parsed = parseInt(e.target.value, 10);
                      const safeCount = (isNaN(parsed) || parsed < 2) ? 2 : parsed;
                      setRecipients(prev => {
                        const updated = [...prev];
                        while (updated.length < safeCount - 1) updated.push('');
                        return updated.slice(0, safeCount - 1);
                      });
                    }}
                    min="2"
                    max="10"
                    required
                    disabled={!isConnected}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs placeholder-zinc-700 outline-none transition-all text-center font-bold bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Render Payee Inputs */}
              <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
                {recipients.map((rec, idx) => {
                  const safeDivisor = Math.max(2, parseInt(splitCount, 10) || 2);
                  const shareAmount = amount ? (parseFloat(amount) / safeDivisor).toFixed(4) : '0.00';
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Payee #{idx + 1} Address</span>
                        <span className="text-cyan-400 font-mono">{shareAmount} XLM</span>
                      </div>
                      <input
                        type="text"
                        value={rec}
                        onChange={(e) => {
                          const newR = [...recipients];
                          newR[idx] = e.target.value;
                          setRecipients(newR);
                        }}
                        placeholder="G... (Stellar Public Key)"
                        required
                        disabled={!isConnected}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono placeholder-zinc-700 outline-none transition-all bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-500/50"
                      />
                    </div>
                  );
                })}
              </div>

              <button
                id="contract-transfer-btn"
                type="submit"
                disabled={!isConnected}
                className="w-full mt-2 py-3 rounded-xl text-xs font-bold transition-all duration-200 text-black hover:scale-[1.01]"
                style={{
                  background: '#00f2ff',
                  boxShadow: '0 0 15px rgba(0,242,255,0.2)',
                }}
              >
                ⚡ Execute Split via Soroban
              </button>
            </form>
          )}

          {status === 'pending' && (
            <div className="py-10 flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/10" />
                <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent spin-slow" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Submitting to Soroban…</p>
                <p className="text-[10px] mt-1 text-zinc-500">Simulating → Signing → Broadcasting</p>
              </div>
              {/* Pulse progress bar */}
              <div className="w-32 rounded-full overflow-hidden" style={{ height: 2, background: 'rgba(0,242,255,0.1)' }}>
                <div className="h-full rounded-full shimmer" style={{ background: '#00f2ff', width: '60%' }} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                <span className="text-sm shrink-0">✅</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Split Successful</p>
                  <p className="text-[10px] mt-1 truncate font-mono text-zinc-500">{txHash}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a
                  href={`${EXPLORER_BASE}${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  id="view-on-explorer"
                  className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 hover:bg-emerald-950/50 transition-all"
                >
                  🔍 Explorer →
                </a>
                <button 
                  onClick={reset} 
                  className="flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-800 hover:text-white transition-all"
                >
                  New Split
                </button>
              </div>
            </div>
          )}

          {status === 'error' && errorInfo && (
            <div className="space-y-4 py-2">
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/30 space-y-1.5">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  {errorInfo.type === 'wallet_not_found' && '🔌 Wallet Not Found'}
                  {errorInfo.type === 'user_rejected' && '🚫 Split Cancelled'}
                  {errorInfo.type === 'insufficient_balance' && '💸 Underfunded Wallet'}
                  {errorInfo.type === 'generic' && '⚠️ Execution Failed'}
                </p>
                <p className="text-[10px] leading-relaxed text-zinc-500">{errorInfo.message}</p>
              </div>
              <button 
                onClick={reset} 
                className="w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-800 hover:text-white transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
