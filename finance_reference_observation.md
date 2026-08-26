# Observação da referência — Financeiro ampliado

## Limites obrigatórios de coleta

Esta frente será observada exclusivamente em modo leitura na referência externa. A coleta registrará somente navegação, títulos, campos, filtros, indicadores, estados e sequência operacional. É proibido criar, editar, confirmar, excluir, imprimir, exportar, baixar, enviar ou sincronizar qualquer dado externo.

Não serão copiados valores, fontes de recursos, processos, documentos, identificadores, credenciais, tokens, contatos, contas ou quaisquer dados reais. A reprodução usará exclusivamente dados demonstrativos persistidos no `localStorage`, sem Cloudflare D1 ou outro banco externo.

## Escopo inicial

| Frente | Situação |
|---|---|
| Navegação e submódulos | Pendente de observação segura. |
| Orçamento e planejamento | Pendente de observação segura. |
| Receitas, fontes e execução | Pendente de observação segura. |
| Relatórios e filtros | Pendente de observação segura. |
| Perfis e permissões aparentes | Pendente de observação segura. |

> A aparência oficial do preview permanece imutável por padrão. Somente as funcionalidades comprovadas pela observação serão reproduzidas localmente.

## Navegação e visão geral confirmadas

O módulo abre com o contexto **Planejamento e execução**, título Financeiro e uma descrição de visão consolidada. A faixa superior possui filtro de **exercício**, filtro de **fonte**, atualização de consulta e ação de impressão. A navegação interna confirmada contém as seis áreas: **Visão geral**, **Planejamento**, **Receitas**, **Execução**, **Fontes e regras** e **Relatórios**.

| Elemento observado | Reprodução local prevista |
|---|---|
| Filtros globais | Exercício e fonte demonstrativos, aplicados a todos os contextos financeiros. |
| Indicadores de resumo | Planejado, receitas, empenhado, liquidado, pago e disponibilidade, sempre com valores demonstrativos. |
| Visão geral | Painel de indicadores legais, resumos de integração entre módulos e execução mensal agregada. |
| Indicadores legais | Acompanhamento de percentuais e metas de aplicação por regra, sem duplicar a execução financeira. |
| Integrações | Resumos locais para contratos, folha e agricultura familiar, sem copiar lançamentos externos. |
| Execução mensal | Comparativo de receitas e pagamentos por competência demonstrativa. |

O estado de consulta informa a atualização dos dados e preservação de lançamentos cancelados em histórico de auditoria. A implementação local deverá reproduzir essa regra apenas com registros demonstrativos e trilha local, sem chamadas externas.

## Planejamento anual confirmado

A área Planejamento apresenta uma ação de novo cadastro e uma tabela anual mensalizada. Cada linha agrupa a programação por mês, fonte, programa, descrição, natureza da despesa, valor planejado e situação. Há ações contextuais de edição e cancelamento, que não foram acionadas na referência.

| Campo estrutural | Regra para a versão local |
|---|---|
| Competência mensal | Seleção de mês demonstrativo dentro do exercício. |
| Fonte, programa e natureza | Classificações demonstrativas usadas para organizar o planejamento. |
| Descrição | Texto de finalidade demonstrativa, sem processos ou fornecedores reais. |
| Valor planejado | Valor local sujeito à validação não negativa. |
| Situação e cancelamento | Registro ativo ou cancelado; cancelados permanecem no histórico local de auditoria. |

## Receitas e repasses confirmados

A área Receitas possui ação de novo cadastro e tabela de créditos, rendimentos, saldos reprogramados e contrapartidas. A estrutura consultada contém data, fonte, componente, tipo, referência, valor, situação e ações contextuais de edição/cancelamento. A versão local deverá manter a capacidade de cadastrar e alterar apenas receitas demonstrativas, com tipos controlados e referência textual local.

## Execução da despesa confirmada

A área Execução organiza registros por data, fonte, etapa, descrição, classificação, documento, valor e situação. A instrução do contexto indica quatro estágios possíveis: **empenho**, **liquidação**, **pagamento** e **apropriação legal**. Há ação de novo cadastro e ações de edição/cancelamento por linha; nenhuma foi acionada na referência.

| Regra observada | Reprodução local prevista |
|---|---|
| Etapas de execução | Tipo fechado para empenhado, liquidado, pago e apropriação legal. |
| Documento e classificação | Referências demonstrativas locais, sem processos ou documentos externos. |
| Histórico | Cancelamentos preservam o registro para auditoria local. |
| Consolidação | Valores por etapa alimentam os indicadores da visão geral sem duplicação. |

## Fontes e regras confirmadas

A área combina cartões de fontes de recursos e uma tabela de regras do exercício. Os cartões possuem identificação da origem, tipo da fonte, dados bancários opcionais e saldo inicial. A tabela de regras possui código, nome, percentual e observação, e informa que alterações são restritas a Administrador.

| Estrutura | Reprodução local prevista |
|---|---|
| Fonte de recurso | Código, nome, categoria, dados bancários demonstrativos opcionais, saldo inicial e situação. |
| Regra do exercício | Código, nome, meta percentual, observação e exercício. |
| Administração | Somente Administrador pode criar ou alterar fontes e regras locais. |
| Indicadores legais | Cálculo comparando aplicação classificada com a meta de cada regra demonstrativa. |

## Relatórios confirmados

A área Relatórios apresenta ação de CSV, tabela consolidada por fonte e faixa de execução mensal preparada para impressão. A tabela consolida planejamento, receita, empenho, liquidação, pagamento e disponibilidade por fonte. Nenhuma exportação ou impressão foi acionada na referência.

| Saída observada | Reprodução local prevista |
|---|---|
| Consolidado por fonte | Totais locais de planejamento, receitas, etapas de despesa e disponibilidade. |
| Execução mensal | Valores demonstrativos de receita e pagamento por mês. |
| CSV | Exportação apenas dos resultados locais filtrados. |
| Impressão | Impressão da visão local, sem interação com a referência. |

## Síntese de reprodução autorizada

O Financeiro ampliado local deverá ter seis contextos funcionais, filtros globais por exercício e fonte, cadastros locais de planejamento, receitas, execução, fontes e regras, trilha de cancelamento/auditoria e relatórios agregados. Os valores serão integralmente demonstrativos e as fórmulas serão implementadas a partir de registros locais, sem inferir ou replicar lançamentos da referência.

## Evidências de validação no preview local

O Financeiro ampliado foi conferido no preview usando somente a conta demonstrativa local. A view **Financeiro** substitui o placeholder genérico e apresenta a visão consolidada, filtros por exercício e fonte, indicadores, Planejamento, Receitas, Execução, Fontes e regras e Relatórios. O formulário de Planejamento abriu com os campos estruturais observados e foi fechado sem gravação. A consolidação de Relatórios exibiu o resumo por fonte e a ação de CSV local, sem utilizar ou produzir dados da referência. A área administrativa exibiu cartões de fontes, saldos iniciais demonstrativos, regras por exercício e controles de edição para Administrador.
