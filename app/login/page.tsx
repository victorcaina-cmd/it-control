'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Erro: ' + error.message);
    else window.location.href = '/dashboard';
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">IT CONTROL</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="E-mail" className="w-full p-3 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" className="w-full p-3 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
