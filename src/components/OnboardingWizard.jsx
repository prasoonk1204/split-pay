import { useState } from 'react';
import { HelpCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function OnboardingWizard({ publicKey, onTriggerConnect }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Install Wallet Extension",
      description: "You need a Stellar-compatible browser extension to interact with SplitPay. We recommend Freighter.",
      details: "Freighter securely holds your private keys and signs transactions. Install it on Chrome, Brave, Firefox, or Edge, and follow the instructions to create your Stellar keypair.",
      isComplete: !!publicKey || false,
      action: !publicKey ? (
        <button
          onClick={onTriggerConnect}
          className="mt-3 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black bg-[#00f2ff] hover:bg-[#00d4ff] transition-all"
        >
          Connect Wallet
        </button>
      ) : null
    },
    {
      title: "Configure testnet mode",
      description: "SplitPay runs exclusively on Stellar Testnet so you can split bills with free play money.",
      details: "Open your Freighter extension, click the Settings gear icon in the top right, navigate to 'Network' or 'Preferences', and switch the active network from Public to Testnet.",
      isComplete: !!publicKey, // Simple heuristic for step-progression
      action: null
    },
    {
      title: "Fund account via Faucet",
      description: "New Testnet accounts start with 0 XLM. You will need testnet tokens to pay transaction fees.",
      details: "Stellar provides a free service called Friendbot to fund testnet addresses with 10,000 XLM. You can fund your account directly via our Developer Labs tab!",
      isComplete: !!publicKey,
      action: null
    },
    {
      title: "Perform your first split!",
      description: "Send split payments directly to your friends' wallets atomically.",
      details: "Go back to the Dashboard tab, enter the total amount to split, specify how many friends you are splitting with, enter their public keys, and click 'Execute Split' to trigger the sign prompt. The contract will automatically calculate each friend's share and send it to them directly from your active wallet.",
      isComplete: false,
      action: null
    }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-zinc-900">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
          SplitPay Getting Started Wizard
        </h3>
      </div>

      {/* Steps indicators */}
      <div className="flex justify-between items-center gap-2 mb-8">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className="flex-1 flex flex-col items-start gap-1 pb-2 border-b-2 text-left transition-all"
            style={{
              borderColor: idx === activeStep 
                ? '#00f2ff' 
                : step.isComplete 
                  ? 'rgba(16,185,129,0.4)' 
                  : 'rgba(255,255,255,0.05)',
            }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              Step 0{idx + 1}
            </span>
            <span className="text-[10px] font-bold text-zinc-300 truncate w-full hidden sm:inline">
              {step.title}
            </span>
          </button>
        ))}
      </div>

      {/* Active step contents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-5 mb-6">
        
        {/* Left column info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-sm text-white">
              {steps[activeStep].title}
            </h4>
            {steps[activeStep].isComplete && (
              <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-950/20" />
            )}
          </div>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            {steps[activeStep].description}
          </p>
          <p className="text-[10px] text-zinc-500 leading-relaxed bg-[#070709] p-3 rounded-lg border border-zinc-900/80 font-medium">
            {steps[activeStep].details}
          </p>
          {steps[activeStep].action && (
            <div className="pt-2">{steps[activeStep].action}</div>
          )}
        </div>

        {/* Right column illustration mock */}
        <div className="md:col-span-1 border border-zinc-800 rounded-xl bg-zinc-950 p-4 flex flex-col items-center justify-center text-center space-y-2 select-none">
          {activeStep === 0 && (
            <>
              <span className="text-2xl">🔌</span>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">Wallet Connect</p>
              <p className="text-[9px] text-zinc-500">Freighter plugin connects keys to SplitPay dApp securely.</p>
            </>
          )}
          {activeStep === 1 && (
            <>
              <span className="text-2xl">⚙️</span>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">Network Config</p>
              <p className="text-[9px] text-zinc-500">Switch settings to 'Testnet' to bypass actual XLM gas fees.</p>
            </>
          )}
          {activeStep === 2 && (
            <>
              <span className="text-2xl">🚰</span>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">Friendbot Faucet</p>
              <p className="text-[9px] text-zinc-500">Claim 10,000 play XLM. Testnet laboratory makes funding free.</p>
            </>
          )}
          {activeStep === 3 && (
            <>
              <span className="text-2xl">⚡</span>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">Atomic Splitting</p>
              <p className="text-[9px] text-zinc-500">All transfers execute in a single atomic transaction block.</p>
            </>
          )}
        </div>
      </div>

      {/* Stepper actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className="flex items-center gap-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          className="flex items-center gap-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black bg-[#00f2ff] hover:bg-[#00d4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span>Next</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
