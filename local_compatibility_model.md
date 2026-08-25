# Modelo local compatível do SIGA SEMED

## Decisão de escopo

O novo SIGA SEMED **não se conecta ao Cloudflare D1** nesta reconstrução. O navegador executa uma simulação local, persistida em `localStorage`, para exercitar páginas e fluxos sem acessar, copiar ou migrar o banco original.

> A compatibilidade é de **estrutura, nomes de campos, relações e regras de cálculo**. Ela não inclui dados, hashes, sais, tokens, cookies ou credenciais da referência.

## Coleções locais e correspondência estrutural

| Coleção local | Estrutura de referência | Elementos preservados |
|---|---|---|
| `semedUsers` | `semed_users` | Identificador, usuário, nome de exibição, papel, flags de primeiro acesso/atividade, metadados de senha e datas. Os campos de senha permanecem vazios na demonstração. |
| `semedSessions` | `semed_sessions` | `tokenHash`, `userId`, expiração e criação; mantida como coleção vazia, sem criar cookies ou tokens reais. |
| `semedRecords` | `semed_records` | Tipo, número, objeto, parte, setor, responsável, valor, categoria financeira, próximo pagamento, vigência, situação, observações, alerta e datas de auditoria. |
| `semedRecordPayments` | `semed_record_payments` | Identificador, relação por `recordId`, data, valor, observações e criação. |
| `semedDocuments` | `semed_documents` | Tipo, número, modelo, assunto, destino, destinatário, vínculo, responsável, datas, situação, resumo, observações e auditoria. |

## Regras locais preservadas

Os campos textuais de registros e documentos são normalizados para maiúsculas, como na referência. Processos usam `Sem controle`; contratos usam `Contrato geral` ou `Aluguel`, que pode ser inferido por palavras relacionadas a aluguel ou arrendamento. O valor pago e o saldo são derivados das baixas vinculadas por `recordId`, e nunca se tornam negativos.

A exclusão de um registro exige a confirmação `EXCLUIR` e remove, apenas da simulação do navegador, as baixas relacionadas. A exclusão de documentos obedece à mesma confirmação. Criação, edição, baixa, remoção de baixa, filtros e exportação CSV atualizam ou leem somente o modelo local.

## Limites intencionais

O `localStorage` pertence ao navegador atual e não representa autenticação, sessão segura ou persistência multiusuário. O fluxo de Usuário, Primeiro acesso e Alterar senha é demonstrativo para validar o comportamento visual; ele não verifica senhas e não produz hash, cookie ou token.

Para uma integração futura com qualquer banco, o adaptador deveria trocar somente a origem das cinco coleções. As páginas já trabalham com os tipos e relações que espelham a referência, sem depender de SQL, D1 ou dados antigos.
