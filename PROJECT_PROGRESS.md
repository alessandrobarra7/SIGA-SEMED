# Andamento do Projeto — SIGA SEMED

> **Objetivo deste documento:** registrar o estágio da reconstrução funcional do SIGA SEMED, orientar as próximas entregas e evitar mudanças que se afastem da referência observada. Este arquivo deve ser atualizado a cada módulo concluído, antes de uma nova publicação no repositório.

## 1. Decisões que orientam o projeto

| Tema | Decisão vigente |
|---|---|
| Referência funcional | O sistema original é fonte de observação estrutural e funcional, sempre em modo somente leitura. |
| Aparência | A identidade visual clara, azul e verde foi explicitamente autorizada após a entrega do Financeiro ampliado. Login, shell, navegação, superfícies e módulos adotam a nova linguagem; lógica, rotas, permissões, dados, cálculos e fluxos permanecem inalterados. |
| Login | A composição atual do login é oficial. Todo perfil ativo pode autenticar-se por matrícula ou CPF quando ambos estiverem registrados, mantendo primeiro acesso com troca de senha local. |
| Dados | O preview usa apenas dados demonstrativos próprios persistidos no navegador. Dados, documentos, identificadores, tokens e credenciais do sistema original não são copiados. |
| Banco de dados | Não há conexão com Cloudflare D1, banco externo ou ambiente de produção. A compatibilidade estrutural é mantida por um repositório local versionado. |
| Segurança | Credenciais nunca devem ser registradas em código, documentação, commits ou arquivos de configuração. |

As decisões foram consolidadas durante a auditoria da referência e devem prevalecer sobre simplificações visuais ou funcionais não comprovadas.[1] [2]

## 2. Estado técnico atual

O projeto é um preview React/Vite com persistência local via `localStorage`. O domínio local está versionado e possui migrações compatíveis com dados demonstrativos anteriores. Os seis perfis de usuário, as permissões por módulo e o registro local de auditoria foram introduzidos antes da implementação dos módulos de Usuários, Nutrição e Estoque.[3]

| Elemento | Situação atual |
|---|---|
| Shell autenticado | Concluído: cabeçalho institucional, boas-vindas, Início, menu lateral na ordem observada, buscador global com navegação por resultados permitidos e convenção tipográfica global aplicada por função aos módulos internos. |
| Persistência local | Concluída: armazenamento v11 para contratos, documentos, usuários, credencial demonstrativa administrativa, Gestão complementar, comentários de devolução, nutrição, estoque, recursos humanos, unidades escolares, núcleos Educa Paço, Financeiro ampliado, Configurações institucionais, governança e Frota. |
| Permissões | Concluídas para o preview: leitura, escrita, escopo escolar e acesso administrativo por perfil. |
| Auditoria local | Concluída para ações administrativas e operações locais relevantes. |
| Integração externa | Deliberadamente ausente. Nenhuma chamada ao D1 ou ao ambiente original é permitida. |
| Testes mais recentes | 99 testes automatizados aprovados, além de checagem TypeScript e build de produção. |
| Identidade visual | Login ilustrado com marca municipal fornecida, tipografia humanizada e painel de acesso claro — congelado por aprovação expressa. Montserrat ExtraBold atende títulos, chamadas e números de destaque; Manrope atende legendas e controles internos, com escala reforçada no painel Início. Por orientação explícita, títulos institucionais e controles textuais que abrem módulos, abas, janelas ou ações agora usam caixa alta no ambiente autenticado. Descrições, dados, textos de lista, campos, filtros e a marca institucional permanecem em leitura normal. |

## 3. Módulos concluídos no preview

