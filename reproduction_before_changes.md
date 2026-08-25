# Mapa final de reprodução antes de novas mudanças

## Decisão de produto e escopo

A **página de login já existente no novo preview permanece oficial**. Embora a referência autenticada use um rótulo de acesso diferente, esta divergência foi definida como decisão de produto e não deve levar à substituição automática do login atual.

O pacote `siga-semed-main(1).zip` é uma referência imutável, preservada em diretório isolado e analisada sem qualquer edição. A investigação da referência autenticada ocorreu exclusivamente em modo de leitura: não foram criados, editados, excluídos, enviados, impressos, baixados, sincronizados ou atualizados registros externos.

| Limite | Decisão confirmada |
|---|---|
| Dados | Usar apenas dados demonstrativos próprios na futura reprodução. |
| Persistência | Manter a simulação local existente; não conectar Cloudflare D1 ou banco externo. |
| Credenciais e tokens | Nunca copiar, registrar, reutilizar ou exibir. |
| Documentos e arquivos | Não importar documentos, QR codes, URLs de validação, PDF ou anexos da referência. |
| Alterações no preview | Nenhuma página operacional será redesenhada antes da autorização explícita do usuário. |

## Evidências de referência

O pacote foi executado localmente de forma isolada e a referência publicada foi observada com uma conta temporária autorizada. A versão observada no shell é a release de produção indicada pelo próprio pacote. O levantamento distingue a fonte estruturada mais simples do artefato auditável de produção mais amplo; para reprodução visual e de navegação, o shell operacional publicado é a fonte de verdade.

| Artefato | Papel no levantamento |
|---|---|
| `app/SemedControlApp.tsx` | Fonte estruturada local, com login, registros e documentos, mas de cobertura limitada. |
| `cloudflare/snapshots/production-v1.32.61/index.js` | Artefato auditável com o shell amplo, menus, módulos e fluxos publicados. |
| Referência autenticada | Confirmação visual e estrutural dos módulos, submenus, estados vazios, filtros e listas. |
| `reference_package_audit.md` | Registro contínuo das observações de auditoria sem dados reais. |

## Shell autenticado a reproduzir

Após o login, a referência apresenta um cabeçalho institucional com marca, versão, identificação do usuário e ações de alteração de senha e saída. A primeira abertura conduz a um **centro de boas-vindas**, com mensagens de contexto e o comando **Ir para o painel**. Para administradores, a referência também exibe uma área de comunicado; esse fluxo será reproduzido com dados locais e sem qualquer envio externo.

O painel utiliza uma barra lateral vertical e colorida, com módulos expansíveis de um nível. A área principal segue um padrão de título, subtítulo, indicadores em cartões, filtros contextuais e visualizações tabulares, em accordions ou por abas. As ações permanecem no contexto de cada módulo, em vez de serem deslocadas para fluxos genéricos.

## Ordem de navegação e cobertura mapeada

| Ordem | Módulo | Subáreas e fluxos preservados |
|---:|---|---|
| 1 | Início | Calendário, agenda, anotações rápidas, prazos e avisos. |
| 2 | Gestão | Minhas tarefas, Alertas, Relatórios, Anexos e Aprovações. |
| 3 | Cadastros | Escolas, Núcleos, Prédios Administrativos e Biblioteca. |
| 4 | Financeiro | Visão geral, Planejamento, Receitas, Execução, Fontes e regras e Relatórios. |
| 5 | Documentos | Indicadores, filtros, lista expansível, aprovação e ações documentais locais. |
| 6 | Contratos | Indicadores, alertas, filtros, detalhes, períodos, parcelas, baixas e termos aditivos. |
| 7 | Unidades Escolares | Cadastro e Relatórios. |
| 8 | Educa Paço | Cadastro de Núcleos e Relatórios. |
| 9 | Recursos Humanos | Cadastro de Servidores, Ficha Financeira, Holerite, Frequência e movimento e Relatórios. |
| 10 | Nutrição | Planejamento semanal e análise de saldos; Planejamento anual da alimentação. |
| 11 | Estoque | Agricultura Familiar, Industrializado, Kit do Aluno, Alimentação Escolar, Limpeza, Expediente e Relatórios. |
| 12 | Frota | Cadastro de Veículos, Abastecimento, Manutenção, Ocorrências e Relatórios. |
| 13 | Usuários | Administração de contas, estados e permissões. |

## Padrões operacionais por grupo

### Gestão, cadastros, financeiro, documentos e contratos

Gestão se comporta como uma central com abas e estados de tarefas. Cadastros e Unidades Escolares trabalham com busca, filtros, indicadores e lista/tabela. Financeiro inicia por filtros de exercício e fonte, com abas por tipo de acompanhamento. Documentos e Contratos mantêm seus accordions e detalhes contextuais, incluindo metadados, estados, períodos e histórico; na reprodução local, qualquer ação de PDF, impressão, encaminhamento ou baixa será apenas demonstrativa e não acessará conteúdo externo.

