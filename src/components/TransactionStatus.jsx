import { CheckCircle2, XCircle, ExternalLink, X } from 'lucide-react';

export default function TransactionStatus({ status, error, hash, onClear }) {
  if (status === 'idle') return null;

  const isSuccess = status === 'success';

  return (
    <div
      className="rounded-2xl animate-scale-in"
      style={{
        background: isSuccess
          ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(0,212,255,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(220,38,38,0.04) 100%)',
        border: isSuccess
          ? '1px solid rgba(16,185,129,0.2)'
          : '1px solid rgba(239,68,68,0.2)',
        boxShadow: isSuccess
          ? '0 0 30px rgba(16,185,129,0.05)'
          : '0 0 30px rgba(239,68,68,0.05)',
      }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isSuccess ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                border: isSuccess ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
              }}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
              ) : (
                <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
              )}
            </div>
            <div>
              <h4
                className="font-display font-semibold text-sm"
                style={{ color: isSuccess ? '#10b981' : '#ef4444' }}
              >
                {isSuccess ? 'Transaction Successful!' : 'Transaction Failed'}
              </h4>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {isSuccess ? 'Your XLM has been sent on the Stellar network.' : 'Something went wrong. Please try again.'}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            id="clear-transaction-status"
            onClick={onClear}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Success: hash */}
        {isSuccess && hash && (
          <div
            className="mt-3 rounded-xl p-3"
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(16,185,129,0.12)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Transaction Hash
            </p>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 group"
            >
              <span
                className="text-xs font-mono break-all leading-relaxed flex-1 transition-colors duration-200"
                style={{ color: 'rgba(0,212,255,0.7)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,212,255,0.7)'}
              >
                {hash}
              </span>
              <ExternalLink
                className="w-3.5 h-3.5 shrink-0 mt-0.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: 'rgba(0,212,255,0.4)' }}
              />
            </a>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              ↗ View on Stellar Expert Explorer
            </p>
          </div>
        )}

        {/* Error: message */}
        {!isSuccess && error && (
          <div
            className="mt-3 rounded-xl p-3"
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(239,68,68,0.12)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Error Details
            </p>
            <p className="text-sm leading-relaxed break-words" style={{ color: 'rgba(239,68,68,0.9)' }}>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
