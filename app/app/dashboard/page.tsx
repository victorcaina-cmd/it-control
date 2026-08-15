'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Layout, ClipboardList, Users, Settings, LogOut, ChevronRight, CheckCircle, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ estacoes: 0, its: 0, pendencias: 0 });
  const [estacoes, setEstacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
const { count: countEst } = await supabase.from('estacoes').select('*', { count: 'exact', head: true });
const { count: countIT } = await supabase.from('instrucoes').select('*', { count: 'exact', head: true });
const { count: countPen } = await supabase.from('orientacoes').select('*', { count: 'exact', head: true }).eq('status', 'PENDENTE');
      
      setStats({ estacoes: countEst || 0, its: countIT || 0, pendencias: countPen || 0 });

      const { data } = await supabase.from('estacoes').select('*').order('codigo');
      setEstacoes(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">Iniciando IT CONTROL...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 text-white mb-10">
          <div className="bg-blue-600 p-2 rounded-lg"><Activity size={20} /></div>
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
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Painel de Controle</h1>
            <p className="text-slate-500 mt-1">Status da planta em tempo real.</p>
          </div>
          <div className="text-right">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unidade</span>
             <p className="font-bold text-slate-700 text-sm">Anápolis - GO</p>
          </div>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-bold text-xs uppercase mb-2">Estações Piloto</p>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black text-slate-800">{stats.estacoes}</h2>
              <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold italic">Online</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-bold text-xs uppercase mb-2">ITs Vigentes</p>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black text-slate-800">{stats.its}</h2>
              <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold italic">Publicadas</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-500 font-bold text-xs uppercase mb-2">Pendências</p>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black text-red-600">{stats.pendencias}</h2>
              <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold italic">Urgente</span>
            </div>
          </div>
        </div>

        {/* Listagem Estações */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Monitoramento por Estação</h3>
            <span className="text-xs font-medium text-slate-400">Total: {estacoes.length}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {estacoes.map((est) => (
              <div key={est.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600 text-lg">
                    {est.codigo}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{est.nome}</p>
                    <p className="text-[10px] text-slate-400 font-mono">UUID: {est.id.substring(0,18)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle size={14} /> Apto
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
