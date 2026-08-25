# Banco de dados no primeiro código SIGA SEMED

> **Escopo:** esta descrição foi extraída dos arquivos de referência `db/auth.ts`, `db/records.ts`, `db/documents.ts`, rotas `app/api/*` e `README.md`. O código de referência foi apenas lido; nenhum arquivo ou dado antigo foi alterado.

## Tecnologia e ambiente

O primeiro sistema usa **Cloudflare D1**, o banco SQL baseado em SQLite disponibilizado dentro dos Workers. O Worker recebe a conexão por meio do binding `env.DB`; as camadas de dados validam que esse binding existe antes de qualquer operação.

| Item | Implementação confirmada |
|---|---|
| Banco | Cloudflare D1 |
| Acesso | API nativa D1: `prepare`, `bind`, `first`, `all`, `run` e `batch` |
| Runtime das rotas | Edge / Cloudflare Worker |
| ORM declarado | Drizzle ORM aparece nas dependências do projeto |
| Esquema efetivamente lido | Criado pelas próprias camadas `db/*.ts` com SQL `CREATE TABLE IF NOT EXISTS` |
| Ambientes | Produção e homologação usam bancos D1 independentes |

Na parte funcional examinada, o sistema **não depende apenas de uma migração externa** para começar: cada módulo mantém uma função de inicialização preguiçosa. Na primeira operação, ela cria suas tabelas e índices se ainda não existirem. Em seguida, a mesma instância de inicialização é reutilizada no ciclo do Worker.

## Estrutura de dados

| Tabela | Finalidade | Campos funcionais principais |
|---|---|---|
| `semed_users` | Usuários e credenciais | usuário, nome exibido, papel, hash/sal da senha, iterações, senha temporária, ativo, último login |
| `semed_sessions` | Sessões autenticadas | hash do token, usuário, expiração e criação |
| `semed_records` | Contratos e processos | tipo, número, objeto, parte, setor, responsável, valor, financeiro, datas, situação, alerta e observações |
| `semed_record_payments` | Baixas de contratos | registro associado, data, valor, observação e criação |
| `semed_documents` | Ofícios, memorandos e despachos | tipo, número, modelo, assunto, destino, destinatário, vínculo, responsável, datas, situação, resumo e observações |

Os vínculos entre pagamento e registro, e entre sessão e usuário, são mantidos por IDs. O saldo de um contrato é calculado pela soma das baixas registradas subtraída do valor total do registro; ele não é armazenado como dado independente suscetível a divergência.

## Inicialização e dados de partida

O módulo de autenticação cria as tabelas de usuários e sessões, os índices para usuário/estado/sessão e, quando não há usuários, insere três contas de partida: `admin`, `tecnico1` e `tecnico2`. Elas começam ativas e exigem troca de senha no primeiro acesso.

As senhas de partida **não estão expostas em texto**: o repositório contém hash, sal e configuração PBKDF2. Não é seguro nem necessário tentar derivar ou inventar a senha original. O README também proíbe manter senhas, cookies, tokens e cópias do D1 no repositório.

O módulo de registros cria as tabelas de registros e pagamentos. Ele normaliza textos administrativos para maiúsculas, valida datas e valores, separa processos de controles financeiros e classifica aluguel quando aplicável. A listagem prioriza itens ativos e com vencimento mais próximo.

O módulo documental cria sua tabela e índices para prazo/tipo/situação. A listagem posiciona documentos concluídos ou cancelados depois dos demais e ordena itens abertos pelo prazo.

## Fluxo de persistência

1. O frontend envia uma requisição para as rotas de API do Worker.
2. A rota exige um usuário autenticado; enquanto houver senha temporária, as operações do negócio são bloqueadas.
3. A rota normaliza e valida o payload.
4. A camada `db/` executa SQL parametrizado no binding D1.
5. A API devolve o item criado/atualizado ou uma mensagem de erro.

Operações de exclusão de registro, pagamento ou documento exigem a confirmação textual `EXCLUIR` na API. Essa regra é de backend e deve permanecer no novo sistema, mesmo que o frontend use uma caixa de confirmação mais elaborada.

## Sessão e proteção

A senha é processada com **PBKDF2-SHA-256**, sal aleatório e 100.000 iterações. A sessão é formada por token aleatório; somente seu hash é persistido. O cookie é HTTP-only, `SameSite=Lax`, expira em sete dias e recebe `Secure` quando o pedido é HTTPS.

## O que o novo código precisa reproduzir

O novo projeto pode trocar Cloudflare D1 por outra infraestrutura relacional se essa for a decisão de arquitetura, mas deve manter estas regras: credenciais por usuário e senha, primeiro acesso obrigatório, sessão com expiração, usuários ativos/inativos, CRUD de registros/pagamentos/documentos, validações, normalização, ordenação, cálculo de saldo e confirmação de exclusão.

O banco antigo não será migrado automaticamente nem copiado. A reconstrução deverá começar com um banco novo e vazio, usar dados de desenvolvimento próprios e receber uma estratégia de importação somente se isso for solicitado posteriormente.
