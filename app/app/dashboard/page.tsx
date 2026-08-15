-- 1. Inserir Linha (Se não existir)
INSERT INTO public.linhas (codigo, nome) 
VALUES ('L1', 'Linha de Montagem 01')
ON CONFLICT (codigo) DO NOTHING;

-- 2. Inserir Área (Se não existir)
INSERT INTO public.areas (linha_id, nome) 
SELECT id, 'Trim Shop' FROM public.linhas WHERE codigo = 'L1'
AND NOT EXISTS (SELECT 1 FROM public.areas WHERE nome = 'Trim Shop');

-- 3. Inserir Modelos (Se não existirem)
INSERT INTO public.modelos_veiculo (codigo, nome, versao) 
VALUES ('X5', 'SUV Médio X5', '2026')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.modelos_veiculo (codigo, nome, versao) 
VALUES ('X7', 'SUV Premium X7', '2026')
ON CONFLICT (codigo) DO NOTHING;

-- 4. Inserir Estações (Se não existirem)
INSERT INTO public.estacoes (codigo, nome, area_id)
SELECT 'T19', 'Instalação de Painel', id FROM public.areas WHERE nome = 'Trim Shop'
AND NOT EXISTS (SELECT 1 FROM public.estacoes WHERE codigo = 'T19');

INSERT INTO public.estacoes (codigo, nome, area_id)
SELECT 'T20', 'Montagem de Coluna', id FROM public.areas WHERE nome = 'Trim Shop'
AND NOT EXISTS (SELECT 1 FROM public.estacoes WHERE codigo = 'T20');

INSERT INTO public.estacoes (codigo, nome, area_id)
SELECT 'QA1', 'Inspeção Final', id FROM public.areas WHERE nome = 'Trim Shop'
AND NOT EXISTS (SELECT 1 FROM public.estacoes WHERE codigo = 'QA1');
