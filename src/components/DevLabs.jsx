import { useState } from 'react';
import { Hammer, Coins, Terminal, ExternalLink, Copy, Check } from 'lucide-react';
import { CONTRACT_ID } from '../services/soroban';

export default function DevLabs({ publicKey, onFaucetSuccess }) {
  const [targetAddress, setTargetAddress] = useState(publicKey || '');
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [faucetResult, setFaucetResult] = useState(null); // success | error
  const [faucetMessage, setFaucetMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFund = async (e) => {
    e.preventDefault();
    const addressToFund = targetAddress.trim() || publicKey;
    if (!addressToFund) return;

    setFaucetLoading(true);
    setFaucetResult(null);
    setFaucetMessage('');

    try {
      const res = await fetch(`https://friendbot.stellar.org/?addr=${addressToFund}`);
      if (res.ok) {
        setFaucetResult('success');
        setFaucetMessage('10,000 XLM successfully credited! Your balance will refresh shortly.');
        if (onFaucetSuccess) onFaucetSuccess(addressToFund);
      } else {
        throw new Error('Friendbot response not OK');
      }
    } catch {
      setFaucetResult('error');
      setFaucetMessage('Friendbot call failed. Ensure you entered a valid Stellar public key and try again.');
    } finally {
      setFaucetLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Friendbot Faucet Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-900">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800">
              <Coins className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Friendbot Faucet
            </h3>
          </div>
          <p className="text-[10px] text-zinc-400 mb-4 leading-relaxed">
            Need testnet funds? Fund any Stellar account with **10,000 XLM** instantly from the official Stellar Testnet Friendbot.
          </p>

          <form onSubmit={handleFund} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Stellar Account Address (G...)
              </label>
              <input
                type="text"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                placeholder={publicKey || "Enter public key G..."}
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono placeholder-zinc-700 outline-none transition-all bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={faucetLoading}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 text-black hover:scale-[1.01] flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: '#00f2ff',
                boxShadow: '0 0 15px rgba(0,242,255,0.2)',
              }}
            >
              {faucetLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full spin-slow" />
                  <span>Requesting Faucet...</span>
                </>
              ) : (
                <span>Fund 10,000 XLM</span>
              )}
            </button>
          </form>
        </div>

        {/* Faucet results */}
        {faucetResult && (
          <div
            className={`mt-6 p-3.5 rounded-xl text-[10px] border leading-relaxed ${
              faucetResult === 'success'
                ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                : 'bg-red-950/20 border-red-900/30 text-red-400'
            }`}
          >
            {faucetResult === 'success' ? '✅' : '⚠️'} {faucetMessage}
          </div>
        )}
      </div>

      {/* Contract Diagnostics Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 h-fit">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-900">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800">
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
            Contract Diagnostics
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Contract ID</span>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2">
              <span className="text-[10px] font-mono text-zinc-300 truncate flex-1">{CONTRACT_ID}</span>
              <button
                onClick={handleCopy}
                className="text-zinc-500 hover:text-cyan-400 transition-colors p-1"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-zinc-400 text-[10px]">
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 space-y-1">
              <span className="font-bold text-zinc-500 uppercase tracking-widest text-[8px]">Network Passphrase</span>
              <p className="font-semibold text-zinc-300">Test Sandbox (`Testnet`)</p>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 space-y-1">
              <span className="font-bold text-zinc-500 uppercase tracking-widest text-[8px]">Interface Standard</span>
              <p className="font-semibold text-zinc-300">Soroban SEP-41 / Rust</p>
            </div>
          </div>

          <a
            href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-900 transition-all"
          >
            <span>Inspect Contract on Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
}
