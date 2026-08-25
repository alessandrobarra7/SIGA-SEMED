# Auditoria do pacote de referência recebido em 25/08/2026

## Preservação

O arquivo recebido, `siga-semed-main(1).zip`, foi extraído somente para leitura em:

`/home/ubuntu/siga-semed-review/reference-upload-2026-08-25/siga-semed-main`

SHA-256 do pacote: `7d609dec1ead6ec265b239ce1cac7f7e5a5b77c970c23d0ffd78d488c74ce4fc`.

Nenhum arquivo desse diretório será alterado. A página de login do novo preview continua oficial, conforme definido pelo usuário.

## Primeira execução isolada

O pacote foi instalado com `pnpm install --frozen-lockfile` e iniciado localmente em `http://localhost:3001/`. A página raiz servida pela fonte estruturada abre o login de Usuário e Senha. O ponto de entrada é `app/page.tsx`, que monta `SemedControlApp.tsx`.

## Estrutura encontrada

| Área | Papel identificado |
|---|---|
| `app/`, `db/`, `drizzle/` | Fonte estruturada em evolução, incluindo o aplicativo de acesso, contratos/processos e documentos. |
| `worker/` | Entrada Cloudflare que serve a aplicação Vinext. |
| `work/cloudflare-standalone/` | Histórico técnico de construtores e operações do Worker. |
| `cloudflare/snapshots/` | Artefatos auditáveis das releases de produção e homologação. |
| `work/releases/release-manifest.json` | Registro de que a produção está em `v1.32.61` e a homologação em `v1.32.68-hml`. |

## Observação importante

O README e o artefato auditável mostram um sistema mais amplo do que o componente raiz atual: além de contratos e documentos, há módulos relacionados a unidades escolares, recursos humanos, nutrição, estoques, frota e relatórios. A próxima etapa é mapear a interface de cada módulo a partir da release auditável e da fonte disponível, antes de alterar qualquer área operacional do preview.

## Mapa operacional identificado na release auditável

O manifesto aponta a produção `v1.32.61`; seu artefato auditável contém um shell mais amplo que a entrada `SemedControlApp.tsx` servida localmente. A leitura estática de rótulos, menus e testes do pacote identificou as áreas abaixo.

| Área principal | Subáreas ou fluxos observados |
|---|---|
| Início | Painel inicial, avisos pessoais e atalhos por permissão. |
| Gestão | Usuários, grupos, permissões, auditoria e cadastros mestres. |
| Contratos e documentos | Contratos, processos, controle documental, financeiro do contrato, fichas e relatórios. |
| Educa Paço | Unidades escolares, cadastro de núcleos, mapa da unidade, dados da escola, censo escolar, Unidade Executora, lotação de servidores, estrutura física e relatórios. |
| Recursos Humanos | Cadastro de servidores, documento funcional, ficha financeira, frequência e competências das unidades. |
| Nutrição | Planejamento, alimentação escolar, agricultura familiar, contratos, guias e análise de estoque. |
| Estoque | Industrializado, alimentação escolar, limpeza, expediente, pedidos por turma, distribuição, auditoria e relatórios. |
| Frota | Veículos, abastecimento, manutenção, ocorrências e relatórios. |
| Financeiro e relatórios | Financeiro, resumo financeiro, central de relatórios e relatórios de unidades. |

O próximo passo de reprodução visual exige autenticação em uma sessão de referência autorizada. As senhas do pacote continuam inacessíveis: apenas hashes e sais foram encontrados, que não serão usados para tentar descobrir credenciais.

## Observação do ambiente informado

O endereço informado pelo usuário, `https://siga.sigasemed.workers.dev/`, expôs o shell completo com contadores zerados e a sequência dos módulos operacionais, confirmando que a release auditável representa um sistema bem mais amplo que o preview atual. A navegação autenticada, os menus por perfil, os cadastros, os detalhes e os fluxos de edição ainda serão observados somente com uma conta temporária fornecida pelo usuário. Nenhum dado foi criado, editado ou excluído nesse ambiente.

## Sessão de referência observada

Com a conta temporária fornecida pelo usuário, a referência abriu na versão `v1.32.61`, identificando um perfil **Administrador**. O shell possui uma barra de navegação horizontal com as entradas Início, Gestão, Cadastros, Financeiro, Documentos, Contratos, Unidades Escolares, Educa Paço, Recursos Humanos, Nutrição, Estoque, Frota e Usuários. Os itens com seta abrem submenus.

