import { useState } from 'react';
import { Send, ArrowRight, User, Coins } from 'lucide-react';

export default function SplitPaymentForm({ onSend, loading }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientFocused, setRecipientFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    onSend(recipient, amount);
  };

  const isValid = recipient.length > 0 && amount > 0;

  return (
    <div
      className="rounded-2xl p-px border-gradient"
    >
      <div
        className="glass-strong rounded-2xl p-6"
        style={{ border: '1px solid var(--border-subtle)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(0,212,255,0.1) 100%)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}
          >
            <Send className="w-4 h-4" style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h2
              className="font-display font-semibold text-base"
              style={{ color: 'var(--text-primary)' }}
            >
              Split & Pay
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Send XLM to any Stellar address
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient field */}
          <div>
            <label
              htmlFor="recipient-address"
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Recipient Address
            </label>
            <div className="relative">
              <div
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{
                  background: recipientFocused ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                }}
              >
                <User
                  className="w-4 h-4 transition-colors duration-200"
                  style={{ color: recipientFocused ? '#00d4ff' : 'var(--text-muted)' }}
                />
              </div>
              <input
                id="recipient-address"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                onFocus={() => setRecipientFocused(true)}
                onBlur={() => setRecipientFocused(false)}
                placeholder="G... (Stellar public key)"
                className="w-full rounded-xl pl-14 pr-4 py-3.5 text-sm font-mono transition-all duration-200 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: recipientFocused
                    ? '1px solid rgba(0,212,255,0.4)'
                    : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  boxShadow: recipientFocused ? '0 0 0 3px rgba(0,212,255,0.06)' : 'none',
                }}
              />
            </div>
          </div>

          {/* Amount field */}
          <div>
            <label
              htmlFor="payment-amount"
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Amount
            </label>
            <div className="relative">
              <div
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{
                  background: amountFocused ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
                }}
              >
                <Coins
                  className="w-4 h-4 transition-colors duration-200"
                  style={{ color: amountFocused ? '#a78bfa' : 'var(--text-muted)' }}
                />
              </div>
              <input
                id="payment-amount"
                type="number"
                step="0.0000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                placeholder="0.00"
                className="w-full rounded-xl pl-14 pr-20 py-3.5 text-sm transition-all duration-200 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: amountFocused
                    ? '1px solid rgba(124,58,237,0.4)'
                    : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  boxShadow: amountFocused ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none',
                }}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold tracking-widest"
                style={{ color: amountFocused ? '#a78bfa' : 'var(--text-muted)' }}
              >
                XLM
              </span>
            </div>
          </div>

          {/* Divider with arrow */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(0,212,255,0.06)',
                border: '1px solid rgba(0,212,255,0.12)',
                color: 'rgba(0,212,255,0.5)',
              }}
            >
              <ArrowRight className="w-3 h-3" />
              Instant transfer
            </div>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* Submit button */}
          <button
            id="send-payment-button"
            type="submit"
            disabled={loading || !isValid}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: isValid && !loading
                ? 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: isValid && !loading
                ? '0 0 25px rgba(0,212,255,0.2), 0 4px 15px rgba(0,0,0,0.3)'
                : 'none',
              color: '#fff',
              border: isValid && !loading ? 'none' : '1px solid var(--border-subtle)',
            }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 spin-slow" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                </svg>
                <span>Processing Transaction...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send & Pay</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
