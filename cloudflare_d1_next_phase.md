# Próxima fase: integração Cloudflare D1

## Limite deste checkpoint

O checkpoint atual entrega somente páginas e estados de frontend. Os dados apresentados são de visualização; nenhum item é criado, editado, excluído ou persistido, e nenhum arquivo do primeiro projeto foi modificado.

## Objetivo da fase D1

Criar um novo banco Cloudflare D1, independente do banco antigo, e conectar as páginas atuais aos mesmos contratos funcionais documentados da referência.

## Ordem de implementação

| Ordem | Entrega | Regra herdada da referência |
|---:|---|---|
| 1 | Binding D1 e migrações | Novo banco, sem importar dados ou segredos antigos |
| 2 | Usuários e sessões | `semed_users`, `semed_sessions`, PBKDF2, cookie HTTP-only de 7 dias |
| 3 | Login e primeiro acesso | Usuário/Senha; bloqueio até trocar senha temporária; mínimo de 10 caracteres |
| 4 | Registros e pagamentos | `semed_records`, `semed_record_payments`, saldo derivado das baixas |
| 5 | Documentos | `semed_documents`, tipos Ofício/Memorando/Despacho e ordenação por prazo |
| 6 | Operações críticas | Confirmação `EXCLUIR`, validações, normalização e exportação CSV |

## Tabelas previstas

| Tabela | Uso |
|---|---|
| `semed_users` | Usuário, nome, papel, hash/sal, ativo e senha temporária |
| `semed_sessions` | Hash do token, vínculo do usuário e expiração |
| `semed_records` | Contratos e processos |
| `semed_record_payments` | Baixas vinculadas a contratos |
| `semed_documents` | Ofícios, memorandos e despachos |

## Proteções

O novo sistema não deve copiar o D1, tokens, cookies, hashes ou dados pessoais do sistema original. As contas de desenvolvimento e dados de teste serão criados no novo ambiente somente quando essa fase for solicitada.
