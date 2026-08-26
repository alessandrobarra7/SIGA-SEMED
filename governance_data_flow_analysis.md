# Análise de governança de perfis, setores e fluxos de dados

**Escopo:** preview local do SIGA SEMED, baseado no código atual e em dados estritamente demonstrativos.  
**Objetivo:** identificar mudanças estruturais necessárias antes de expandir o sistema para Frota ou outros setores.

> **Conclusão executiva:** o sistema possui uma base funcional consistente para demonstração — perfis, permissões por módulo, operações locais, auditorias setoriais e migrações de esquema. Entretanto, a governança atual ainda é predominantemente baseada em **módulo** e em **campos de referência textuais**. Antes de criar Frota, recomenda-se evoluir para permissões por ação, vínculos estruturados entre setores e uma auditoria transversal.

## 1. Estado atual da autorização

O domínio mantém seis perfis fechados, aplica uma política central de leitura e escrita e impede o acesso à visão no shell quando a permissão de módulo não existe. Usuários Técnicos recebem chaves individualmente; Administrador tem acesso integral; Gestor Escolar e Secretário Escolar têm leitura vinculada a unidades; Auditoria Externa tem leitura ampla sem acesso a Usuários; e Contadora Municipal tem escrita financeira. [1] [2]

| Perfil | Papel atual no preview | Leitura | Escrita | Avaliação de governança |
|---|---|---|---|---|
| Administrador | Administração geral e parametrização | Todos os setores | Todos os setores; exclusividade para Usuários, Configurações, Fontes e Regras financeiras | Poder concentrado; adequado ao demo, mas precisa de atos aprovadores distintos em produção. |
| Técnico | Executor configurável | Apenas chaves concedidas | Mesmas chaves concedidas | Flexível, porém pode acumular preparação e execução sem segregação de funções. |
| Gestor Escolar | Consulta de sua unidade | Início e Unidades Escolares | Nenhuma | O escopo por escola existe, mas está pouco explorado nos fluxos que deveriam receber confirmação da unidade. |
| Secretário Escolar | Consulta de sua unidade | Início e Unidades Escolares | Nenhuma | Mesmo limite do Gestor; não participa formalmente de solicitações, frequência ou conferências. |
| Auditoria Externa | Leitura para fiscalização | Todos os módulos, exceto Usuários | Nenhuma | Acesso muito amplo para dados de RH e Financeiro; requer minimização de campos. |
| Contadora Municipal | Execução financeira | Todos os módulos, exceto Usuários | Financeiro | Escrita financeira é coerente, mas a leitura irrestrita excede o necessário para a função. |

### Ponto forte

As funções `canReadLocalModule` e `canWriteLocalModule` são usadas como ponto central para as operações novas, e o shell bloqueia a troca de visão sem permissão. A regra especial de escopo escolar também é aplicada nas conferências e movimentações escolares de Estoque. [1] [3]

### Lacuna principal

O controle atual responde a **“pode escrever neste módulo?”**, mas não a **“pode preparar, revisar, aprovar, cancelar, executar, exportar ou auditar este ato?”**. Para governança institucional, essas ações devem ser distintas.

## 2. Cadeia de dados atual por setor

| Setor | Origem principal de dados | Consumidores atuais | Vínculos efetivos | Risco de divergência |
|---|---|---|---|---|
| Unidades Escolares | Cadastro de unidade | RH, Estoque escolar e parte da Nutrição | IDs demonstrativos compartilhados em alguns fluxos | Médio: nem todos os cadastros usam uma única fonte de unidade. |
| Nutrição | Escolas, contratos próprios e catálogo próprio | Planejamento semanal e anual | Contrato vincula produtos e escolas internamente | Alto: contratos e catálogo não apontam para Contratos/Documentos ou Estoque. |
| Estoque | Catálogo e saldo por escopo | Movimentações, conferências, pedidos de kit | Item e escola têm IDs; referências de origem/destino são texto | Médio: não há vínculo obrigatório com documento, contrato ou plano. |
| Recursos Humanos | Servidores e unidade escolar | Ficha financeira e frequência | Fichas e frequência apontam para servidor/unidade | Médio: folha e frequência não alimentam execução financeira. |
| Contratos e Documentos | Registro, pagamento e documento | Saldos contratuais e consulta | Pagamento aponta para contrato; documento usa referência textual | Alto: documento não tem chave de contrato/processo e não há ator ou auditoria uniforme. |
| Financeiro | Fonte, regra, planejamento, receita e execução | Indicadores e relatórios | Execução usa `documentReference` textual | Alto: não há vínculo obrigatório com pagamento contratual, documento, estoque ou folha. |
| Configurações | Parâmetros institucionais | Página de Configurações | Persistência e auditoria próprias | Médio: exercício, sessão, senha e alertas ainda não governam os fluxos globais. |

