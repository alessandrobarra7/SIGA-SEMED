# Especificação de reconstrução do SIGA SEMED

## Objetivo

Criar um novo código para o SIGA SEMED, com backend, banco de dados e frontend próprios, mantendo o comportamento confirmado no primeiro projeto funcional. O projeto anterior de preview não será tratado como fonte de regras; ele servirá somente como referência temporária de experimentação visual.

## Fonte de verdade

| Camada | Referência obrigatória |
|---|---|
| Regras de autenticação, sessão e primeiro acesso | `db/auth.ts` e `app/SemedControlApp.tsx` do primeiro pacote |
| Contratos, processos e pagamentos | `db/records.ts` e `app/api/registros`, `app/api/pagamentos` |
| Documentos | `db/documents.ts` e `app/api/documentos` |
| UI, estados e ações | `app/SemedControlApp.tsx` |
| Layout e linguagem visual | Novo frontend, desde que não remova regras ou fluxos |

## Correções de fidelidade já assumidas

1. O campo de acesso passa a ser **Usuário**, e não Matrícula.
2. A aplicação terá primeiro acesso obrigatório antes do dashboard, com senha atual, nova senha, confirmação e mínimo de 10 caracteres.
3. O shell do sistema preservará topo operacional, identificação do usuário/papel, atualização, impressão, exportação CSV, troca de senha e saída.
4. O núcleo inicial inclui os módulos **Contratos e Processos** e **Documentos**, com seus cadastros, filtros, detalhes e operações.
5. Dados demonstrativos serão usados apenas em ambiente de desenvolvimento; a arquitetura não deve depender de arrays locais como fonte de persistência.

## Arquitetura proposta

| Área | Reconstrução |
|---|---|
| Frontend | React/TypeScript, telas específicas para login, primeiro acesso e shell operacional responsivo |
| API | Procedimentos tRPC tipados para autenticação própria, registros, pagamentos e documentos |
| Dados | Banco relacional com tabelas de usuários, sessões, registros, baixas de pagamento e documentos |
| Segurança | Senhas com hash PBKDF2, sessão por cookie HTTP-only e bloqueio de operações enquanto houver senha temporária |
| Testes | Vitest para autenticação, regras financeiras, normalizações, exclusões e operações CRUD críticas |

## Entidades mínimas

| Entidade | Responsabilidade |
|---|---|
| Usuário | Usuário, nome de exibição, papel, senha, estado ativo e obrigação de troca de senha |
| Sessão | Token protegido, usuário associado e expiração de 7 dias |
| Registro | Contrato/processo, prazos, situação, responsável, setor e configuração de alerta |
| Pagamento | Baixa vinculada a um registro, valor, data, observação e próximo pagamento opcional |
| Documento | Ofício, memorando ou despacho com modelo, vínculo, prazo, situação, resumo e observações |

## Próximo marco

O primeiro incremento do novo código deve entregar: login por **Usuário**, primeiro acesso obrigatório, usuário Administrador inicial configurado de forma segura e shell funcional vazio. Em seguida serão implementados Contratos e Processos, pagamentos e Documentos nesta ordem.
