# Execução do frontend no previewer

- [x] Transferir para o preview as áreas funcionais de contratos/processos e documentos, mantendo a mesma sequência visual.
- [x] Implementar abas, abertura de cadastro, filtros, accordions, ações de detalhe e estados de alerta como interações reais de frontend.
- [x] Adicionar os painéis analíticos e o refinamento visual sem remover campos, ações ou blocos existentes.
- [x] Validar a página em desktop e celular, incluindo os estados abertos dos accordions e a troca entre módulos.
- [x] Criar checkpoint e entregar o preview navegável com o resumo das alterações.

## Página de login institucional

- [x] Definir a composição da tela de acesso com identidade institucional e hierarquia de segurança.
- [x] Implementar os estados de entrada, visibilidade de senha, recuperação e carregamento no frontend React.
- [x] Validar a tela de acesso em desktop e celular no previewer.
- [x] Salvar checkpoint e entregar a página de login.

## Correção de fidelidade ao código original

- [x] Mapear matrícula, senha, recuperação, primeiro acesso e mensagens do login original.
- [x] Usar a imagem institucional enviada diretamente como referência e ativo do login.
- [x] Substituir o fluxo genérico pela sequência funcional original, preservando seus estados.
- [x] Validar em desktop e celular a tela corrigida e a transição após autenticação.
- [x] Salvar checkpoint e entregar a correção de fidelidade.

## Simplificação da área de acesso

- [x] Remover o símbolo operacional e os metadados do cabeçalho do formulário.
- [x] Reduzir o texto de apoio, mantendo apenas identificação, matrícula, senha, primeiro acesso e botão Entrar.
- [x] Validar a versão simplificada em desktop e celular.
- [x] Salvar checkpoint e entregar a simplificação.

## Painel de acesso essencial

- [x] Remover o título de boas-vindas do formulário.
- [x] Reposicionar os campos para uma composição de acesso mais limpa.
- [x] Validar a tela reduzida em desktop e celular.
- [x] Salvar checkpoint e entregar o ajuste final.

## Recomposição com barra lateral

- [x] Restaurar a barra lateral institucional à esquerda sobre a imagem de fundo atual.
- [x] Manter a folha clean de Matrícula, Senha e Entrar restrita à coluna direita.
- [x] Validar a composição bilateral em desktop e celular.
- [x] Salvar checkpoint e entregar a recomposição.

## Visualização progressiva do código original

- [x] Confirmar a sequência de módulos e estados disponíveis após o acesso.
- [x] Preparar a demonstração inicial de Contratos e Processos.
- [x] Validar a troca para Documentos e os detalhes expansíveis.
- [x] Apresentar a ordem de revisão dos módulos no previewer.

## Auditoria do repositório de referência

- [x] Arquivar esta frente: o repositório indicado não estava disponível; o primeiro pacote enviado permanece a única referência imutável.

## Repositório alternativo de referência

- [x] Arquivar esta frente: o repositório estava vazio e foi destinado ao novo sistema, não como fonte de referência.

## Reconstrução do zero baseada no código funcional original

- [x] Consolidar autenticação, primeiro acesso e regras de usuário do código original.
- [x] Consolidar contratos, processos, financeiro, documentos, filtros e exportação.
- [x] Definir o escopo mínimo do novo repositório e sua arquitetura.
- [x] Completar os fluxos preservados com frontend elaborado.
- [x] Validar aderência funcional das páginas em desktop, mobile e com os estados expansíveis.

## Referência imutável e banco original

- [x] Documentar como o banco Cloudflare D1 é criado e acessado no código de referência.
- [x] Mapear tabelas, índices, sementes e relações funcionais da referência.
- [x] Garantir que o código antigo permaneça somente leitura durante a reconstrução.
- [x] Definir a arquitetura futura com Cloudflare D1 novo, independente e sem migração de dados antigos.

## Primeiro incremento: páginas fiéis à referência

