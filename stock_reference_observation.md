# Observação estrutural — Estoque

## Fonte e limite de observação

O módulo foi consultado exclusivamente em modo leitura na referência autenticada em `https://siga.sigasemed.workers.dev/`. Nenhum produto, movimento, pedido, conferência, auditoria, relatório, exportação ou sincronização foi acionado. Este documento preserva apenas a estrutura observável e exclui nomes de escolas, produtos, códigos, referências, valores, quantidades e demais dados operacionais reais.

## Navegação do módulo

O grupo **Estoque** expande as categorias Agricultura Familiar, Industrializado, Kit do Aluno, Estoque Alimentação Escolar, Estoque Material de Limpeza, Estoque Material de Expediente e Relatórios.

| Área | Estrutura observada | Limite para reprodução local |
|---|---|---|
| Industrializado | Abas **Materiais e movimentações** e **Auditoria do estoque**. | Catálogo, saldo, movimentos e conferências devem usar somente dados locais. |
| Kit do Aluno | Abas **Pedidos por turma**, **Estoque e distribuição** e **Relatórios**. | Pedido por turma, itens e distribuição serão simulados localmente. |
| Categorias escolares | Alimentação Escolar, Limpeza e Expediente compartilham o padrão de saldo por unidade, conferências e movimentações. | A reprodução deve reutilizar uma estrutura comum parametrizada por categoria. |
| Agricultura Familiar | Área própria de entidades, contratos, saldos, guias e entregas/faturamento, já mapeada na auditoria anterior. | Será integrada ao domínio de estoque sem acessar contratos ou guias externos. |
| Relatórios | Central de consultas por categoria e período. | CSV/impressão devem gerar apenas conteúdo demonstrativo local. |

## Industrializado

Na aba **Materiais e movimentações**, há ações contextuais de novo produto, registro de movimentação, relatório de custos, relatório por categoria e exportação CSV. Os indicadores cobrem materiais cadastrados, unidades em estoque, estoque baixo e sem saldo. A faixa de filtros tem busca textual por código/material/categoria e seleção de situação: todos, com saldo, estoque baixo, sem saldo ou inativo.

O catálogo é apresentado como tabela com identificação, material, categoria, localização, estoque mínimo, saldo, situação e ações. Abaixo, há um histórico de movimentações com data, tipo de entrada/saída, material, quantidade, origem/destino e referência. A futura versão local deve registrar o efeito de cada movimento sobre o saldo e manter trilha de auditoria; ela não deve copiar linhas ou valores da referência.

Na aba **Auditoria do estoque**, a referência mostra um fluxo de conferência física, uma ação para iniciar auditoria e uma seção de conferências realizadas. O estado vazio orienta que nenhuma auditoria foi registrada. A reprodução local deve permitir contagem, comparação entre contado e saldo registrado, status de divergência e encerramento simulado da conferência.

## Kit do Aluno

O módulo inicia com um resumo de pedidos do ano, alunos contemplados, itens em andamento e recebidos. A aba **Pedidos por turma** tem ação de novo pedido, filtros por unidade escolar, ano letivo e busca de turma/escola/código/item, além de atualização da consulta. O estado vazio orienta a criação do primeiro pedido.

As abas **Estoque e distribuição** e **Relatórios** devem preservar a sequência funcional: catálogo de itens de kit, recebimento/saldo, pedidos por turma, distribuição/recebimento e relatórios filtráveis. Na simulação local, unidade e turma serão identificadores demonstrativos, sem dados reais de estudantes ou escolas.

## Estoque descentralizado por categoria

O Estoque Alimentação Escolar confirma o padrão das categorias descentralizadas. Há ações de sincronização de guias e nova conferência, indicadores agregados de escolas com estoque, produtos monitorados, unidades em saldo e pendências de gestão, além das abas **Saldos atuais**, **Conferências semanais** e **Movimentações**. A consulta utiliza unidade escolar, busca por produto/categoria/guia e filtro de categoria. A tabela de saldos relaciona unidade, produto, categoria, origem, unidade de medida, saldo e última atualização.

As categorias Limpeza e Expediente devem reutilizar este mesmo fluxo parametrizado, substituindo somente a categoria e o catálogo demonstrativo. A ação de sincronização será simulada localmente como conciliação de guias, jamais conectada à referência ou a qualquer banco externo.

## Central de relatórios

A central de Relatórios do Estoque Industrializado oferece consultas de produtos cadastrados, posição de estoque, consolidação por categoria, estoque valorizado, entradas por data, saídas por data, movimentações, estoque crítico, lotes/validades e fornecedores/destinos. As consultas compartilham busca, categoria, situação de saldo, atividade/cadastro, período, limpeza de filtros e paginação. Indicadores da visão selecionada resumem registros, atividade, categorias e disponibilidade de código de barras.

CSV e impressão aparecem como ações de saída no cabeçalho da central. No preview, devem operar exclusivamente sobre a base demonstrativa local, respeitar os filtros ativos e não acessar resultados, listas ou arquivos da referência.

## Agricultura Familiar no contexto de Estoque

Agricultura Familiar reúne as áreas **Entidades**, **Contratos e saldos**, **Guias de fornecimento** e **Entregas e faturamento**, precedidas por indicadores agregados de contrato, saldo, guias pendentes e faturamento. Sua tabela inicial é orientada a entidades habilitadas e ações contextuais. Na reprodução, essa relação deverá ser mantida por registros demonstrativos e pelos mesmos estados de atividade, sem copiar pessoas, documentos, dados de contato, valores, contratos, entregas ou faturamentos da referência.

O Estoque Material de Limpeza confirma o mesmo componente descentralizado da Alimentação Escolar, inclusive ações de conciliação de guias e nova conferência, cartões de resumo, abas de saldos/conferências/movimentações e filtros por unidade, texto e categoria. A referência também apresenta o estado vazio quando não há saldos para os filtros; o preview deverá reproduzir esse estado com registros demonstrativos, sem dados de unidades reais.

O Estoque Material de Expediente repete integralmente o padrão descentralizado de Limpeza, variando apenas a finalidade declarada da categoria. Assim, as três áreas descentralizadas serão implementadas por um único mecanismo local de categoria, guia, saldo, conferência e movimentação, com rótulos e itens demonstrativos próprios.
