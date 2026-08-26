# Especificação funcional — Usuários, perfis e permissões

**Status:** proposta para autorização de implementação  
**Referência visual:** checkpoint `c8d87f2f`  
**Persistência nesta etapa:** `localStorage`, sem Cloudflare D1 e sem dados externos

## 1. Decisão de produto

A aparência atual do SIGA SEMED deve permanecer inalterada. O trabalho desta frente será exclusivamente funcional: cadastro e manutenção de usuários, perfis, permissões, restrições de acesso, auditoria local e comportamento da navegação. O item **Usuários** já existente no menu será preenchido dentro do mesmo shell, usando os mesmos padrões visuais, espaçamentos, cores, tipografia e componentes do checkpoint oficial.

O relatório distingue corretamente dois cenários. O código-base congelado possui somente os papéis **Administrador** e **Técnico**, sem autorização por módulo. O modelo-alvo documentado acrescenta seis perfis e permissões hierárquicas. A implementação proposta adotará o modelo-alvo, mas continuará sendo uma simulação local compatível, sem copiar banco, contas, CPF, matrícula ou qualquer dado real.

## 2. Comparação com a base atual

| Tema | Base atual do preview | Necessidade funcional |
|---|---|---|
| Usuários | Três usuários demonstrativos locais | CRUD administrativo completo e pesquisa |
| Perfis | Campo `role` livre com Administrador/Técnico | Lista fechada com seis perfis |
| Login | Pesquisa somente por `username` | Resolver matrícula ou CPF normalizado conforme o perfil |
| Permissões | Não existem chaves por módulo | Permissões hierárquicas por módulo e submódulo |
| Navegação | Todos os itens são acessíveis | Itens visíveis, com bloqueio e mensagem quando não autorizados |
| Escrita | Operações locais não verificam perfil | Política de leitura/escrita aplicada em toda mutação local |
| Escopo escolar | Não existe vínculo com unidade | Gestor/Secretário restritos à unidade vinculada |
| Auditoria | Não existe histórico de administração | Log local para criação, edição, permissões e desativação |
| Senha provisória | Primeiro acesso já existe | Geração provisória local e troca obrigatória preservada |
| Sessão | Validade geral de sete dias | Acrescentar inatividade local de dez minutos e sincronização entre abas |

## 3. Perfis oficiais

| Perfil | Tipo de login | Escopo de leitura | Escopo de escrita | Acesso a Usuários |
|---|---|---|---|---|
| Administrador | Matrícula/usuário | Todos os módulos | Todos os módulos | Sim |
| Técnico | Matrícula/usuário | Somente módulos concedidos | Somente módulos concedidos | Não, salvo regra futura explícita |
| Gestor Escolar | Matrícula/usuário | Mapa, Unidade Executora e turmas da escola vinculada | Nenhuma | Não |
| Secretário Escolar | Matrícula/usuário | Mapa, Unidade Executora e turmas da escola vinculada | Nenhuma | Não |
| Auditoria Externa | CPF | Todos os módulos operacionais | Nenhuma | Não |
| Contadora Municipal | CPF | Todos os módulos operacionais | Somente Financeiro | Não |

**Nutricionista não será perfil de login.** Permanecerá como cargo de servidor referenciado por fluxos de Estoque quando o módulo de Recursos Humanos for implementado.

## 4. Modelo local proposto

O banco local deverá evoluir para uma nova versão de esquema, com migração segura dos três usuários demonstrativos existentes. Nenhuma senha real será armazenada.

### 4.1 Usuário

O tipo `SemedLocalUser` deverá acrescentar `profile`, `loginType`, `cpfMasked`, `schoolUnitId`, `serverRegistrationId`, `provisionalPasswordIssuedAt` e `lastActivityAt`. O campo atual `role` será mantido apenas durante a migração e convertido para `profile`.

### 4.2 Permissão

Será criada uma coleção `semedUserPermissions` com `id`, `userId`, `moduleKey`, `granted`, `grantedBy` e `grantedAt`. As chaves iniciais serão:

| Grupo | Chaves |
|---|---|
| Base | `inicio`, `gestao`, `cadastros_gerais`, `contratos`, `documentos`, `financeiro` |
| Unidades | `unidades_escolares`, `unidades.mapa`, `unidades.uex`, `unidades.turmas` |
| Educa Paço | `educa_paco` |
| Recursos Humanos | `rh`, `rh.cadastro_servidores`, `rh.ficha_financeira`, `rh.holerite`, `rh.frequencia`, `rh.relatorios` |
| Nutrição | `nutricao`, `nutricao.planejamento_semanal`, `nutricao.planejamento_anual` |
| Estoque | `estoque`, `estoque.industrializado`, `estoque.agricultura_familiar`, `estoque.kit_aluno`, `estoque.categorias`, `estoque.relatorios` |
| Frota | `frota`, `frota.veiculos`, `frota.abastecimento`, `frota.manutencao`, `frota.ocorrencias`, `frota.relatorios` |
| Administração | `usuarios` |

