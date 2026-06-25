import { useState, useEffect } from 'react';
import { X, ExternalLink, AlertTriangle } from 'lucide-react';

const FREIGHTER_CHROME =
  'https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk';
const FREIGHTER_FIREFOX =
  'https://addons.mozilla.org/en-US/firefox/addon/freighter/';

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Edg/')) return 'edge';
  return 'chrome';
}

export default function FreighterNotice({ show, onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setExiting(false);
    }
  }, [show]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 300);
  };

  const browser = detectBrowser();
  const storeUrl = browser === 'firefox' ? FREIGHTER_FIREFOX : FREIGHTER_CHROME;
  const storeName = browser === 'firefox' ? 'Firefox Add-ons' : 'Chrome Web Store';

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '360px',
        width: 'calc(100vw - 48px)',
        animation: exiting
          ? 'toastSlideOut 0.3s cubic-bezier(0.4,0,1,1) forwards'
          : 'toastSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
      }}
    >
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateY(0)    scale(1); }
          to   { opacity: 0; transform: translateY(12px) scale(0.95); }
        }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0c0e]"
        style={{
          boxShadow: '0 0 30px rgba(0,242,255,0.04), 0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top accent bar */}
        <div className="h-0.5 bg-[#00f2ff]" />

        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-zinc-950 border border-zinc-900">
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-xs text-white uppercase tracking-wider">
                Freighter Missing
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Freighter wallet extension is required to use SplitPay.
              </p>
            </div>

            <button
              id="close-freighter-notice"
              onClick={handleClose}
              className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-600 hover:text-white border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Steps */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-3 space-y-2">
            {[
              'Install Freighter Extension from store',
              'Create or import a Stellar account',
              'Switch settings to Stellar Testnet',
              'Connect wallet on the dashboard',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-black bg-[#00f2ff] shrink-0 select-none">
                  {i + 1}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            id="install-freighter-link"
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-black bg-[#00f2ff] hover:bg-[#00d4ff] transition-all"
            style={{ boxShadow: '0 0 10px rgba(0,242,255,0.1)' }}
          >
            <span>Install Freighter</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
