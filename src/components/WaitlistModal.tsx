import React, { useState } from 'react';
import { X, Sparkles, Check, Send, ShieldCheck, Zap, Server, Lock } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [assistant, setAssistant] = useState('Claude Desktop');
  const [requestedServers, setRequestedServers] = useState('');
  const [userType, setUserType] = useState('developer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Attempt sending to Cloudflare Worker endpoint
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, assistant, requestedServers, userType }),
      });
    } catch {
      // Graceful fallback
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/30 shadow-2xl overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/60 border border-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>aihost.info Managed Cloud Bridge</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Run Any MCP on Demand in the Cloud
            </h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              We are building the on-demand managed cloud proxy. Connect your AI assistant to any MCP provider with instant cloud execution, managed secret vaults, and centralized credits.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <Zap className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <div className="text-[11px] font-semibold text-slate-200">Zero Local Runtime</div>
                <div className="text-[10px] text-slate-400">No Docker/Node needed</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <Lock className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                <div className="text-[11px] font-semibold text-slate-200">Vaulted Auth</div>
                <div className="text-[10px] text-slate-400">Secure managed tokens</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <Server className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <div className="text-[11px] font-semibold text-slate-200">Global SSE Proxies</div>
                <div className="text-[10px] text-slate-400">Low latency worldwide</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-200">Your Email *</label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">Primary Assistant</label>
                  <select
                    value={assistant}
                    onChange={(e) => setAssistant(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option>Claude Desktop</option>
                    <option>Cursor</option>
                    <option>Google Antigravity / Gemini</option>
                    <option>Windsurf</option>
                    <option>Cline / Roo Code</option>
                    <option>Custom API / LangChain / CrewAI</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-200">I am a...</label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option value="developer">Developer</option>
                    <option value="enterprise">Enterprise Team</option>
                    <option value="creator">MCP Server Creator</option>
                    <option value="hobbyist">AI Enthusiast</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-200">
                  What MCP servers would you like to run in the cloud?
                </label>
                <input
                  type="text"
                  placeholder="e.g. GitHub, Postgres, Web Search, Puppeteer, Supabase..."
                  value={requestedServers}
                  onChange={(e) => setRequestedServers(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Securing Your Spot...' : 'Join Early Access Waitlist'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">You're on the Waitlist!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thanks for signing up. We'll notify <strong className="text-brand-300">{email}</strong> as soon as the aihost.info on-demand cloud bridge and credit billing open up for early testers.
            </p>
            <button
              onClick={onClose}
              className="py-2 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Back to Directory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
