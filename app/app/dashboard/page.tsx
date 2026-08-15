'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Layout, ClipboardList, Users, Settings, LogOut, ChevronRight, CheckCircle, Activity, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ estacoes: 0, its: 0, pendencias: 0 });
  const [estacoes, setEstacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Busca estatísticas reais
      const { count: countEst } = await supabase.from('estacoes').select('*', { count: 'exact', head: true });
      const { count: countIT } = await supabase.from('instrucoes').select('*', { count: 'exact', head: true });
      const { count: countPen } = await supabase.from('orientacoes').select('*', { count: 'exact', head: true });
      
      setStats({ 
        estacoes: countEst || 0, 
        its: countIT || 0, 
        pendencias: countPen || 0 
      });

      // 2. Busca lista de estações para o monitoramento
      const { data: dataEst } = await supabase.from('estacoes').select('*').order('codigo');
      setEstacoes(dataEst || []);
      
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <Activity className="animate-spin text-blue-500" size={40} />
          <p className="text-lg font-medium tracking-widest uppercase">IT CONTROL - Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Fixa */}
      <aside className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col fixed h-full shadow-2xl">
        <div className="flex items-center gap-3 text-white mb-10">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <ShieldCheck size={24} />
          </div>
          <span className="font-bold text-xl tracking-tighter">IT CONTROL</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-3 text-white bg-blue-600/10 border-l-4 border-blue-600 p-3 rounded-r-lg cursor-pointer">
            <Layout size={18} /> <span className="font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-3 hover:text-white hover:bg-slate-800 transition rounded-lg cursor-pointer">
            <ClipboardList size={18} /> Instruções (IT)
          </div>
          <div className="flex items-center gap-3 p-3 hover:text-white hover:bg-slate-800 transition rounded-lg cursor-pointer">
            <Users size={18} /> Colaboradores
          </div>
        </nav>

        <div className="pt-6 border-t border-slate-800">
           <button 
             onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
             className="flex items-center gap-3 p-3 w-full text-left hover:text-red-400 transition"
           >
             <LogOut size={18} /> Sair do Sistema
           </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Painel Operacional</h1>
            <p className="text-slate-500 font-medium">Monitoramento em tempo real | Unidade Anápolis</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600 uppercase">Sistema Online</span>
          </div>
        </header>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 group hover:border-blue-500 transition-colors">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Estações Piloto</p>
            <div className="flex justify-between items-end">
              <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{stats.estacoes}</h2>
              <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter">Ativas</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 group hover:border-green-500 transition-colors">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">ITs Vigentes</p>
            <div className="flex justify-between items-end">
              <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{stats.its}</h2>
              <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter">Publicadas</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 group hover:border-orange-500 transition-colors">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Pendências</p>
            <div className="flex justify-between items-end">
              <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{stats.pendencias}</h2>
              <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter">Ciência</span>
            </div>
          </div>
        </div>

        {/* Monitoramento de Estações */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
               <h3 className="text-xl font-bold text-slate-800">Status das Estações</h3>
               <p className="text-sm text-slate-400">Clique em uma estação para detalhes</p>
            </div>
            <button className="bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition">Ver Planta Completa</button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {estacoes.map((est) => (
              <div key={est.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-600 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    {est.codigo}
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-800">{est.nome}</p>
                    <div className="flex gap-4 mt-1">
                       <span className="text-xs font-medium text-slate-400 italic">Área: Trim Shop</span>
                       <span className="text-xs font-medium text-slate-400 italic">ID: #{est.id.substring(0,8)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right hidden md:block">
                     <p className="text-xs font-bold text-slate-400 uppercase mb-1">Aptidão</p>
                     <div className="flex items-center gap-2 text-green-600 font-black">
                        <CheckCircle size={18} /> <span className="text-lg">APTO</span>
                     </div>
                  </div>
                  <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
