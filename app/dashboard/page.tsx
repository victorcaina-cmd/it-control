'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/login';
      else setUser(data.user);
    });
  }, []);

  if (!user) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-800 text-white p-4 flex justify-between">
        <span className="font-bold">IT CONTROL - Piloto 1.0</span>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}>Sair</button>
      </nav>
      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6">Painel de Controle</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 font-semibold">Estações Piloto</h3>
            <p className="text-4xl font-bold text-blue-600">3</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 font-semibold">ITs Ativas</h3>
            <p className="text-4xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 font-semibold">Pendências</h3>
            <p className="text-4xl font-bold text-red-600">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