- [x] Mapear as páginas e os estados reais do código de referência.
- [x] Construir Login por Usuário/Senha e Primeiro acesso sem integração de banco nesta etapa.
- [x] Construir o shell operacional, Contratos e Processos e Documentos com os campos reais.
- [x] Validar navegação e responsividade sem alterar o código de referência.
- [x] Documentar a integração Cloudflare D1 para a próxima fase.

## Limite funcional desta fase de páginas

- [x] Implementar campos, navegação, filtros, accordions e ações visuais sem acessar o banco antigo.
- [x] Adicionar no módulo Contratos e Processos o filtro visual específico de setor.
- [x] Completar o financeiro visual do contrato com formulário de baixa, histórico de pagamentos e valores demonstrativos derivados das baixas locais.
- [x] Adicionar confirmação visual `EXCLUIR` para registros e documentos, antes da fase D1.
- [x] Revalidar desktop e mobile e atualizar as notas, usando exclusivamente Usuário/Senha no fluxo atual.
- [x] Arquivar a conexão com Cloudflare D1: por decisão atual, o novo sistema não acessará qualquer banco externo.

## Simulação local compatível com a referência

- [x] Criar modelo local compartilhado com estruturas compatíveis de usuários, sessões, registros, pagamentos e documentos.
- [x] Implementar adaptador local de repositórios que preserve os campos, relações e cálculos da referência sem acessar D1.
- [x] Substituir dados estáticos e avisos de ações por operações simuladas de criar, editar, excluir, baixar, filtrar e exportar.
- [x] Documentar o mapeamento entre a simulação local e as tabelas/regras do código de referência.
- [x] Implementar usuários e sessões locais com primeiro acesso e alteração de senha simulados, sem guardar senha real.
- [x] Validar os fluxos locais e a compatibilidade estrutural com testes automatizados.
- [x] Cobrir em testes o ciclo CRUD de registros/documentos, baixas, exclusão confirmada, armazenamento local e ciclo de primeiro acesso/sessão.
- [x] Testar o ciclo do repositório com persistência real no `localStorage` após operações locais.
- [x] Testar a exclusão integrada, bloqueando remoção sem `EXCLUIR` e aplicando-a com a confirmação correta.
- [x] Testar primeiro acesso persistido com novo login local após recarga do repositório.
- [x] Testar o adaptador usado pela UI com `window.localStorage` real após criar, editar, baixar, excluir e reidratar dados.
- [x] Cobrir o hook real com bloqueio sem `EXCLUIR`, reentrada após Primeiro acesso e reidratação do `localStorage`.

## Repositório do novo sistema

- [x] Publicar o primeiro incremento do novo frontend em `alessandrobarra7/SIGA-SEMED` no commit remoto `6135fcbb7ee0158de6d278beb1d7a5d89a53f444`.

## Correção de acesso demonstrativo

- [x] Concluir a verificação manual de login dos perfis locais `admin`, `tecnico1` e `tecnico2` no preview.
- [x] Adicionar regressão automatizada para o acesso demonstrativo e validar no preview.

## Fidelidade estrutural ao código de referência

- [x] Reavaliar o agrupamento, ordem e geografia dos componentes do aplicativo original.
- [x] Mapear as diferenças estruturais entre o shell original e o preview atual.
- [x] Reorganizar as páginas do preview conforme a composição real da referência, sem mudar campos ou fluxos.
- [x] Validar a nova organização em desktop e celular e preservar os fluxos locais já implementados.

## Nova referência operacional enviada

- [x] Extrair o pacote `siga-semed-main(1).zip` em diretório somente leitura e registrar sua estrutura.
- [x] Manter a referência em execução isolada e somente leitura; nenhum fluxo externo de escrita foi executado durante o levantamento.
- [x] Abrir e registrar as páginas internas de Unidades Escolares, Educa Paço, Recursos Humanos, Nutrição, Estoque, Frota e Usuários, sem alterar dados.
- [x] Abrir e registrar abas e subfluxos internos seguros, incluindo auditoria do estoque e navegação interna de Agricultura Familiar.
- [x] Consolidar o mapa final de reprodução, confirmando explicitamente a permanência do login atual do preview como oficial.
- [x] Documentar a reprodução validada antes de iniciar novas mudanças no preview, preservando a página de login atual como oficial.
- [x] Aguardar autorização expressa para iniciar a reprodução local do shell operacional amplo, sem integração externa.

