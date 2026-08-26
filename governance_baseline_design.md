# Base mínima de governança — desenho aprovado

## Objetivo de compatibilidade

Esta evolução não altera a página de login, a identidade visual, os perfis existentes ou a sequência de formulários. Ela adiciona uma camada local de autorização por ação, auditoria transversal e referências estruturadas que convivem com os campos textuais já apresentados na interface.

## Matriz local de ações

| Ação | Administrador | Técnico com chave do módulo | Contadora Municipal | Gestor/Secretário Escolar | Auditoria Externa |
|---|---:|---:|---:|---:|---:|
| Preparar | Sim | Sim | Financeiro | Não | Não |
| Revisar | Sim | Sim, no módulo concedido | Financeiro | Não | Não |
| Aprovar | Sim | Não | Não | Não | Não |
| Executar | Sim | Sim, no módulo concedido | Financeiro | Não | Não |
| Cancelar | Sim | Não | Financeiro | Não | Não |
| Auditar | Sim | Não | Financeiro | Leitura de sua unidade quando aplicável | Leitura sem alteração |

## Vínculos estruturados acrescentados

| Entidade | Vínculos opcionais e compatíveis |
|---|---|
| Documento | `relatedRecordId` para apontar ao contrato ou processo correspondente. |
| Pagamento contratual | `documentId` e `financeExecutionId`, além de `actorUserId`. |
| Execução financeira | `recordId`, `documentId` e `paymentId`, sem remover `documentReference`. |
| Auditoria transversal | Entidade, ação, ator, campos alterados, resumo e identificador de correlação. |

## Regras de integração

1. O vínculo é resolvido automaticamente a partir das referências textuais já existentes quando houver correspondência inequívoca.
2. A ausência de correspondência não bloqueia registros legados nem formulários atuais.
3. Contratos, Documentos, Pagamentos e Execuções passam a registrar evento de auditoria transversal em criação, atualização, exclusão, baixa ou cancelamento.
4. Ações de cancelamento de lançamento financeiro ficam reservadas a Administrador ou Contadora Municipal; demais operações existentes continuam dependentes da permissão de escrita já atribuída ao módulo.