### Unidades Escolares e Educa Paço

Unidades Escolares possui cadastro e relatório com busca, filtros, indicadores e tabela. O módulo não deve expor dados reais de unidades, códigos ou matrículas. Educa Paço possui abas Núcleos e Relatórios, indicadores de distribuição, filtros de classificação/atividade/modalidade/situação e tabela de capacidade, atividades e equipe. A futura versão demonstrativa não deverá incluir contatos, endereços ou outros dados de pessoas reais.

### Recursos Humanos

Cadastro de Servidores, Ficha Financeira e Holerite apresentam cartões de situação, filtros de status e tabela paginada. Frequência e movimento é orientada por competências mensais, unidade e código de movimento, com indicadores de ciclo e estado vazio. Relatórios de RH organizam visualizações gerencial, folhas importadas e possíveis desligamentos, com filtros de pesquisa, cargo, lotação, período, completude, contato e IC. A reprodução preservará a organização do fluxo, mas usará somente registros fictícios e não incluirá CPF, telefone, e-mail, remuneração real ou fichas reais.

### Nutrição, Agricultura Familiar e Estoque

Nutrição semanal trabalha com projeções, mês, modalidade, situação e análise de saldos. O planejamento anual organiza cardápios, etapas, ano e estado do planejamento. Agricultura Familiar possui navegação interna por entidades, contratos e saldos, guias de fornecimento e entregas/faturamento. Nenhuma projeção, guia ou faturamento da referência será reutilizado.

Industrializado possui abas de materiais/movimentações e auditoria, atalhos de operação, indicadores, catálogo, histórico e uma central de relatórios por tipo de consulta. Kit do Aluno adiciona pedidos por turma, estoque/distribuição e relatórios. As categorias descentralizadas Alimentação Escolar, Limpeza e Expediente compartilham o padrão de saldos, conferências semanais e movimentações por unidade. Todos os estoques locais serão demonstrativos, sem movimentar os saldos externos observados.

### Frota e Usuários

Cadastro de Veículos oferece busca, situação, indicadores e estado vazio. Abastecimento, Manutenção e Ocorrências são formulários contextuais acompanhados de listas de registro; Relatórios de Frota usa tipo de conteúdo, veículo, situação e período. A futura simulação manterá campos e sequência do fluxo, mas nenhum evento real será registrado. Usuários permanece uma área administrativa com papel, situação e ações locais, respeitando o desenho de permissões sem copiar contas ou credenciais da referência.

## Componentes recorrentes obrigatórios

| Componente | Uso na reprodução |
|---|---|
| Cabeçalho institucional | Manter marca, versão, contexto do usuário e ações de conta. |
| Barra lateral de um nível | Preservar a ordem dos módulos e comportamento expansível. |
| Centro de boas-vindas | Mostrar mensagens locais e transição explícita para o painel. |
| Cartões de indicador | Usar valores demonstrativos agregados ou estado zero coerente. |
| Faixa de filtros | Variar por domínio, mantendo busca, seleção e período onde observados. |
| Abas | Usar para áreas com alternância observada, sem alterar ordem funcional. |
| Tabelas, accordions e paginação | Reproduzir como estrutura navegável com dados fictícios. |
| Estados vazios | Preservar textos e ações orientadas ao próximo passo, sem ação externa. |
| Ações de escrita | Simular localmente, com confirmação adequada quando aplicável. |

## Sequência autorizável de implementação posterior

A implementação só poderá começar após autorização do usuário e deverá ocorrer em grupos, sem alterar os itens, campos ou ordem observados:

1. **Shell, boas-vindas e Início**, com a barra lateral oficial e sem substituir a página de login atual.
2. **Gestão e Cadastros**, mantendo grupos e navegação contextual.
3. **Financeiro, Documentos e Contratos**, preservando abas, filtros, accordions e fluxos locais existentes.
4. **Unidades Escolares, Educa Paço e Recursos Humanos**, com dados demonstrativos próprios e proteção contra exposição de dados pessoais.
5. **Nutrição, Estoque, Frota e Usuários**, por módulos, com persistência local compatível.

> **Conclusão de auditoria:** o novo preview não deve ser interpretado como o shell final da nova referência. O mapa acima é a base obrigatória para a próxima fase de reprodução, preservando a página de login atual e mantendo todas as informações externas fora do novo sistema.

## Limites da observação

O levantamento reproduz a ordem de navegação, componentes, campos visíveis, filtros, estados vazios e fluxos de leitura necessários para a futura interface local. Ações que poderiam mudar o ambiente externo — incluindo criar, editar, excluir, aprovar, registrar baixa, sincronizar, imprimir, gerar PDF, baixar, faturar ou enviar comunicação — foram deliberadamente identificadas sem serem executadas. Assim, a implementação posterior deverá manter a mesma sequência visual e funcional, porém sempre com dados demonstrativos e efeitos exclusivamente locais.