## Reprodução visual autorizada — shell operacional

- [x] Preservar a página de login oficial e preparar o shell autenticado com dados demonstrativos locais.
- [x] Implementar centro de boas-vindas com transição explícita para o painel, sem envio externo de comunicados.
- [x] Implementar cabeçalho institucional, contexto de usuário, ações locais de conta e barra lateral ordenada conforme a referência.
- [x] Implementar a visão Início com agenda, prazos, anotações e indicadores demonstrativos, sem alterar os fluxos existentes de contratos e documentos.
- [x] Validar desktop, mobile, testes automatizados e build do primeiro incremento do shell.
- [x] Validar em viewport mobile o fluxo final de login, boas-vindas, Início, submenus e acesso a Contratos/Documentos sem atalhos temporários.
- [x] Salvar checkpoint e apresentar o primeiro incremento visual do shell.

## Reprodução visual autorizada — Gestão e Cadastros

- [x] Implementar a central de Gestão com Minhas tarefas, Alertas, Relatórios, Anexos e Aprovações em estrutura local.
- [x] Implementar Cadastros com páginas elaboradas para Escolas, Núcleos, Prédios Administrativos e Biblioteca, usando apenas dados demonstrativos.
- [x] Preservar o retorno a Início, Contratos e Documentos pela barra lateral sem alterar seus fluxos locais.
- [x] Criar regressões de navegação, validar desktop/mobile, testes, checagem e build deste grupo.
- [x] Salvar checkpoint e apresentar o incremento de Gestão e Cadastros.
- [x] Substituir painéis de Relatórios, Anexos e Aprovações por interações locais completas, sem textos de continuidade.
- [x] Implementar criação local de cadastros demonstrativos para os quatro contextos, sem mensagens de funcionalidade futura.

## Publicação autorizada do estado atual

- [x] Revisar o estado Git e confirmar que não há credenciais, dados externos ou artefatos temporários no envio.
- [x] Validar os testes e o build do estado atual antes do envio remoto.
- [x] Criar commit descritivo e enviar o frontend atual ao repositório remoto autorizado.
- [x] Confirmar o hash remoto da publicação ao usuário.
- [x] Revalidar a permissão GitHub após a autorização do usuário e repetir o envio do commit preparado.
- [x] Usar a credencial fornecida somente em memória para o envio, sem persistência em arquivos, remotos ou commits.
- [x] Recomendar a revogação da credencial após confirmar o hash remoto.

## Atualização do preview para novas modificações

- [x] Confirmar no preview o estado mais recente do shell, Gestão e Cadastros já implementados.
- [x] Revisar e concluir no checklist os fluxos locais implementados sem placeholders.
- [x] Validar testes, tipos, build e responsividade da base atual.
- [x] Salvar novo checkpoint do preview antes das próximas modificações.
- [x] Apresentar a base atualizada e alinhar o próximo grupo de páginas a modificar.

## Especificação funcional — Usuários, perfis e permissões

- [x] Preservar integralmente a aparência oficial do checkpoint `c8d87f2f` durante todas as alterações funcionais.
- [x] Comparar o relatório de usuários recebido com `sigaLocalStore.ts`, o fluxo de login e o shell atuais.
- [x] Consolidar os seis perfis: Administrador, Técnico, Gestor Escolar, Secretário Escolar, Auditoria Externa e Contadora Municipal.
- [x] Definir as permissões hierárquicas por módulo e submódulo, incluindo as regras específicas de RH e Estoque.
- [x] Definir cadastro, edição, ativação, desativação, pesquisa, vínculo escolar, vínculo com servidor e senha provisória local.
- [x] Definir bloqueios de leitura e escrita por perfil e a mensagem de acesso restrito no shell.
- [x] Definir registro local de auditoria para criação, alteração de permissões e desativação de usuários.
- [x] Apresentar a primeira entrega funcional proposta e obter autorização antes de alterar o módulo Usuários.

