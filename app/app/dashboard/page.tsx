'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Layout, ClipboardList, Users, Settings, LogOut, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ estacoes: 0, its: 0, pendencias: 0 });
  const [estacoes, setEstacoes] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      // Busca estatísticas reais
      const { count: countEst } = await supabase.from('estacoes').select('*', { count: 'exact' });
      const { count: countIT } = await supabase.from('instrucoes').select('*', { count: 'exact' });
      const { count: countPen } = await supabase.from('orientacoes').select('*', { count: 'exact', head: true }).eq('status', 'PENDENTE');
      
      setStats({ estacoes: countEst || 0, its: countIT || 0, pendencias: countPen || 0 });

      // Busca lista de estações
      const { data } = await supabase.from('estacoes').select('*').limit(5);
      setEstacoes(data || []);
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col">
        <div className="flex items-center gap-3 text-white mb-10">
          <div className="bg-blue-600 p-2 rounded-lg"><Settings size={20} /></div>
          <span className="font-bold text-xl tracking-tight">IT CONTROL</span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <div className="flex items-center gap-3 text-white bg-slate-800 p-3 rounded-lg cursor-pointer">
            <Layout size={18} /> Dashboard
          </div>
          <div className="flex items-center gap-3 p-3 hover:text-white transition cursor-pointer">
            <ClipboardList size={18} /> Instruções (IT)
          </div>
          <div className="flex items-center gap-3 p-3 hover:text-white transition cursor-pointer">
            <Users size={18} /> Colaboradores
          </div>
        </nav>

        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
          className="flex items-center gap-3 p-3 hover:text-red-400 transition"
        >
          <LogOut size={18} /> Sair do Sistema
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800">Painel Geral</h1>
          <p className="text-slate-500 mt-2">Visão consolidada da conformidade das estações.</p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-semibold text-sm uppercase mb-2">Estações Piloto</p>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black text-slate-800">{stats.estacoes}</h2>
              <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold">Ativas</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-semibold text-sm uppercase mb-2">ITs Vigentes</p>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black text-slate-800">{stats.its}</h2>
              <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">Publicadas</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-semibold text-sm uppercase mb-2">Pendências</p>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black text-red-600">{stats.pendencias}</h2>
              <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">Urgente</span>
            </div>
          </div>
        </div>

        {/* Listagem Estações */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Status das Estações</h3>
            <button className="text-blue-600 text-sm font-bold">Ver todas</button>
          </div>
          <div className="divide-y divide-slate-100">
            {estacoes.map((est) => (
              <div key={est.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600">
                    {est.codigo}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{est.nome}</p>
                    <p className="text-xs text-slate-400">ID: {est.id.substring(0,8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} /> Apto
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
