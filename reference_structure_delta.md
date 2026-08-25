# Ajuste de estrutura visual — SIGA SEMED

## Fonte de verdade

Este documento compara a composição real de `SemedControlApp.tsx` e `app/globals.css` do pacote de referência, tratado exclusivamente como leitura, com o shell atual do novo projeto. A finalidade é corrigir **geografia e agrupamento**, sem alterar campos, regras ou a simulação local.

| Área | Referência funcional | Preview atual | Ajuste obrigatório |
|---|---|---|---|
| Cabeçalho | Painel centralizado: marca e descrição; ações agrupadas abaixo | Cabeçalho horizontal com marca à esquerda e ações à direita | Reorganizar em painel vertical e centralizado, preservando os mesmos comandos. |
| Resumo | Cinco cartões com acento no topo | Cinco cartões com acento lateral | Aplicar cartões com acento superior e ritmo do original. |
| Módulos | Duas abas horizontais abaixo do resumo | Duas abas horizontais abaixo do resumo | Preservar posição; alinhar alturas, espaçamento e rótulos. |
| Cadastro e relatório | Uma coluna: cartão expansível de cadastro em largura total, seguido do relatório | Grade em duas colunas: cadastro lateral e lista ao lado | Remover a barra lateral e colocar cadastro acima do relatório. |
| Registros | Cabeçalho “Acompanhamento / Relatório e alertas”, faixa de alertas, filtros e acordions | Cabeçalho “Registros / Contratos e processos”, filtros e linhas enriquecidas | Restaurar a faixa de alertas e a ordem cabeçalho → alertas → filtros → accordions. |
| Acordion de registro | Resumo compacto prioriza o número; os dados ficam no detalhe | Resumo mistura tipo, número, objeto e selo | Priorizar número no resumo e mover os dados para o detalhe. |
| Documentos | Cadastro expansível acima de painel com KPIs documentais, alertas, filtros e lista | Usa a mesma grade lateral de registros | Aplicar a mesma sequência vertical da referência, com KPIs e alertas próprios. |

## Sequência visual que será reproduzida

1. Cabeçalho institucional centralizado.
2. Resumo com cinco indicadores.
3. Abas de Contratos e Processos / Documentos.
4. Cadastro expansível em largura total.
5. Painel de acompanhamento com alertas, filtros e lista expansível.

Os comandos, os campos da simulação local, o fluxo de Primeiro acesso, as regras de alteração de senha, a confirmação `EXCLUIR`, baixas e exportação permanecem inalterados.
