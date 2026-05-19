import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Globe, Zap, Leaf, Droplets, Sun, Wind, Minimize2, Maximize2, Cpu, Shield, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'te', label: 'తెలుగు' },
];

const suggestions = [
  { text: 'How do I treat fungal disease on tomatoes?', icon: Leaf },
  { text: 'What is the best irrigation schedule for wheat?', icon: Droplets },
  { text: 'Which fertilizer is best for sandy soil?', icon: Sun },
  { text: 'How to prepare soil before monsoon season?', icon: Wind },
  { text: 'Signs of nitrogen deficiency in crops?', icon: Leaf },
  { text: 'Best organic pesticides for small farms?', icon: Zap },
  { text: 'Irrigation strategy for drought conditions?', icon: Droplets },
  { text: 'How to improve soil organic matter?', icon: Sun },
];

const responses: Record<string, string> = {
  fungal: `Fungal diseases are best treated by:

1. **Remove infected leaves** immediately to prevent spread
2. **Apply copper-based fungicide** (Bordeaux mixture) or mancozeb
3. **Improve air circulation** by pruning overcrowded branches
4. **Reduce overhead irrigation** — water at the base instead
5. **Spray in early morning** so leaves dry during the day

For tomatoes specifically, early blight responds well to chlorothalonil applied every 7-10 days. Always check disease pressure before spraying.

**Irrigation Suggestion:** Switch to drip irrigation at the base of plants to keep foliage dry and reduce fungal spread by up to 60%. Schedule watering between 6-8 AM.

*AI Confidence: 91% | Consult local KVK for severe outbreaks.*`,

  irrigation: `Optimal irrigation for wheat:

**Kharif/Rabi seasons differ:**
- **Crown root initiation** (20-25 DAS): Most critical stage — irrigate immediately
- **Tillering stage** (40-45 DAS): Second irrigation
- **Jointing** (60-65 DAS): Third irrigation
- **Heading/flowering** (80-85 DAS): Fourth irrigation
- **Grain filling** (100-105 DAS): Fifth irrigation

Use drip/sprinkler systems to reduce water by 30-40%. Schedule irrigation in early morning (6-8 AM) to minimize evaporation losses.

**Irrigation Suggestion:** Install soil moisture sensors at 15cm and 30cm depth. Trigger irrigation when volumetric water content drops below 35%. This data-driven approach saves 25-40% water compared to fixed schedules.`,

  fertilizer: `For sandy soil, here's the recommended approach:

**Sandy soil challenges:** Poor water retention, low nutrient holding capacity

**Best fertilizers:**
- **Organic compost** (5-10 tonnes/hectare) — improves water retention
- **Vermicompost** — releases nutrients slowly, perfect for sandy texture
- **Slow-release NPK (19:19:19)** — reduces leaching losses
- **Micronutrient mixtures** — sandy soils often lack zinc and boron

**Key tip:** Apply fertilizer in 2-3 split doses rather than all at once to minimize leaching. Soil testing every 2 years is strongly recommended.

**Irrigation Suggestion:** Sandy soils require frequent light irrigation (15-20mm per cycle) rather than heavy watering. Use mulch to reduce evaporation by 40%. Consider installing a fertigation system for simultaneous nutrient and water delivery.`,

  default: `I understand your farming question. Here's what I can help with:

Based on best agricultural practices, it's important to:

1. **Monitor regularly** — inspect crops every 3-5 days during growing season
2. **Keep records** — document observations for pattern analysis
3. **Test your soil** — annual soil testing reveals nutrient gaps
4. **Consult local experts** — KVK (Krishi Vigyan Kendra) centers offer free advice

The specific answer depends on your crop variety, local climate, and soil conditions. Can you share more details about your farm location or the specific crop you're growing?

*AI Advisory | Always verify with local agronomists for critical decisions.*`,
};

function getResponse(text: string, lang: string): string {
  const lower = text.toLowerCase();
  let response = responses.default;
  if (lower.includes('fungal') || lower.includes('disease') || lower.includes('blight')) response = responses.fungal;
  else if (lower.includes('irrigation') || lower.includes('water') || lower.includes('wheat') || lower.includes('drought')) response = responses.irrigation;
  else if (lower.includes('fertilizer') || lower.includes('soil') || lower.includes('sandy') || lower.includes('organic')) response = responses.fertilizer;
  if (lang === 'hi') return `[हिंदी अनुवाद] ${response}`;
  if (lang === 'te') return `[తెలుగు అనువాదం] ${response}`;
  return response;
}

