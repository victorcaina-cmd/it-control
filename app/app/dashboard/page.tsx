'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({ estacoes: 0, its: 0 });
  const [estacoes, setEstacoes] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      // Conta Estações
      const { count: cEst } = await supabase.from('estacoes').select('*', { count: 'exact', head: true });
      // Conta ITs (Sem nenhum filtro, conta tudo o que existir na tabela)
      const { count: cIT } = await supabase.from('instrucoes').select('*', { count: 'exact', head: true });
      
      setStats({ estacoes: cEst || 0, its: cIT || 0 });

      // Busca Lista
      const { data } = await supabase.from('estacoes').select('*');
      setEstacoes(data || []);
    }
    load();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#1e293b' }}>IT CONTROL - Diagnóstico</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, color: '#64748b' }}>Estações Detectadas</p>
          <h2 style={{ fontSize: '32px', margin: '10px 0' }}>{stats.estacoes}</h2>
        </div>
        <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '10px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, color: '#166534' }}>ITs na Tabela Instruções</p>
          <h2 style={{ fontSize: '32px', margin: '10px 0', color: '#15803d' }}>{stats.its}</h2>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ marginTop: 0 }}>Lista de Estações no Banco:</h3>
        {estacoes.map(e => (
          <div key={e.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{e.codigo}</strong> - {e.nome}
          </div>
        ))}
      </div>
      
      <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
        🔄 Atualizar Dados
      </button>
    </div>
  );
}