## 3. Correlações positivas já existentes

O cadastro de unidade escolar é o principal eixo transversal já aproveitado. Servidores de RH apontam para uma unidade, períodos de frequência apontam para uma unidade, e os saldos escolares de Estoque também usam o identificador de unidade. A Nutrição semanal valida se a escola pertence ao contrato selecionado, reduzindo inconsistências dentro daquele processo. [1]

O módulo Financeiro tem sua própria cadeia interna coerente: fontes alimentam planejamento, receitas e execução; as regras por exercício produzem indicadores; e fontes e regras têm alteração restrita ao Administrador. [1]

Também há auditorias setoriais em Usuários, RH, Financeiro e Configurações. Estoque mantém trilha de movimentações e auditorias de saldo, o que é um bom ponto de partida para uma trilha institucional unificada. [1]

## 4. Lacunas efetivas de processo

### 4.1 Separação de funções insuficiente

Um Técnico com chave de módulo pode criar e alterar o mesmo objeto até sua etapa final. No Financeiro, a Contadora pode alterar planejamento, receitas e execução, enquanto o Administrador altera fontes e regras. Ainda não há distinção formal entre elaboração, conferência, aprovação, pagamento, cancelamento e auditoria. [1]

**Mudança recomendada:** substituir parte das chaves atuais por permissões de ação. Uma primeira matriz prática seria:

| Ação | Técnico setorial | Gestor/Secretário escolar | Contadora | Administrador | Auditoria externa |
|---|---:|---:|---:|---:|---:|
| Criar rascunho | Sim, por setor | Sim, apenas solicitação de sua unidade | Sim, no financeiro | Sim | Não |
| Revisar tecnicamente | Conforme setor | Não | Sim, no financeiro | Sim | Não |
| Aprovar/publicar | Não | Confirmar recebimento ou demanda | Não | Sim ou perfil aprovador futuro | Não |
| Executar pagamento/baixa | Não | Não | Sim, no financeiro | Sim | Não |
| Cancelar | Não | Não | Solicitar justificativa | Sim | Não |
| Auditar | Não | Não | Leitura financeira restrita | Leitura integral | Sim, com mascaramento |

### 4.2 Vínculos críticos ainda são textuais

Contratos, documentos e execução financeira usam campos de número ou referência textual em pontos importantes. Isso permite apresentar o dado, mas não garante integridade referencial, rastreio automático ou conciliação entre um pagamento de contrato e uma execução financeira. Nutrição e Estoque também mantêm catálogos e contratos paralelos. [1]

**Mudança recomendada:** criar um núcleo de referências estruturadas, mantendo os textos apenas como descrição visual:

| Entidade | Chaves estruturadas recomendadas |
|---|---|
| Documento | `processId`, `contractId`, `financialExecutionId`, `schoolUnitId` opcionais conforme tipo. |
| Pagamento contratual | `contractId`, `financialExecutionId`, `documentId`, `actorUserId`. |
| Execução financeira | `sourceId`, `documentId`, `contractId`, `paymentId`, `costCenterId`, `status`. |
| Movimento de estoque | `itemId`, `schoolUnitId`, `nutritionPlanId`, `contractId`, `documentId`, `actorUserId`. |
| Plano de nutrição | `schoolUnitId`, `contractId`, `stockReservationId` quando aplicável. |
| Registro de RH | `serverId`, `schoolUnitId`, `financialExecutionId` apenas se houver folha liquidada/paga. |

### 4.3 Auditoria incompleta e heterogênea

Usuários, RH, Financeiro e Configurações registram auditoria; Estoque registra movimentos e conferências. Em contraste, alterações de Contratos, Documentos, Nutrição, Unidades e Educa Paço não possuem uma trilha institucional equivalente com ator, antes/depois, motivo e correlação de processo. [1]