| Módulo | Entrega funcional atual | Validação concluída |
|---|---|---|
| Login e primeiro acesso | Matrícula e CPF coexistentes no cadastro de qualquer perfil; autenticação pelo identificador disponível, senha local, validação, alteração obrigatória no primeiro acesso e encerramento de sessão. | Desktop, mobile e regressões de acesso pelos dois identificadores. |
| Shell e Início | Boas-vindas, agenda local, visão mensal navegável de prazos de Gestão, anotações, navegação lateral expansível e indicadores de tarefas abertas, aprovações pendentes e alertas de Gestão quando o perfil possui leitura permitida. A tipografia efetiva de Início usa Montserrat nos títulos e números de destaque; Manrope foi aplicada diretamente às legendas, descrições, dias, metadados, botões e controles internos visíveis. Após a captura real revelar que a primeira troca ainda era discreta, os níveis de rótulo, metadado e microtexto foram elevados para 13,76 px, 13,12 px e 11,84 px, com peso 700, contraste e entrelinha reforçados. Títulos e botões textuais de abertura adotam caixa alta; cartões mensais longos quebram linha sem elipse. | Regressão estrutural dos seletores reais de Início; confirmação no sandbox de Montserrat em títulos, Manrope nas legendas e caixa alta nos controles institucionais; validação autenticada específica em desktop e mobile; 99 testes totais, TypeScript e build aprovados. |
| Gestão | Tarefas persistentes com prazo, prioridade, responsável e contexto; filtros combináveis por área, responsável, intervalo, situação e prioridade; alertas derivados de tarefas, contratos e documentos; relatórios CSV locais; metadados de anexos; solicitações de aprovação com decisão segregada, devolução fundamentada, histórico de auditoria e comentários internos locais restritos a solicitante e decisor. A tipografia efetiva foi reescrita diretamente em `siga-pages.css` com os tokens globais de Montserrat e Inter; a antiga camada complementar tipográfica foi removida. Título de página, títulos de tarefa, agenda, abas e controles textuais adotam caixa alta; títulos longos quebram linha no card principal e lateral sem corte. | Regressão lê os seletores reais do CSS-base e falha para fonte legada, escala fixa ou truncamento de títulos em caixa alta. Foram aprovados 99 testes, TypeScript e build; Gestão e navegação lateral foram revisadas em sessão administrativa autenticada, em desktop e em viewport móvel. |
| Cadastros | Escolas, núcleos, prédios administrativos e biblioteca, com filtros e criação local demonstrativa. | Desktop, mobile, testes e build. |
| Contratos e Documentos | Fluxos de registros, filtros, documentos, parcelas, baixas, histórico e exclusão confirmada. | Operações locais e persistência. |
| Usuários | Cadastro, edição, filtros, perfis, matrícula/CPF coexistentes, senha provisória, sessões, ativação, desativação e auditoria local. | Regras de permissão, recuperação defensiva de base local, desktop e mobile. |
| Nutrição | Planejamento semanal, análise de saldos, planejamento anual, per capita, dias letivos, cobertura, compra/contratação, impressão e CSV local. | Cálculos, permissões, desktop e mobile. |
| Estoque | Industrializado, Kit do Aluno, Alimentação Escolar, Limpeza, Expediente, Relatórios e Agricultura Familiar; inclui catálogo, saldo, movimentos, conferência, auditoria, pedidos e guias locais. | 55 testes totais, desktop e mobile. |
| Recursos Humanos | Cadastro de Servidores, ficha financeira, holerite, frequência e movimento, competências, relatórios, permissões e auditoria local; dias trabalhados e faltas limitados ao total previsto. Os cinco submenus laterais abrem diretamente sua aba correspondente. | Migração v4, permissões, regressões de limite e navegação, desktop, mobile, TypeScript e build. |
| Unidades Escolares | Cadastro, pesquisa por código/nome/setor, filtros por tipo, situação e censo, inclusão/edição local, indicadores, relatórios e CSV demonstrativo. | Migração v5, permissões, 64 testes totais, desktop, mobile, TypeScript e build. |
| Educa Paço | Cadastro de Núcleos, classificação, situação, capacidade, atividades, modalidades, responsáveis demonstrativos, relatórios, CSV e impressão local. | Migração v5, permissões, 64 testes totais, desktop, mobile, TypeScript e build. |
| Financeiro ampliado | Visão geral, Planejamento, Receitas, Execução, Fontes e regras e Relatórios; inclui filtros por exercício/fonte, fontes, metas, cancelamento auditável, indicadores, CSV, impressão local e aviso para sobrepagamentos históricos. | Migração v6, permissões administrativas, alerta preventivo sem alterar o bloqueio de novas baixas, desktop, mobile, TypeScript e build. |
| Configurações institucionais | Identificação, exercício, comunicações, segurança e auditoria local; parâmetros demonstrativos persistidos, regras de limites e salvamento restrito ao Administrador. | Migração v7, proteção administrativa, 71 testes totais, desktop, mobile, TypeScript e build. |
| Base mínima de governança | Matriz de preparar/revisar/aprovar/executar/cancelar/auditar; referências opcionais entre contratos, documentos, baixas e execução financeira; trilha transversal somente leitura. | Segregação de cancelamento, integridade referencial, auditoria, 75 testes, TypeScript e build. |
| Frota | Cadastro de veículos, abastecimento, manutenção, ocorrências e relatórios demonstrativos; cálculo de abastecimento, estados operacionais, referências de governança e auditoria transversal. Cancelamento de manutenção restaura disponibilidade quando não houver outra manutenção agendada; ações restritas são ocultadas para perfis sem governança. | Migração v8, segregação de cancelamento/resolução, regressões de estado e interface, desktop, mobile, TypeScript e build. |
| Buscador global | Índice local de módulos e contextos do shell; consulta normalizada sem acentos, resultados navegáveis por clique ou Enter, estado vazio e ocultação de visões sem permissão. | Regressão de busca e permissões; validação manual de resultado, navegação e estado vazio; responsividade do cabeçalho, 81 testes totais, TypeScript e build. |