A primeira tela autenticada é um centro de boas-vindas, não o painel geral. Ela agrupa mensagens/comunicados à esquerda e, para administrador, um formulário de envio à direita. O formulário inclui destinatário, assunto, mensagem, prioridade e data de expiração; o botão **Ir para o painel** encerra esse estado inicial. Esse fluxo será reproduzido apenas na próxima etapa, após mapear as telas restantes. Durante a observação, nenhum comunicado foi enviado e nenhum dado externo foi modificado.

Depois de encerrar a boas-vindas, a referência mostra um **cabeçalho horizontal** e uma **barra lateral fixa** colorida à esquerda. A ordem visual do menu lateral é Início, Gestão, Cadastros, Financeiro, Documentos, Contratos, Unidades Escolares, Educa Paço, Recursos Humanos, Nutrição, Estoque, Frota e Usuários. A área central não carregou conteúdo após a transição no navegador de observação; essa falha será investigada apenas para concluir o mapa visual, sem realizar nenhuma escrita no sistema de referência.

A aba **Início** carrega uma visão geral com calendário mensal, contadores de hoje/próximos sete dias/concluídos, agenda do dia, anotações rápidas e lista de avisos de prazos. A aba **Gestão** abre a Central de Gestão em painel único, com botão de atualização e cinco abas: Minhas tarefas, Alertas, Relatórios, Anexos e Aprovações. A primeira aba mostra indicadores resumidos e um estado vazio contextual. Nenhum botão de atualização foi acionado.

A aba **Cadastros** é o Cadastro Geral: botão Novo cadastro, indicadores de ativos/escolas/total, quatro grupos (Escolas, Núcleos, Prédios Administrativos e Biblioteca), busca e filtros por tipo e situação. A aba **Financeiro** inicia com filtros de exercício e fonte, ações de atualizar/imprimir e as abas Visão geral, Planejamento, Receitas, Execução, Fontes e regras e Relatórios. Nenhum formulário, atualização ou impressão foi executado.

Em **Documentos**, a referência apresenta botão Novo documento, cinco indicadores (documentos, em aberto, a vencer, atrasados e modelos), filtros de busca/tipo/situação e uma lista de accordions. Cada documento aberto mostra metadados, QR Code e validação pública, estado de aprovação e ações de encaminhar, editar, visualizar, baixar PDF e excluir. Não foi acionada nenhuma dessas ações.

Em **Contratos**, a página começa com sete indicadores (vigentes, valor total, valores pagos, saldo, pagamentos vencidos, vigências em 90 dias e vencidos), cartões de alertas, filtros e accordions. O detalhe reúne metadados, QR Code, impressão/PDF, períodos financeiro por contrato/aditivo, abas de vencimentos, histórico e termos aditivos, tabela de parcelas e formulário de baixa. A observação não registrou pagamentos, não abriu edição e não executou exclusões.

Os menus laterais expansíveis usam um único nível de submenu: **Unidades Escolares** apresenta Cadastro e Relatórios; **Educa Paço** apresenta Cadastro de Núcleos e Relatórios. A abertura desses menus não troca o conteúdo do módulo atual até que uma opção interna seja acionada.

O submenu de **Nutrição** apresentou Planejamento semanal e análise de saldos e Planejamento anual da alimentação. A tentativa de abrir Recursos Humanos ocorreu enquanto Educa Paço ainda estava expandido; o resultado visual confirmou que os submenus são mutuamente alternados. A decomposição completa de Recursos Humanos será confirmada pela leitura estática e por uma navegação específica posterior, sem usar formulários.

A navegação específica confirmou que **Recursos Humanos** possui cinco entradas: Cadastro de Servidores, Ficha Financeira, Holerite, Frequência e movimento e Relatórios. A mudança de submenu preserva o conteúdo do módulo anteriormente aberto; nenhuma dessas entradas internas foi acionada e nenhum dado de servidor foi aberto.

O submenu de **Estoque** possui Agricultura Familiar, Industrializado, Kit do Aluno, Estoque Alimentação Escolar, Estoque Material de Limpeza, Estoque Material de Expediente e Relatórios. O submenu de **Frota** possui Cadastro de Veículos, Controle de Abastecimento, Controle de Manutenção, Controle de Ocorrências e Relatórios. As entradas foram somente reveladas na navegação, sem abrir os módulos internos ou registrar movimentações.

