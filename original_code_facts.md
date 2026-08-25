# Fatos funcionais do primeiro código SIGA SEMED

> **Finalidade deste documento:** registrar o que foi confirmado no primeiro pacote enviado pelo usuário. Ele é a fonte funcional para a reconstrução do zero; decisões visuais podem evoluir, mas não devem alterar estes fluxos sem validação explícita.

## 1. Arquitetura confirmada

| Aspecto | Implementação do código original |
|---|---|
| Aplicação | Next 16, React 19 e TypeScript |
| Execução | Vinext/Vite com runtime Cloudflare Workers (edge) |
| Banco | Cloudflare D1, acessado com Drizzle ORM |
| Sessão | Cookie `sicop_session`, `HttpOnly`, `SameSite=Lax`, duração de 7 dias |
| Rotas principais | `/api/auth/*`, `/api/registros`, `/api/pagamentos`, `/api/documentos` |
| Testes | Teste de renderização e suíte de release em `tests/` |

## 2. Acesso e segurança

O formulário original não usa matrícula como rótulo. Ele usa o campo **Usuário**, com placeholder `tecnico1`, e envia `{ username, password }` para `POST /api/auth/login`. Ao autenticar, o servidor retorna o usuário público e grava a sessão no cookie.

| Regra | Comportamento confirmado |
|---|---|
| Usuários padrão | `admin` (papel Administrador), `tecnico1` e `tecnico2` (papel Técnico) |
| Senhas padrão | O código armazena somente hashes e sais; a senha em texto não foi inferida nem deve ser inventada |
| Senha temporária | Usuários padrão iniciam com `mustChangePassword = true` |
| Primeiro acesso | O dashboard é bloqueado até concluir a troca de senha |
| Nova senha | Mínimo de 10 caracteres; deve ser diferente da senha atual |
| Sessão inválida | A API retorna `Faça login para continuar.` |
| Credencial inválida | A API retorna `Usuário ou senha inválidos.` |
| Logout | Remove a sessão e limpa o cookie |

> A tela correta de login deve preservar **Usuário**, **Senha**, a mensagem de erro da API e o botão **Entrar**. A substituição do rótulo por “Matrícula” no preview atual foi uma divergência e deve ser corrigida na reconstrução.

## 3. Estados obrigatórios da aplicação

1. A aplicação verifica a sessão atual em `/api/auth/me` e apresenta o estado **Carregando acesso** enquanto aguarda.
2. Sem sessão, apresenta o painel de login.
3. Com senha temporária, apresenta **Primeiro acesso** e exige senha atual, nova senha e confirmação.
4. Com senha regular, abre o shell operacional.
5. Dentro do shell, o usuário pode abrir a troca de senha novamente em modo **Segurança**.

## 4. Shell operacional

O topo mostra a identidade SIGA SEMED, o nome e o papel do usuário autenticado, além de ações para: trocar senha, atualizar dados, imprimir relatório, exportar CSV e sair.

O resumo contém cinco indicadores: **Registros**, **Ativos**, **A vencer**, **Vencidos** e **Saldo a pagar**. A área de trabalho possui dois módulos principais: **Contratos e Processos** e **Documentos**.

## 5. Contratos e Processos

| Capacidade | Regras e dados preservados |
|---|---|
| Tipos | `Contrato` e `Processo` |
| Campos | Número, objeto/assunto, parte interessada, setor, responsável, valor, categoria financeira, próximos pagamentos, início, vencimento, situação, observações e dias de alerta |
| Obrigatórios | Número e objeto/assunto |
| Financeiro | Categorias `Sem controle`, `Contrato geral` e `Aluguel` |
| Processos | Sempre usam `Sem controle` no financeiro |
| Aluguel | Pode ser identificado pela categoria ou por texto de aluguel/arredamento no setor/objeto |
| Pagamentos | Cada baixa contém data, valor e observação; atualiza valor pago, saldo e, opcionalmente, próximo vencimento |
| Operações | Listar, criar, editar, excluir registro, incluir e remover baixa |
| Exclusão | Exige confirmação textual `EXCLUIR` na API |
| Filtros | Busca textual, tipo, situação/alerta e setor |
| Prioridade | A listagem prioriza registros não concluídos e vencimentos mais próximos |

Os valores de entrada são normalizados e os textos administrativos são convertidos para caixa alta. O saldo é derivado do valor total menos as baixas registradas.

## 6. Documentos

| Capacidade | Regras e dados preservados |
|---|---|
| Tipos | `Ofício`, `Memorando` e `Despacho` |
| Campos | Número, modelo (`templateKey`), assunto, destino, destinatário, vínculo, responsável, data, prazo, situação, resumo e observações |
| Operações | Listar, criar, editar e excluir |
| Exclusão | Exige confirmação textual `EXCLUIR` na API |
| Filtros | Busca textual, tipo e situação/alerta |
| Ordenação | Concluídos/cancelados ficam depois; itens com prazo são priorizados por data de vencimento |
| Texto | Campos administrativos são normalizados para caixa alta |

Na interface, cada documento tem detalhe expansível, prévia textual e ações de edição/exclusão. A prévia deve continuar vinculada aos campos do documento, sem se tornar conteúdo estático decorativo.

## 7. Implicações para a reconstrução do zero

1. **Backend real:** a reconstrução deve manter autenticação, D1, sessão, CRUD e regras de cálculo; um preview local com dados soltos não substitui essa camada.
2. **Frontend renovado:** layout, tipografia, responsividade, gráficos e hierarquia visual podem ser redesenhados, desde que não removam campos, ações, validações ou ordem operacional.
3. **Fidelidade de acesso:** o novo login deve usar `Usuário` e `Senha` até que haja uma alteração funcional explícita no backend para matrícula.
4. **Módulos prioritários:** acesso/primeiro acesso, Contratos e Processos, pagamentos e Documentos são o núcleo mínimo do novo projeto.
5. **Papel administrativo:** o papel `Administrador` existe no dado do usuário; permissões específicas além da identificação no topo não foram confirmadas nas partes lidas e não devem ser inventadas.