### 4.3 Auditoria

Será criada a coleção `semedUserAuditLog` com identificador, usuário afetado, ação, resumo das alterações, autor e data/hora. O log deverá registrar criação, edição cadastral, concessão ou remoção de permissão, ativação, desativação e emissão de nova senha provisória. O log não armazenará a senha provisória nem CPF completo.

## 5. Regras funcionais obrigatórias

1. **Administrador:** recebe automaticamente todas as permissões. O bloco de permissões aparece somente para consulta, sem edição manual.
2. **Técnico:** começa sem permissões de módulo e recebe seleção individual, incluindo subpermissões de RH e Estoque.
3. **Gestor e Secretário Escolar:** exigem unidade vinculada e recebem automaticamente somente leitura de mapa, Unidade Executora e turmas dessa unidade.
4. **Auditoria Externa:** exige CPF como login, recebe leitura integral dos módulos operacionais e não pode gravar.
5. **Contadora Municipal:** exige CPF, recebe leitura integral e escrita exclusivamente em Financeiro.
6. **Senha provisória:** todo novo usuário nasce com troca obrigatória no primeiro acesso. A senha é gerada pelo sistema e exibida uma única vez ao administrador.
7. **Duplicidade:** matrícula/login e CPF normalizado devem ser únicos.
8. **Usuário inativo:** não autentica e suas sessões locais são encerradas.
9. **Acesso negado:** o módulo permanece visível no menu com estado restrito; ao clicar, exibe `Usuário sem permissão para acessar este módulo.`
10. **Defesa funcional:** cada operação de criação, edição, exclusão ou baixa deverá consultar a política de escrita, além do bloqueio visual.

## 6. Tela Usuários sem mudança de aparência

A página deverá seguir a composição já aprovada: cabeçalho do módulo, resumo em cartões, filtros, lista e painel de cadastro no mesmo padrão de Gestão e Cadastros.

| Área | Funcionalidade |
|---|---|
| Resumo | Total, ativos, inativos, primeiro acesso pendente e perfis externos |
| Pesquisa | Nome, matrícula/login, CPF mascarado, perfil, cargo, lotação, permissão, INEP e unidade |
| Filtros | Perfil, situação, tipo de login, unidade e permissão |
| Lista | Nome, identificador mascarado, perfil, vínculo, situação e último acesso |
| Cadastro/Edição | Nome, matrícula ou CPF, perfil, situação, unidade, servidor vinculado e permissões condicionais |
| Segurança | Gerar nova senha provisória, forçar troca no próximo acesso e encerrar sessões |
| Auditoria | Histórico local das alterações administrativas |

## 7. Comportamento do login oficial

O desenho da página de login permanecerá o mesmo. O campo visual **Usuário** passará a aceitar internamente matrícula/usuário ou CPF. O valor será normalizado antes da busca; CPF poderá ser informado com ou sem pontuação. Mensagens de falha não revelarão se o identificador existe, se está inativo ou qual perfil possui.

## 8. Limite de segurança desta etapa

Como o usuário determinou que não haverá conexão com D1 ou outro banco, as regras serão implementadas no repositório local e exercitadas por testes. Isso reproduz fielmente o comportamento funcional para demonstração, mas **não equivale a uma barreira de segurança de produção**, pois dados em `localStorage` podem ser alterados pelo próprio navegador. Quando houver backend real, as mesmas políticas deverão ser reaplicadas no servidor antes de qualquer leitura ou escrita.

## 9. Primeira entrega recomendada

A implementação deve ocorrer em quatro blocos, mantendo a aparência atual:

1. **Domínio local e migração:** perfis, permissões, auditoria, usuários demonstrativos e migração do esquema atual.
2. **Política de acesso:** cálculo de módulos visíveis, bloqueios, somente leitura e proteção das mutações existentes.
3. **Página Usuários:** pesquisa, filtros, cadastro, edição, ativação/desativação, senha provisória e auditoria.
4. **Validação:** matriz automatizada dos seis perfis, testes negativos de escrita, login por CPF/matrícula e responsividade.

Nenhuma funcionalidade deve ser conectada a dados reais, APIs externas ou Cloudflare D1 nesta etapa.
