# Andamento do Projeto — SIGA SEMED

> **Objetivo deste documento:** registrar o estágio da reconstrução funcional do SIGA SEMED, orientar as próximas entregas e evitar mudanças que se afastem da referência observada. Este arquivo deve ser atualizado a cada módulo concluído, antes de uma nova publicação no repositório.

## 1. Decisões que orientam o projeto

| Tema | Decisão vigente |
|---|---|
| Referência funcional | O sistema original é fonte de observação estrutural e funcional, sempre em modo somente leitura. |
| Aparência | O visual registrado no checkpoint de base é a referência oficial do novo preview. Layout, navegação, cores e hierarquia não devem ser alterados sem autorização explícita. |
| Login | A composição atual do login é oficial. O acesso local aceita matrícula ou CPF e mantém primeiro acesso com troca de senha local. |
| Dados | O preview usa apenas dados demonstrativos próprios persistidos no navegador. Dados, documentos, identificadores, tokens e credenciais do sistema original não são copiados. |
| Banco de dados | Não há conexão com Cloudflare D1, banco externo ou ambiente de produção. A compatibilidade estrutural é mantida por um repositório local versionado. |
| Segurança | Credenciais nunca devem ser registradas em código, documentação, commits ou arquivos de configuração. |

As decisões foram consolidadas durante a auditoria da referência e devem prevalecer sobre simplificações visuais ou funcionais não comprovadas.[1] [2]

## 2. Estado técnico atual

O projeto é um preview React/Vite com persistência local via `localStorage`. O domínio local está versionado e possui migrações compatíveis com dados demonstrativos anteriores. Os seis perfis de usuário, as permissões por módulo e o registro local de auditoria foram introduzidos antes da implementação dos módulos de Usuários, Nutrição e Estoque.[3]

| Elemento | Situação atual |
|---|---|
| Shell autenticado | Concluído: cabeçalho institucional, boas-vindas, Início e menu lateral na ordem observada. |
| Persistência local | Concluída: armazenamento versionado para contratos, documentos, usuários, nutrição e estoque. |
| Permissões | Concluídas para o preview: leitura, escrita, escopo escolar e acesso administrativo por perfil. |
| Auditoria local | Concluída para ações administrativas e operações locais relevantes. |
| Integração externa | Deliberadamente ausente. Nenhuma chamada ao D1 ou ao ambiente original é permitida. |
| Testes mais recentes | 55 testes automatizados aprovados, além de checagem TypeScript e build de produção. |

## 3. Módulos concluídos no preview

| Módulo | Entrega funcional atual | Validação concluída |
|---|---|---|
| Login e primeiro acesso | Matrícula/CPF, senha local, validação, alteração obrigatória de senha no primeiro acesso e encerramento de sessão. | Desktop, mobile e regressões de acesso. |
| Shell e Início | Boas-vindas, agenda local, prazos, anotações, indicadores e navegação lateral expansível. | Desktop e mobile. |
| Gestão | Tarefas, alertas, relatórios locais, anexos e aprovações demonstrativas. | Navegação e regressões de componentes. |
| Cadastros | Escolas, núcleos, prédios administrativos e biblioteca, com filtros e criação local demonstrativa. | Desktop, mobile, testes e build. |
| Contratos, Documentos e Financeiro local | Fluxos já existentes de registros, filtros, documentos, parcelas, baixas, histórico e exclusão confirmada. | Operações locais e persistência. |
| Usuários | Cadastro, edição, filtros, perfis, matrícula/CPF, senha provisória, sessões, ativação, desativação e auditoria local. | Regras de permissão, persistência, desktop e mobile. |
| Nutrição | Planejamento semanal, análise de saldos, planejamento anual, per capita, dias letivos, cobertura, compra/contratação, impressão e CSV local. | Cálculos, permissões, desktop e mobile. |
| Estoque | Industrializado, Kit do Aluno, Alimentação Escolar, Limpeza, Expediente, Relatórios e Agricultura Familiar; inclui catálogo, saldo, movimentos, conferência, auditoria, pedidos e guias locais. | 55 testes totais, desktop e mobile. |

> Os dados exibidos em todos os módulos concluídos são **demonstrativos e locais**. Eles não representam cadastros, saldos, contratos, pessoas ou documentos da referência externa.

## 4. Referência observada e ainda pendente de reprodução funcional

A navegação e a estrutura dos itens abaixo já foram mapeadas na referência, mas suas páginas ainda não foram transformadas em funcionalidades locais completas no preview.[1]

| Prioridade sugerida | Setor | Escopo a reproduzir a partir da referência |
|---:|---|---|
| 1 | Frota | Cadastro de veículos, abastecimento, manutenção, ocorrências e relatórios, com permissões e histórico local. |
| 2 | Recursos Humanos | Cadastro de servidores, ficha financeira, holerite, frequência e movimento, relatórios e regras de acesso. |
| 3 | Unidades Escolares | Cadastro, filtros, indicadores, relatórios e visualização estrutural de unidade. |
| 4 | Educa Paço | Cadastro de núcleos, relatórios, capacidade, atividades e equipes demonstrativas. |
| 5 | Financeiro | Aprofundar planejamento, receitas, execução, fontes e regras e relatórios, além dos fluxos de contratos já existentes. |
| 6 | Gestão complementar | Expandir aprovações, anexos e relatórios somente após nova observação direta da referência quando houver dúvida de fluxo. |

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
| [`todo.md`](./todo.md) | Histórico verificável de itens concluídos e pendências de cada frente. |

## 7. Rotina de atualização deste documento

Ao concluir um módulo, registrar sua entrega na tabela de módulos concluídos, removê-lo da lista de pendências, anotar o tipo de validação executada e atualizar o total de testes se ele tiver mudado. Quando um requisito da referência não tiver sido observado diretamente, deve ser marcado como **pendente de observação**, e não estimado.

## Referências

[1]: ./reference_package_audit.md "Auditoria do pacote e da referência operacional"
[2]: ./reproduction_before_changes.md "Mapa de reprodução antes de mudanças"
[3]: ./users_permissions_functional_spec.md "Especificação funcional de usuários e permissões"
