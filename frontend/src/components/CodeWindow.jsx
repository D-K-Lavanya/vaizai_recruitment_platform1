import { useState, useEffect } from 'react';

export default function CodeWindow({ assessment, onSubmit }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(assessment?.timeLimit || 1800);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const languages = [
    { id: 'javascript', name: 'JavaScript', ext: 'js', template: 'function solution(n) {\n  // JS Logic\n  return n;\n}' },
    { id: 'typescript', name: 'TypeScript', ext: 'ts', template: 'function solution(n: any): any {\n  // TS Logic\n  return n;\n}' },
    { id: 'python', name: 'Python', ext: 'py', template: 'def solution(n):\n    # Python Logic\n    return n' },
    { id: 'java', name: 'Java', ext: 'java', template: 'public class Solution {\n    public Object solution(Object n) {\n        return n;\n    }\n}' },
    { id: 'cpp', name: 'C++', ext: 'cpp', template: 'int solution(int n) {\n    return n;\n}' },
    { id: 'c', name: 'C', ext: 'c', template: 'int solution(int n) {\n    return n;\n}' },
    { id: 'csharp', name: 'C#', ext: 'cs', template: 'public class Solution {\n    public object Solve(object n) {\n        return n;\n    }\n}' },
    { id: 'go', name: 'Go', ext: 'go', template: 'func solution(n interface{}) interface{} {\n    return n\n}' },
    { id: 'rust', name: 'Rust', ext: 'rs', template: 'fn solution(n: i32) -> i32 {\n    n\n}' },
    { id: 'ruby', name: 'Ruby', ext: 'rb', template: 'def solution(n)\n    n\nend' },
    { id: 'php', name: 'PHP', ext: 'php', template: '<?php\nfunction solution($n) {\n    return $n;\n}' },
    { id: 'swift', name: 'Swift', ext: 'swift', template: 'func solution(n: Any) -> Any {\n    return n\n}' },
    { id: 'kotlin', name: 'Kotlin', ext: 'kt', template: 'fun solution(n: Any): Any {\n    return n\n}' },
    { id: 'sql', name: 'SQL', ext: 'sql', template: 'SELECT * FROM candidates WHERE score > 90;' },
    { id: 'r', name: 'R', ext: 'r', template: 'solution <- function(n) {\n  return(n)\n}' },
    { id: 'scala', name: 'Scala', ext: 'scala', template: 'def solution(n: Any): Any = {\n    n\n}' },
    { id: 'perl', name: 'Perl', ext: 'pl', template: 'sub solution {\n    my ($n) = @_;\n    return $n;\n}' },
    { id: 'haskell', name: 'Haskell', ext: 'hs', template: 'solution :: a -> a\nsolution n = n' },
    { id: 'lua', name: 'Lua', ext: 'lua', template: 'function solution(n)\n    return n\nend' },
    { id: 'dart', name: 'Dart', ext: 'dart', template: 'dynamic solution(dynamic n) {\n    return n;\n}' }
  ];

  useEffect(() => {
    const currentLang = languages.find(l => l.id === language);
    setCode(assessment?.starterCode?.[language] || currentLang.template);
  }, [language, assessment]);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert('Time is up! Auto-submitting.');
      onSubmit(code);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runTests = () => {
    setIsRunning(true);
    setTerminalOutput(['[SYSTEM] Initializing Sandbox...', `[SYSTEM] Language: ${language.toUpperCase()}`]);
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, '✓ Compilation Successful', '✓ All Test Cases Passed', '[SUMMARY] Score: 100%']);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[800px] w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3 ml-4">
             Assessment <span className="text-emerald-400">Environment</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-[10px] font-black text-emerald-400 uppercase outline-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg">
            <span className="text-[10px] font-black text-red-400 tabular-nums">⏱ {formatTime(timeLeft)}</span>
          </div>
          <button onClick={runTests} disabled={isRunning} className="px-6 py-2 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl hover:bg-emerald-400 transition-all">
            {isRunning ? 'RUNNING...' : 'RUN TESTS'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem */}
        <div className="w-[35%] border-r border-slate-800 p-8 overflow-y-auto text-left">
          <h3 className="text-2xl font-black text-white mb-6">{assessment?.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">{assessment?.description}</p>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Constraints</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Time limit: 2000ms</li>
              <li>• Memory: 256MB</li>
            </ul>
          </div>
        </div>

        {/* Right: Code */}
        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="h-10 border-b border-slate-800 flex items-center px-6 bg-slate-900/20">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Source: solution.{languages.find(l => l.id === language)?.ext}
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent p-6 text-slate-300 font-mono text-sm focus:outline-none resize-none"
          />
          <div className="h-1/3 border-t border-slate-800 p-6 bg-slate-900/50 text-left">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Terminal Output</p>
            <div className="font-mono text-xs space-y-1">
              {terminalOutput.map((line, i) => (
                <div key={i} className="text-slate-400">{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-12 bg-slate-950 border-t border-slate-800 px-8 flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-600 uppercase">System Ready</span>
        <button onClick={() => onSubmit(code)} className="text-[10px] font-black text-emerald-400 hover:text-white uppercase tracking-widest">
          Submit Final Solution →
        </button>
      </div>
    </div>
  );
}