> Os dados exibidos em todos os módulos concluídos são **demonstrativos e locais**. Eles não representam cadastros, saldos, contratos, pessoas ou documentos da referência externa.

## 4. Referência observada e ainda pendente de reprodução funcional

A navegação e a estrutura dos itens abaixo já foram mapeadas na referência, mas suas páginas ainda não foram transformadas em funcionalidades locais completas no preview.[1]

| Prioridade sugerida | Setor | Escopo a reproduzir a partir da referência |
|---:|---|---|
| — | Nenhuma pendência imediata | A Gestão complementar foi consolidada localmente com base nas cinco abas já observadas e na autorização do usuário; novos detalhes do sistema de referência continuarão condicionados a observação somente leitura. |

## 5. Protocolo obrigatório para cada novo setor

Cada nova frente deve seguir esta sequência, sem pular etapas:

1. **Observar a referência em modo somente leitura.** É permitido navegar, expandir menus, trocar abas e abrir telas de consulta. É proibido criar, editar, excluir, enviar, imprimir, exportar, baixar, sincronizar, confirmar baixas ou alterar qualquer registro externo.
2. **Registrar a observação.** Documentar somente títulos, campos, filtros, indicadores, abas, estados vazios, permissões aparentes, etapas e ordem operacional. Nunca registrar dados pessoais, valores reais, documentos, URLs de validação ou identificadores externos.
3. **Modelar a versão local.** Criar tipos, migração do armazenamento local, dados demonstrativos e políticas de permissão antes da página.
4. **Reproduzir o funcionamento.** Implementar operações locais coerentes com o fluxo observado, sem inventar telas, campos ou atalhos não comprovados.
5. **Testar e validar.** Cobrir persistência, cálculos, permissões, bloqueios e regressões; validar em desktop e mobile; revisar a aparência para garantir que a identidade oficial permaneça inalterada.
6. **Salvar e publicar com segurança.** Criar checkpoint, atualizar este documento e só enviar ao GitHub com autorização explícita. Credenciais devem ser usadas apenas de forma efêmera e revogadas após o envio.

## 6. Documentos de apoio no repositório

| Documento | Finalidade |
|---|---|
| [`reference_package_audit.md`](./reference_package_audit.md) | Auditoria do pacote de referência, versões, menus e limites de observação. |
| [`reproduction_before_changes.md`](./reproduction_before_changes.md) | Mapa de reprodução do shell, dos módulos e das decisões de produto. |
| [`users_permissions_functional_spec.md`](./users_permissions_functional_spec.md) | Especificação de perfis, permissões, auditoria e regras do módulo Usuários. |
| [`nutrition_reference_observation.md`](./nutrition_reference_observation.md) | Campos, fórmulas e validações observadas para Nutrição. |
| [`stock_reference_observation.md`](./stock_reference_observation.md) | Categorias, abas, controles e estados observados para Estoque. |
| [`schools_educapaco_reference_observation.md`](./schools_educapaco_reference_observation.md) | Navegação, campos, filtros, indicadores e limites de reprodução local de Unidades Escolares e Educa Paço. |
| [`finance_reference_observation.md`](./finance_reference_observation.md) | Navegação, campos, filtros, permissões, cálculos e limites de reprodução local do Financeiro ampliado. |
| [`settings_reference_observation.md`](./settings_reference_observation.md) | Registro de que a referência possui apenas configuração pessoal de senha e dos limites para o módulo institucional novo autorizado. |
| [`governance_baseline_design.md`](./governance_baseline_design.md) | Matriz de ações, referências estruturadas e escopo da auditoria transversal local. |
| [`governance_data_flow_analysis.md`](./governance_data_flow_analysis.md) | Diagnóstico técnico de perfis, setores, dependências e prioridades que fundamentou a governança. |
| [`fleet_reference_observation.md`](./fleet_reference_observation.md) | Campos, controles, regras de permissão e limites de reprodução local do módulo Frota. |
| [`visual_identity_refresh.md`](./visual_identity_refresh.md) | Diretrizes e limites funcionais da identidade visual clara, azul e verde autorizada pelo usuário. |
| [`todo.md`](./todo.md) | Histórico verificável de itens concluídos e pendências de cada frente. |

## 7. Rotina de atualização deste documento

Ao concluir um módulo, registrar sua entrega na tabela de módulos concluídos, removê-lo da lista de pendências, anotar o tipo de validação executada e atualizar o total de testes se ele tiver mudado. Quando um requisito da referência não tiver sido observado diretamente, deve ser marcado como **pendente de observação**, e não estimado.

## Referências

[1]: ./reference_package_audit.md "Auditoria do pacote e da referência operacional"
[2]: ./reproduction_before_changes.md "Mapa de reprodução antes de mudanças"
[3]: ./users_permissions_functional_spec.md "Especificação funcional de usuários e permissões"
