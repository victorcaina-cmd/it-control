'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({ estacoes: 0, its: 0 });
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // Tenta contar ITs e captura qualquer erro que o banco devolver
      const { count: cIT, error: errIT } = await supabase
        .from('instrucoes')
        .select('*', { count: 'exact', head: true });

      const { count: cEst } = await supabase
        .from('estacoes')
        .select('*', { count: 'exact', head: true });
      
      if (errIT) {
        setDbError(errIT.message);
      }

      setStats({ 
        estacoes: cEst || 0, 
        its: cIT || 0 
      });
    }
    load();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#1e293b' }}>IT CONTROL - Verificação de Dados</h1>
      
      {dbError && (
        <div style={{ padding: '15px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ef4444' }}>
          <strong>Erro detectado no Banco de Dados:</strong> {dbError}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ border: '2px solid #e2e8f0', padding: '20px', borderRadius: '15px', flex: 1 }}>
          <p style={{ color: '#64748b', margin: 0 }}>Estações (OK)</p>
          <h2 style={{ fontSize: '48px', margin: '10px 0' }}>{stats.estacoes}</h2>
        </div>
        
        <div style={{ border: '2px solid #22c55e', padding: '20px', borderRadius: '15px', flex: 1, backgroundColor: '#f0fdf4' }}>
          <p style={{ color: '#166534', margin: 0 }}>ITs Vigentes (Problema)</p>
          <h2 style={{ fontSize: '48px', margin: '10px 0', color: '#15803d' }}>{stats.its}</h2>
        </div>
      </div>

      <p style={{ marginTop: '30px', color: '#94a3b8' }}>
        Dica: Se as ITs continuarem em 0 e não houver erro acima, verifique o "Table Editor" no Supabase para ver se a tabela 'instrucoes' tem dados.
      </p>
    </div>
  );
}
