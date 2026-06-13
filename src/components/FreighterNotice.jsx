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
        maxWidth: '380px',
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
        style={{
          background: 'rgba(10,15,30,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: '16px',
          boxShadow:
            '0 0 30px rgba(251,191,36,0.08), 0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: '3px',
            background:
              'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
          }}
        />

        <div style={{ padding: '16px 16px 16px 16px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: 'rgba(251,191,36,0.12)',
                border: '1px solid rgba(251,191,36,0.25)',
              }}
            >
              <AlertTriangle
                style={{ width: '18px', height: '18px', color: '#fbbf24' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#fbbf24',
                  margin: 0,
                  marginBottom: '2px',
                }}
              >
                Freighter Not Installed
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.45)',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                A Freighter wallet extension is required to use Smart Split &amp; Pay.
              </p>
            </div>

            <button
              id="close-freighter-notice"
              onClick={handleClose}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
              }}
              aria-label="Dismiss"
            >
              <X style={{ width: '13px', height: '13px' }} />
            </button>
          </div>

          {/* Steps */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '10px 12px',
              marginBottom: '12px',
            }}
          >
            {[
              'Install Freighter from the link below',
              'Create or import your Stellar account',
              'Switch to Testnet in Freighter settings',
              'Click "Connect Wallet" to get started',
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '5px 0',
                  borderBottom:
                    i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'rgba(251,191,36,0.15)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    color: '#fbbf24',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: '1.5',
                  }}
                >
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
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(251,191,36,0.2)',
              transition: 'all 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow =
                '0 0 30px rgba(251,191,36,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow =
                '0 0 20px rgba(251,191,36,0.2)';
            }}
          >
            Install Freighter — {storeName}
            <ExternalLink style={{ width: '13px', height: '13px' }} />
          </a>
        </div>
      </div>
    </div>
  );
}