**Mudança recomendada:** criar um evento de auditoria transversal com `entityType`, `entityId`, `action`, `actorUserId`, `before`, `after`, `reason`, `correlationId` e horário UTC. A interface pode mostrar apenas um resumo mascarado; o dado técnico deve suportar inspeção posterior.

### 4.4 Configurações ainda são informativas

O módulo novo grava e audita exercício de referência, duração de sessão, tamanho mínimo de senha, antecedência de alertas e notificações. Entretanto, o login ainda cria sessão com período fixo, o mínimo de senha não é validado pelo mesmo parâmetro, o exercício não preenche filtros automaticamente e a antecedência não gera alertas operacionais. [1]

**Mudança recomendada:** conectar estes parâmetros aos pontos reais de consumo, em ordem segura: duração de sessão no login; política de senha nas trocas; exercício padrão nos módulos Financeiro/Nutrição/RH; antecedência nos alertas de contratos, pagamentos, frequência e estoque.

### 4.5 Regras financeiras não bloqueiam a disponibilidade

O Financeiro calcula disponibilidade a partir de saldo inicial, receitas e pagamentos, mas o salvamento de execução não impede que pagamentos ultrapassem uma fonte disponível. As etapas Empenhado, Liquidado, Pago e Apropriação legal também podem ser incluídas como registros paralelos sem uma cadeia de transição obrigatória. [1]

**Mudança recomendada:** criar uma identidade de despesa com transições permitidas e valores conciliados. O pagamento deve depender de liquidação, a liquidação de empenho, e cada ato deve respeitar fonte, disponibilidade, documento e permissão de ação.

### 4.6 O preview local não é uma camada de segurança final

As permissões e auditorias atuais são adequadas para o preview demonstrativo no navegador, mas o armazenamento local é controlado pelo cliente. Para um ambiente multiusuário ou de produção, a validação de permissões, integridade, auditoria e transações precisará existir no servidor e em uma base compartilhada; não deve depender apenas da interface. [1]

## 5. Prioridades antes de Frota

| Prioridade | Mudança efetiva | Justificativa |
|---:|---|---|
| P0 | Definir matriz de ações por processo e reduzir leitura ampla de Auditoria/Contadora | Evita que Frota repita permissões genéricas por módulo. |
| P0 | Padronizar auditoria transversal e referência estruturada de documento/contrato/financeiro | Cria base rastreável para abastecimento e manutenção. |
| P1 | Integrar Configurações aos controles que ela declara governar | Evita parâmetros apenas decorativos. |
| P1 | Conectar pagamento contratual e execução financeira, com conciliação | Evita dois saldos financeiros paralelos. |
| P1 | Definir centros de custo e vínculo de unidade | Necessário para custo de Frota por serviço, rota, veículo ou unidade. |
| P2 | Criar painel de pendências por responsável e etapa | Melhora acompanhamento depois que os estados tiverem responsabilidade formal. |

## 6. Diretriz específica para o futuro módulo Frota

Frota não deve ser acrescentada como um cadastro isolado de veículos. O modelo inicial deve nascer com referências obrigatórias para **veículo, condutor/responsável, centro de custo, setor solicitante, unidade escolar quando aplicável, documento, contrato, fonte financeira e executor do ato**. Abastecimento, manutenção e ocorrência devem possuir estados distintos de solicitação, conferência, aprovação, execução e encerramento.

Esta decisão evita que a manutenção de transporte escolar, combustível e reparos se tornem um terceiro fluxo financeiro paralelo aos contratos e à execução financeira existentes.

## 7. Recomendação de sequência

1. **Aprovar a matriz de responsabilidades por ação** proposta nesta análise.
2. **Implementar a camada mínima de vínculos e auditoria transversal** em Contratos, Documentos, Financeiro e Estoque.
3. **Fazer Configurações efetivamente governar sessão, senha, exercício e alertas.**
4. **Somente então modelar Frota** já integrada aos centros de custo, contratos, documentos e execução financeira.

## Referências internas

[1] [`sigaLocalStore.ts`](./client/src/pages/sigaLocalStore.ts) — tipos, permissões, operações, vínculos, auditorias e migrações do armazenamento local.

[2] [`WorkspacePreview.tsx`](./client/src/pages/WorkspacePreview.tsx) — mapeamento de visões, guarda de leitura e integração do shell.

[3] [`sigaUserPermissions.test.ts`](./server/sigaUserPermissions.test.ts) — cobertura atual de perfis, permissões, escopo escolar, auditoria e migração.