A página **Usuários** é uma lista administrativa com atalho Novo usuário, cartões por conta, papel, estado de senha e estado ativo, além de ações por item para editar, redefinir senha e ativar/desativar. A lista também evidencia que a navegação é dirigida por permissões granulares. Nenhuma ação foi executada.

O **Cadastro de Unidades Escolares** possui atalho Nova unidade, ação de atualização, busca por nome/INEP, filtro de tipo e lista de unidades. Cada linha oferece edição e mapa, mas nenhum registro individual foi aberto. Para a futura reprodução, somente serão usados dados demonstrativos próprios, nunca informações ou identificadores da referência.

O **Cadastro de Núcleos** de Educa Paço é acessado pelo primeiro item do submenu. A abertura do submenu foi confirmada e apresenta as entradas Cadastro de Núcleos e Relatórios; a página interna será registrada sem copiar seus registros quando for aberta.

A página interna **Educa Paço / Núcleos** usa painel de título, botão Novo núcleo, duas abas (Núcleos e Relatórios), busca, filtros por classificação e situação e quatro indicadores de distribuição. A lista é composta de accordions com código, classificação, situação, resumo operacional e ação de equipe/histórico. Nenhum accordion, edição ou histórico foi acionado.

As áreas **Recursos Humanos** e **Nutrição** mantêm o padrão de submenu lateral: Recursos Humanos abre Cadastro de Servidores, Ficha Financeira, Holerite, Frequência e movimento e Relatórios; Nutrição abre Planejamento semanal e análise de saldos e Planejamento anual da alimentação. As páginas internas continuarão sendo observadas por composição e estados, sem registrar dados individuais.

O **Planejamento semanal e análise de saldos** de Nutrição contém cabeçalho funcional, ação Nova projeção, cinco indicadores, busca, filtro mensal, filtros de modalidade e situação e estado vazio orientado. Nenhuma projeção foi criada.

A página **Estoque / Industrializado** inicia com abas Materiais e movimentações e Auditoria do estoque. A visão de materiais traz atalhos para novo produto, movimentação, relatórios de custos/categoria e exportação, indicadores de saldo, busca/filtro, catálogo tabular e histórico de movimentações. Nenhum produto, movimento, relatório ou exportação foi acionado; a reprodução deverá usar catálogo e movimentos demonstrativos próprios.

O **Cadastro de Veículos** de Frota tem ação Novo veículo, exportação CSV, quatro indicadores, busca por placa/modelo/patrimônio, filtro de situação e estado vazio. As demais entradas de Frota são abastecimento, manutenção, ocorrências e relatórios. Nenhum veículo ou operação de frota foi aberto.

O **Cadastro de Servidores** de Recursos Humanos usa painel de título, indicadores de situação cadastral e competência, filtros de status, ação Novo servidor e uma tabela paginada. A composição da tabela é Matrícula, Servidor, CPF, Cargo, Situação e Editar. Nenhuma linha, ficha, holerite ou ação individual foi aberta, e nenhum dado pessoal será transferido para a reprodução local.

As telas **Ficha Financeira** e **Holerite** repetem os indicadores e filtros do cadastro, trocando a coluna final por uma ação contextual de consulta. Ambas iniciam com uma tabela paginada de pessoas; nenhuma ficha, demonstrativo ou arquivo foi aberto.

Em **Frequência e movimento**, a interface passa a trabalhar por competências mensais de unidade: ação Nova competência, quatro indicadores de ciclo, filtros por código, competência e unidade, botão Atualizar e estado vazio para a lista. Nenhuma competência foi criada ou atualizada.

O **Planejamento anual da alimentação escolar** traz ação Novo planejamento, cinco indicadores, busca, filtro de ano, filtros de etapa e situação e estado vazio orientado. Nenhum cardápio, planejamento ou aquisição foi criado.

**Agricultura Familiar** possui cabeçalho de alimentação escolar, quatro indicadores agregados e navegação interna por Entidades, Contratos e saldos, Guias de fornecimento e Entregas e faturamento. As abas foram apenas identificadas; nenhum contrato, guia, entrega ou faturamento foi aberto.

**Kit do Aluno** usa ação Novo pedido por turma, quatro indicadores, abas Pedidos por turma, Estoque e distribuição e Relatórios, filtros de unidade/ano, busca e atualização, além de estado vazio. Nenhum pedido ou distribuição foi registrado.

