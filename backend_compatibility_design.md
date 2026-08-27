# Estratégia de persistência real compatível

> **Escopo da primeira etapa.** O SIGA SEMED continuará exibindo a mesma interface, a mesma tela de login e os mesmos fluxos. A mudança será exclusivamente no destino de persistência dos dados de negócio. O modo demonstrativo em `localStorage` continuará disponível se o banco não estiver configurado ou acessível.

## Decisão de arquitetura

| Camada | Modo demonstrativo atual | Modo com banco configurado |
|---|---|---|
| Login visual | Formulário institucional atual | Mesmo formulário institucional atual |
| Sessão | Sessão local do navegador | Cookie de sessão de domínio, `httpOnly`, assinado e validado pelo servidor |
| Dados de negócio | Repositório local versionado | Drizzle/MySQL por procedimentos tRPC protegidos |
| Queda de banco | Não se aplica | Retorno controlado ao repositório local, sem apagar ou copiar registros automaticamente |
| Dados reais | Não utilizados | Não incluídos nesta etapa |

## Ponte de sessão de domínio

O formulário de matrícula/CPF e senha não será redesenhado. No modo de banco real, ele enviará os mesmos campos para um procedimento de autenticação do domínio SIGA; o servidor verificará o usuário de domínio, criará uma sessão expirada e retornará somente os dados de perfil já consumidos pelo shell. O identificador do usuário não será aceito isoladamente como credencial de operações tRPC.

A sessão será representada por cookie `httpOnly`, seguro e de escopo restrito. O servidor resolverá o perfil, a situação e as permissões do usuário antes de liberar a rota de negócio. O token local atual é estritamente um recurso do modo demonstrativo e não será promovido a credencial compartilhada.

## Regras de compatibilidade

Os tipos públicos das páginas serão preservados. A adaptação ocorrerá na camada de repositório, com carregamento assíncrono e atualização otimista apenas quando a sessão de domínio e o banco estiverem disponíveis. Quando esse modo não estiver ativo, os métodos aprovados em `sigaLocalStore.ts` continuarão sendo executados sem mudanças de tela.

Não será feita cópia automática de `localStorage` para MySQL, nem leitura de dados reais do D1. Contas demonstrativas usadas no preview serão tratadas como dados de teste próprios; usuários reais só poderão existir por processo administrativo posterior, com hash de senha forte no servidor.

## Ordem da primeira leva

1. Criar tabelas de usuários de domínio, sessões e permissões de domínio, além dos Cadastros Gerais já modelados.
2. Criar o procedimento de sessão de domínio e aplicar autorização por módulo em Cadastros Gerais.
3. Integrar Cadastros Gerais ao repositório assíncrono com fallback local.
4. Migrar Agenda, Mensagens, confirmações de leitura e Lembretes pelo mesmo mecanismo.
5. Validar banco presente, banco indisponível, autorização, reidratação e preservação da interface.

## Limites mantidos

- Não haverá migração de dados, usuários ou documentos reais do Cloudflare D1.
- Não haverá alteração visual no login, nas rotas, nos textos, nas permissões de negócio aprovadas ou nos fluxos.
- Senhas e tokens não serão registrados em documentação, seed, log, commit ou resposta ao usuário.
