import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { computeAgenticResponse } from '../lib/gemini';

export function TerminalUI() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const currentLine = useRef('');
  const history = useRef<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#020617',
        foreground: '#22d3ee',
        cursor: '#22d3ee',
        selectionBackground: 'rgba(34, 211, 238, 0.3)',
      },
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      letterSpacing: 1,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    // Defer fitting to ensure DOM dimensions are ready
    const timer = setTimeout(() => {
      try {
        fitAddon.fit();
      } catch (e) {
        console.warn("Terminal fit failed:", e);
      }
    }, 100);

    xtermRef.current = term;

    term.writeln('\x1b[1;36m[AETHER-X INITIALIZING...]\x1b[0m');
    term.writeln('\x1b[1;32m[UPLINK ESTABLISHED]\x1b[0m');
    term.writeln('');
    term.writeln('Welcome to \x1b[1;36mAETHER-X apex-agentic CLI\x1b[0m.');
    term.writeln('System primed for Termux optimization.');
    term.writeln('Type your command or query below.');
    term.writeln('');
    term.write('\x1b[1;36muser@aether-x:~$\x1b[0m ');

    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.keyCode === 13) { // Enter
        const query = currentLine.current.trim();
        term.writeln('');
        
        if (query) {
          handleCommand(query);
        } else {
          prompt();
        }
        currentLine.current = '';
      } else if (domEvent.keyCode === 8) { // Backspace
        if (currentLine.current.length > 0) {
          currentLine.current = currentLine.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (printable) {
        currentLine.current += key;
        term.write(key);
      }
    });

    const handleCommand = async (query: string) => {
      term.writeln('\x1b[1;33m[THINKING...]\x1b[0m');
      
      const response = await computeAgenticResponse(query, history.current);
      
      // Update local history
      history.current.push({ role: 'user', parts: [{ text: query }] });
      history.current.push({ role: 'model', parts: [{ text: response }] });

      // Clean response for terminal output (handle line breaks)
      const lines = response.split('\n');
      lines.forEach(line => term.writeln(line));
      
      prompt();
    };

    const prompt = () => {
      term.write('\r\n\x1b[1;36muser@aether-x:~$\x1b[0m ');
    };

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (e) {
        // Ignore resize errors if terminal is detached
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#020617] p-4">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
}