O **Estoque Alimentação Escolar** é descentralizado: oferece ações de sincronizar guias e nova conferência, quatro indicadores, abas Saldos atuais, Conferências semanais e Movimentações, filtros de unidade/categoria e busca. A visão atual é uma tabela de saldo por unidade/produto/categoria/origem/unidade de medida/atualização; nenhum saldo foi alterado, sincronizado ou conferido.

O **Controle de Abastecimento** de Frota é um formulário com veículo, data, quilometragem, litros, valor unitário, fornecedor, responsável e documento fiscal, seguido por botão de salvamento e lista/estado vazio. Nenhum abastecimento foi lançado.

O **Controle de Manutenção** reúne veículo, data, quilometragem, tipo, fornecedor, custo, próxima data, próxima quilometragem e descrição de serviços, com lista/estado vazio. Nenhuma manutenção foi registrada.

O **Controle de Ocorrências** combina veículo, data, tipo, situação, local, responsável e descrição, com lista/estado vazio. Nenhuma ocorrência foi criada, atualizada ou resolvida.

Os **Relatórios de Frota** possuem seleção de conteúdo, filtros por veículo, situação e intervalo de datas, ação de exportação e quatro indicadores agregados antes do estado da lista. Nenhuma exportação foi gerada.

Os **Relatórios de Recursos Humanos** contêm três visões internas (gerencial, folhas importadas e possíveis desligamentos), filtros de pesquisa/situação/cargo/lotação/admissão/completude/contato/IC, ações de limpar, atualizar, exportar e imprimir. O resultado combina cartões, resumos agregados e tabela paginada; nenhum filtro foi aplicado nem arquivo foi gerado. Por conter dados pessoais no ambiente de referência, a futura reprodução empregará dados demonstrativos próprios e somente campos estritamente necessários.

A **Central de Relatórios de Estoque** organiza consultas por blocos, incluindo catálogo, posição, categoria, valorização, entradas, saídas, movimentações, criticidade, lotes/validades e fornecedores/destinos. Ela contém alternância entre materiais/auditoria, filtros de busca/categoria/situação/atividade/período, cartões de resumo, paginação e ações de exportar/imprimir. Nenhuma consulta foi emitida nem arquivo foi gerado.

Os **Relatórios de Unidades Escolares** usam busca por nome/código institucional, filtros de tipo, situação e ano do censo, ação de exportação, quatro indicadores de rede e tabela de unidades. A tabela é organizada por código institucional, unidade, tipo, situação, bairro e matrículas. Nenhum filtro foi aplicado nem arquivo foi gerado; a reprodução usará somente dados demonstrativos próprios.

Os **Relatórios de Educa Paço** reutilizam o shell do módulo, com abas Núcleos e Relatórios, ação Novo núcleo, filtros por busca/classificação/atividade/modalidade/responsável/situação e controles de exportar/imprimir. A visualização reúne quatro indicadores e uma tabela de capacidade, atividades, modalidades, localização e equipe. Nenhum registro foi aberto nem arquivo foi gerado; a reprodução deve remover dados de contato e utilizar informações demonstrativas próprias.

As áreas descentralizadas **Estoque Material de Limpeza** e **Estoque Material de Expediente** confirmam o mesmo padrão de Alimentação Escolar: sincronizar guias, nova conferência, quatro indicadores, abas de saldos/conferências/movimentações, filtros de unidade/categoria/busca e estado vazio ou tabela de saldo. Apenas a descrição e a categoria mudam; nenhuma sincronização, conferência ou movimentação foi executada.

A aba **Auditoria do estoque** é uma tela de conferência física, separada de materiais e movimentações. Ela possui ação Iniciar auditoria, área de conferências realizadas e atualização da lista. Nenhuma auditoria foi iniciada ou atualizada.

As abas de **Agricultura Familiar** foram abertas somente em leitura. Entidades apresenta ação de novo cadastro e tabela de entidade/documento/representante/contato/situação; Contratos e saldos explicita a diferença entre saldo efetivo e saldo projetado, com cartões por contrato e atalho de saldos; Guias de fornecimento possui nova guia, busca por escola e tabela de guia/contrato/escola/modalidade/período/situação; Entregas e faturamento separa guias por modalidade, mantém ação de geração e tabela de ordens consolidadas. Nenhuma entidade, contrato, guia, confirmação, faturamento, impressão ou exclusão foi acionada. A reprodução local não deve incluir documentos, contatos, valores, códigos ou entidades reais.