## Implementação autorizada — domínio local de Usuários

- [x] Evoluir o esquema local para uma nova versão sem perder registros, documentos, pagamentos ou sessões existentes.
- [x] Criar tipos fechados para os seis perfis e para as chaves hierárquicas de módulos e submódulos.
- [x] Criar o modelo local de permissões com concessão, responsável e data/hora.
- [x] Criar o modelo local de auditoria administrativa sem armazenar senha provisória nem CPF completo.
- [x] Migrar Administrador, Técnico 1 e Técnico 2 para o novo modelo com permissões coerentes.
- [x] Implementar políticas puras de leitura, escrita, escopo escolar e acesso ao módulo Usuários.
- [x] Preservar a API atual de login e o funcionamento de Contratos e Documentos durante a migração.
- [x] Cobrir perfis, permissões, auditoria, migração e compatibilidade regressiva com testes Vitest.
- [x] Confirmar por comparação visual que nenhuma aparência do checkpoint `c8d87f2f` foi alterada.
- [x] Salvar checkpoint do primeiro bloco funcional e apresentar o resultado.

## Correção funcional — página Usuários e login por matrícula

- [x] Substituir o placeholder de Usuários por uma página completa dentro da aparência oficial atual.
- [x] Exibir indicadores, pesquisa instantânea e filtros por perfil, situação, tipo de login e permissão.
- [x] Implementar cadastro local com nome, matrícula ou CPF, perfil, situação, unidade escolar, vínculo RH e permissões condicionais.
- [x] Implementar edição, ativação/desativação, redefinição de senha provisória e encerramento de sessões locais.
- [x] Aplicar validação de duplicidade de matrícula/CPF e obrigatoriedade de unidade para Gestor/Secretário Escolar.
- [x] Aplicar perfis automáticos e permissões editáveis somente para Técnico.
- [x] Implementar consulta do histórico local de auditoria por usuário.
- [x] Fazer o login local aceitar matrícula como identificador principal, preservando o desenho oficial da página de acesso.
- [x] Restringir a administração de Usuários ao perfil Administrador e bloquear operações não autorizadas.
- [x] Validar desktop, mobile, testes, TypeScript e build sem modificar a identidade visual aprovada.
- [x] Salvar checkpoint e apresentar a página Usuários funcional no preview.
- [x] Implementar e validar filtros funcionais por tipo de login e por permissão na página Usuários.
- [x] Adicionar ao cadastro e à edição o fluxo explícito de acesso por CPF, com validação e testes.
- [x] Bloquear a edição manual de permissões para perfis diferentes de Técnico e aplicar permissões automáticas no domínio local.

## Reprodução funcional autorizada — Nutrição

- [x] Observar novamente, em modo somente leitura, Planejamento semanal e análise de saldos no sistema original.
- [x] Observar novamente, em modo somente leitura, Planejamento anual da alimentação e suas etapas internas.
- [x] Registrar campos, filtros, indicadores, abas, listas, estados e sequência operacional sem copiar dados reais.
- [x] Modelar planejamento semanal, análise de saldos e planejamento anual no armazenamento local, sem D1.
- [x] Implementar a página Nutrição dentro da aparência oficial atual, sem placeholders ou funcionalidades futuras.
- [x] Implementar operações locais coerentes com os fluxos observados, sem executar ações no sistema original.
- [x] Aplicar leitura e escrita de Nutrição conforme as permissões dos seis perfis.
- [x] Cobrir o módulo com testes de fluxo, persistência, permissões e regressão.
- [x] Validar desktop, mobile, TypeScript e build, preservando a identidade visual aprovada.
- [x] Conectar dias letivos e ofertas aos cálculos mensais de necessidade, cobertura e compra/contratação do planejamento anual.
- [x] Cobrir por regressão o efeito dos dias letivos nos resultados anuais e revalidar a interface anual.
- [x] Salvar checkpoint e apresentar o módulo Nutrição funcional no preview.
