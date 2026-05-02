import { useState } from 'react';
import { TerminalUI } from './components/TerminalUI';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, ShieldCheck, Smartphone, X, ChevronRight, Download } from 'lucide-react';

export default function App() {
  const [showInstaller, setShowInstaller] = useState(false);

  return (
    <div id="app-root" className="w-full h-screen bg-[#020617] text-cyan-50 font-mono overflow-hidden flex flex-col tracking-tight selection:bg-cyan-500 selection:text-black">
      {/* HUD Bar */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-cyan-900/50 bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-cyan-400 animate-pulse" />
            <h1 className="text-sm font-bold tracking-[0.2em] text-cyan-400 uppercase">
              AETHER-X <span className="text-xs font-normal opacity-40">APEX_CLI v2.2.0</span>
            </h1>
          </div>
          <div className="h-4 w-[1px] bg-cyan-900/50" />
          <div className="flex gap-4 text-[10px] text-cyan-700 uppercase">
            <span>Uplink: SSL_ACTIVE</span>
            <span>Kernel: X-AGENT_V3</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowInstaller(true)}
            className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all font-bold"
          >
            <Download size={12} />
            TERMUX_INSTALL
          </button>
          <div className="px-3 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded text-[10px] text-cyan-400 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             AGENT_READY
          </div>
        </div>
      </header>

      {/* Terminal Core */}
      <main className="flex-1 overflow-hidden relative">
        <TerminalUI />
        
        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </main>

      {/* Footer Status */}
      <footer className="px-6 py-2 border-t border-cyan-900/50 bg-black/40 flex justify-between items-center text-[10px] text-cyan-900 font-bold uppercase tracking-widest">
         <div className="flex gap-6">
            <span className="flex items-center gap-1"><ShieldCheck size={10}/> SECURE_SHELL</span>
            <span className="flex items-center gap-1"><Terminal size={10}/> ROOT_SIM</span>
         </div>
         <div className="flex items-center gap-4">
            <span>TABLET_OPTIM_V2</span>
            <div className="flex gap-1">
               <div className="w-2 h-1 bg-cyan-900" />
               <div className="w-2 h-1 bg-cyan-700" />
               <div className="w-2 h-1 bg-cyan-500" />
            </div>
         </div>
      </footer>

      {/* Multi-Hour Thought Process Installer */}
      <AnimatePresence>
        {showInstaller && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-[#020617] border border-cyan-500/30 rounded-lg p-10 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative"
            >
              <button 
                onClick={() => setShowInstaller(false)}
                className="absolute right-8 top-8 text-cyan-900 hover:text-cyan-400 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <Smartphone className="text-cyan-400" size={40} />
                <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Apex Termux Deployment</h2>
              </div>

              <div className="space-y-6 text-sm text-cyan-100/70 font-mono">
                <p className="text-cyan-400/50 leading-relaxed italic border-l-2 border-cyan-500/30 pl-4 mb-8">
                   "AETHER-X is optimized for the ARM64 architecture of modern tablets. Follow these instructions precisely to host the apex intelligence locally."
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="text-cyan-500 font-bold">[01]</span>
                    <div>
                        <p className="text-white mb-2">Prepare Environment</p>
                        <code className="block bg-black p-3 border border-cyan-900 rounded text-cyan-400">
                          pkg update && pkg upgrade<br/>
                          pkg install nodejs git
                        </code>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-cyan-500 font-bold">[02]</span>
                    <div>
                        <p className="text-white mb-2">Initialize Core</p>
                        <code className="block bg-black p-3 border border-cyan-900 rounded text-cyan-400">
                          mkdir aether && cd aether<br/>
                          npm init -y && npm i @google/generative-ai
                        </code>
                    </div>
                  </div>

                      <div className="flex gap-4">
                    <span className="text-cyan-500 font-bold">[03]</span>
                    <div>
                        <p className="text-white mb-2">Deploy Script</p>
                        <p className="text-[11px] mb-2 opacity-50 italic">// Create 'aether.js' and paste the provided core logic. v3.1 supports /models command.</p>
                        <code className="block bg-black p-3 border border-cyan-900 rounded text-cyan-400 text-xs">
                          nano aether.js
                        </code>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-cyan-500 font-bold">[04]</span>
                    <div>
                        <p className="text-white mb-2">Execution Phase</p>
                        <p className="text-[11px] mb-2 opacity-50 italic">// Inject your API key and engage the agentic engine.</p>
                        <code className="block bg-black p-3 border border-cyan-900 rounded text-cyan-400 text-xs">
                          export GEMINI_API_KEY="your_key_here"<br/>
                          node aether.js
                        </code>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstaller(false)}
                className="w-full mt-10 py-4 bg-cyan-600 text-black font-bold hover:bg-cyan-400 transition-all uppercase tracking-[0.3em] text-xs"
              >
                Deployment Sequence Acknowledged
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