function formatMessage(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**'))
      return <p key={i} className="font-semibold text-white">{line.replace(/\*\*/g, '')}</p>;
    if (line.match(/^\*\*.*\*\*/))
      return (
        <p key={i} className="text-gray-300 text-sm leading-relaxed">
          {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
            part.startsWith('**') ? <strong key={j} className="text-white font-semibold">{part.replace(/\*\*/g, '')}</strong> : part
          )}
        </p>
      );
    if (line.match(/^\d+\./))
      return <p key={i} className="text-gray-300 text-sm leading-relaxed pl-2">{line}</p>;
    if (line.startsWith('- ') || line.startsWith('* '))
      return <p key={i} className="text-gray-300 text-sm pl-2 flex items-start gap-1"><span className="text-[#05cd99] shrink-0">•</span>{line.slice(2)}</p>;
    if (line.startsWith('*') && line.endsWith('*'))
      return <p key={i} className="text-gray-500 text-xs italic">{line.replace(/\*/g, '')}</p>;
    return line ? <p key={i} className="text-gray-300 text-sm leading-relaxed">{line}</p> : <div key={i} className="h-2" />;
  });
}

export default function FarmingAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Welcome to Verdex AI — your intelligent farming companion. I provide expert guidance on crop diseases, irrigation scheduling, soil health, weather-adaptive strategies, and sustainable practices. I speak English, Hindi, and Telugu. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [lang, setLang] = useState('en');
  const [listening, setListening] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const aiResponse = getResponse(text, lang);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500 + Math.random() * 1000);
  };

  const toggleMic = () => {
    setListening(prev => !prev);
    if (!listening) {
      setTimeout(() => {
        setListening(false);
        setInput('How do I treat fungal disease on tomatoes?');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col relative">
      <div className="absolute inset-0 hex-bg pointer-events-none" />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col relative z-10" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(5,205,153,0.06)] border border-[rgba(5,205,153,0.15)] text-[#05cd99] text-sm mb-2">
              <Cpu className="w-4 h-4" /> Verdex AI Assistant
            </div>
            <h1 className="text-3xl font-bold text-white font-display">AI Farming Advisor</h1>
            <p className="text-gray-400 text-sm mt-1">Intelligent agricultural guidance in your language</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <div className="flex rounded-xl overflow-hidden border border-gray-700/50">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${
                      lang === l.code ? 'bg-[rgba(5,205,153,0.1)] text-[#05cd99]' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setMinimized(!minimized)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-[#05cd99] transition-colors">
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Capability badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { icon: Shield, label: 'Disease Diagnosis' },
            { icon: Droplets, label: 'Irrigation Planning' },
            { icon: Sun, label: 'Soil Analysis' },
            { icon: Sparkles, label: 'AI-Powered' },
          ].map(cap => {
            const Icon = cap.icon;
            return (
              <div key={cap.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800/30 border border-gray-700/30 text-gray-500 text-xs">
                <Icon className="w-3 h-3" />
                {cap.label}
              </div>
            );
          })}
        </div>

        {/* Messages */}
        {!minimized && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#05cd99] to-cyan-500 flex items-center justify-center shrink-0 mt-1 mr-3 shadow-lg shadow-[rgba(5,205,153,0.15)]">
                    <Leaf className="w-4 h-4 text-black" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed text-black font-medium">{msg.content}</p>
                  ) : (
                    <div className="space-y-1">{formatMessage(msg.content)}</div>
                  )}
                  <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-emerald-900/40' : 'text-gray-600'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-start animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#05cd99] to-cyan-500 flex items-center justify-center shrink-0 mt-1 mr-3 shadow-lg shadow-[rgba(5,205,153,0.15)]">
                  <Leaf className="w-4 h-4 text-black" />
                </div>
                <div className="chat-bubble-ai px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-2 h-2 rounded-full bg-[#05cd99] typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-[#05cd99] typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-[#05cd99] typing-dot" />
                    <span className="text-gray-500 text-xs ml-2">Verdex AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Suggestions */}
        {messages.length <= 1 && !minimized && (
          <div className="py-4">
            <p className="text-gray-500 text-xs mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 4).map(s => {
                const Icon = s.icon;
                return (
                  <button key={s.text} onClick={() => sendMessage(s.text)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800/30 border border-gray-700/40 text-gray-300 text-xs hover:border-[rgba(5,205,153,0.2)] hover:text-[#05cd99] hover:bg-[rgba(5,205,153,0.05)] transition-all">
                    <Icon className="w-3 h-3" />
                    {s.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        {!minimized && (
          <div className="pt-4 border-t border-gray-800/30">
            <div className="glass-card p-2 flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  listening ? 'bg-red-500/12 border border-red-500/25 text-red-400 animate-pulse' : 'bg-gray-800/30 text-gray-400 hover:text-[#05cd99] hover:bg-[rgba(5,205,153,0.08)]'
                }`}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder={listening ? 'Listening...' : `Ask a farming question in ${languages.find(l => l.code === lang)?.label}...`}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-600"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#05cd99] to-cyan-500 flex items-center justify-center shrink-0 disabled:opacity-25 hover:shadow-lg hover:shadow-[rgba(5,205,153,0.2)] transition-all disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">
              AI Advisory only — verify critical decisions with local agricultural experts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
