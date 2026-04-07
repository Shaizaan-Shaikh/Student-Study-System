import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { LogIn, UserPlus } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useFirebase();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      register(name, email);
    } else {
      login(email);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-black text-primary tracking-tight mb-2">CODE-TRACK</h1>
          <p className="text-slate-500 text-sm">{isRegister ? "Join the elite coding community" : "Welcome back, Architect"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="architect@example.com"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-500 hover:text-primary transition-colors"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register Now"}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-outline-variant/10">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest text-center mb-4">Demo Accounts</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['shaizaanshaikh2006@gmail.com', 'null@example.com', 'beast@example.com'].map(demo => (
              <button 
                key={demo}
                onClick={() => { setEmail(demo); setIsRegister(false); }}
                className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] text-slate-400 hover:text-primary transition-colors"
              >
                {demo.split('@')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
