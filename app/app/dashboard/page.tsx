'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [its, setIts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Busca todas as ITs sem nenhum filtro
      const { data } = await supabase.from('instrucoes').select('codigo, titulo');
      if (data) setIts(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{padding: '40px'}}>Carregando dados...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{color: '#2563eb'}}>IT CONTROL - LISTA DE INSTRUÇÕES</h1>
      
      <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <h2>Contador de ITs: <span style={{color: '#16a34a'}}>{its.length}</span></h2>
        
        <hr />
        
        <h3>Documentos Encontrados:</h3>
        {its.length === 0 ? (
          <p style={{color: '#ef4444'}}><b>⚠️ NENHUMA IT ENCONTRADA NO BANCO DE DADOS</b></p>
        ) : (
          <ul>
            {its.map((it, index) => (
              <li key={index} style={{fontSize: '18px', marginBottom: '10px'}}>
                ✅ <b>{it.codigo}</b> - {it.titulo}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <button onClick={() => window.location.reload()} style={{marginTop: '20px', padding: '10px'}}>
        🔄 Forçar Atualização
      </button>
    </div>
  );
}
