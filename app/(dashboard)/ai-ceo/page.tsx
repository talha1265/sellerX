'use client';

import { useState } from 'react';
import { Brain, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

export default function AiCeoPage() {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello Talha. I am Atlas, your Portfolio AI CEO. I am actively monitoring your 4 e-commerce brands and algorithmic trading pipelines. How can I assist you in optimizing execution parameters today?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: `u_${Date.now()}`, role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulated responses based on keywords
    setTimeout(() => {
      let response = "I've analyzed your current request. I recommend monitoring our PPC budgets or checking options hedging configurations.";
      const query = input.toLowerCase();
      if (query.includes('reorder') || query.includes('inventory')) {
        response = 'VoltGear Outfitter is currently at critical stock level (9 days remaining). I recommend initiating an automated restock order of 1,200 units to avoid loss of Buy Box priority.';
      } else if (query.includes('hedge') || query.includes('vix') || query.includes('trading')) {
        response = 'VIX is trending at 22.4. I suggest setting up a delta-neutral put spread on ES futures contracts to protect our open S&P 500 options ledger.';
      } else if (query.includes('revenue') || query.includes('profit')) {
        response = 'AeroGlow Cosmeceuticals is outperforming margins by 18%. Let us redirect 12% of the baby niche ad budget to cosmetic lines to capture an extra $14K revenue.';
      }

      setMessages((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: 'assistant' as const, content: response },
      ]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 h-[calc(100vh-8.5rem)]">
      {/* Chat pane */}
      <div className="xl:col-span-3 border border-border bg-card rounded-2xl flex flex-col overflow-hidden h-full">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-secondary/10">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Atlas Autonomous CEO</h3>
              <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active on v2.4 Autopilot
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
              </div>
              <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-secondary/40 border border-border text-foreground rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-4 border-t border-border/50 bg-secondary/10">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask Atlas to check inventory, run scans, hedge portfolio..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-card pl-4 pr-12 text-xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-white hover:brightness-105 transition-colors cursor-pointer"
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar stats panel */}
      <div className="space-y-4">
        {/* Info panel */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Atlas Parameters</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confidence Threshold:</span>
              <span className="font-semibold">88%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Limit (Single Trade):</span>
              <span className="font-semibold">$5,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Automated Repricing:</span>
              <span className="font-semibold text-emerald-500">Enabled</span>
            </div>
          </div>
        </div>

        {/* Decisions audit */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recent Decisions Audit</h4>
          <div className="space-y-3">
            {[
              { rule: 'Adjusted bid VoltGear PPC', time: '12m ago', state: 'Applied' },
              { rule: 'Repriced AeroGlow Serum', time: '44m ago', state: 'Applied' },
              { rule: 'Initiated put spread hedge', time: '1h ago', state: 'Review Needed' },
            ].map((decision, idx) => (
              <div key={idx} className="flex items-start justify-between text-[11px] border-b border-border/20 pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-foreground">{decision.rule}</p>
                  <p className="text-[9px] text-muted-foreground">{decision.time}</p>
                </div>
                <span className={`rounded px-1 text-[9px] font-bold ${
                  decision.state === 'Applied' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600'
                }`}>{decision.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
