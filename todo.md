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

## Reprodução funcional autorizada — Estoque

- [x] Observar novamente em modo somente leitura as categorias Industrializado, Kit do Aluno, Alimentação Escolar, Limpeza, Expediente e Relatórios.
- [x] Observar novamente em modo somente leitura as abas de materiais, movimentações, auditoria, saldos e conferências do Estoque.
- [x] Registrar categorias, campos, filtros, indicadores, abas, estados e sequência operacional sem copiar dados reais.
- [x] Modelar catálogo, saldos, movimentações, conferências e relatórios no armazenamento local, sem D1.
- [x] Implementar o módulo Estoque dentro da aparência oficial atual, sem placeholders ou funcionalidades futuras.
- [x] Aplicar leitura e escrita de Estoque conforme as permissões dos seis perfis.
- [x] Cobrir Estoque com testes de saldo, movimentação, auditoria, persistência, permissões e regressão.
- [x] Validar desktop, mobile, TypeScript e build preservando a identidade visual aprovada.
- [x] Salvar checkpoint e apresentar o módulo Estoque funcional no preview.

## Publicação autorizada — Usuários, Nutrição e Estoque

- [x] Revisar o estado Git e confirmar que não há credenciais, dados externos ou arquivos temporários na atualização.
- [x] Validar testes, checagem de tipos e build da versão atual antes do envio.
- [x] Criar commit descritivo e enviar os módulos Usuários, Nutrição e Estoque ao repositório autorizado.
- [x] Confirmar o hash remoto da publicação ao usuário.
- [x] Usar a credencial fornecida somente em memória para o envio, sem persistência em arquivos, remotos ou commits.
- [x] Recomendar a revogação da credencial após confirmar o hash remoto.

## Documentação de andamento do projeto

- [x] Consolidar em um documento único as decisões de produto, segurança e arquitetura já tomadas.
- [x] Registrar os módulos reproduzidos, seus fluxos locais, validações e checkpoints correspondentes.
- [x] Registrar os módulos ainda pendentes de reprodução funcional, em ordem recomendada.
- [x] Incluir o protocolo obrigatório de observação somente leitura da referência e de uso de dados demonstrativos locais.
- [x] Revisar o documento, atualizar o checklist e salvar checkpoint da documentação.

## Reprodução funcional autorizada — Recursos Humanos

- [x] Observar em modo somente leitura Cadastro de Servidores, Ficha Financeira, Holerite, Frequência e movimento e Relatórios na referência.
- [x] Registrar campos, filtros, indicadores, abas, estados, permissões e ordem operacional sem copiar dados pessoais, valores ou documentos reais.
- [x] Modelar servidores demonstrativos, competências, fichas financeiras, holerites, frequência e auditoria no armazenamento local, sem D1.
- [x] Implementar Recursos Humanos dentro da aparência oficial atual, sem placeholders ou funcionalidades futuras.
- [x] Aplicar leitura e escrita conforme os seis perfis, mantendo dados pessoais demonstrativos e minimizados.
- [x] Cobrir o módulo com testes de cadastro, competência, frequência, permissões, persistência e regressão.
- [x] Validar desktop, mobile, TypeScript e build preservando a identidade visual aprovada.
- [x] Salvar checkpoint e apresentar o módulo Recursos Humanos funcional no preview.

## Publicação autorizada — Recursos Humanos

- [x] Revisar o estado Git e confirmar que não há credenciais, dados externos ou arquivos temporários na atualização.
- [x] Validar testes, checagem de tipos e build da versão atual antes do envio.
- [x] Criar commit descritivo e enviar Recursos Humanos, migração v4, testes e documentação ao repositório autorizado.
- [x] Confirmar o hash remoto da publicação ao usuário.
- [x] Usar a credencial fornecida somente em memória para o envio, sem persistência em arquivos, remotos ou commits.
- [x] Recomendar a revogação da credencial após confirmar o hash remoto.

## Reprodução funcional autorizada — Unidades Escolares e Educa Paço

- [x] Observar em modo somente leitura Cadastro e Relatórios de Unidades Escolares na referência.
- [x] Observar em modo somente leitura Cadastro de Núcleos e Relatórios de Educa Paço na referência.
- [x] Registrar campos, filtros, indicadores, abas, estados, permissões e sequência operacional sem copiar dados de unidades, pessoas, contatos ou endereços reais.
- [x] Modelar unidades, núcleos, turmas, atividades e relatórios demonstrativos no armazenamento local, sem D1.
- [x] Implementar Unidades Escolares e Educa Paço dentro da aparência oficial atual, sem placeholders ou funcionalidades futuras.
- [x] Aplicar leitura e escrita conforme os seis perfis e o escopo de unidade escolar.
- [x] Cobrir os dois módulos com testes de cadastro, filtros, persistência, permissões e regressão.
- [x] Validar desktop, mobile, TypeScript e build preservando a identidade visual aprovada.
- [x] Salvar checkpoint e apresentar os dois módulos funcionais no preview.

## Publicação autorizada — Unidades Escolares e Educa Paço

- [x] Revisar o estado Git e confirmar que não há credenciais, dados externos ou arquivos temporários na atualização.
- [x] Confirmar testes, checagem de tipos e build da versão validada antes do envio.
- [x] Criar commit descritivo e enviar Unidades Escolares, Educa Paço, migração v5, testes e documentação ao repositório autorizado.
- [x] Confirmar o hash remoto da publicação ao usuário.
- [x] Recomendar a revogação da credencial exposta após a confirmação do envio.

## Verificação de autorização GitHub

- [x] Consultar convites pendentes da conta GitHub conectada para o repositório autorizado.
- [x] Aceitar convite pendente, se disponibilizado pelo proprietário do repositório (não aplicável: nenhuma solicitação pendente foi encontrada).
- [x] Confirmar a permissão de escrita e retomar o envio do commit preparado.

## Retomada autorizada da publicação

- [x] Verificar a nova autorização de escrita da integração GitHub.
- [x] Enviar o commit preparado de Unidades Escolares e Educa Paço ao repositório autorizado.

## Reprodução funcional autorizada — Financeiro ampliado

- [x] Observar em modo somente leitura os submódulos financeiros, filtros, indicadores e estados da referência.
- [x] Registrar campos, cálculos, permissões e sequência operacional sem copiar valores, processos, documentos ou identificadores reais.
- [x] Modelar orçamento, receitas, execução, fontes e relatórios com dados demonstrativos no armazenamento local, sem D1.
- [x] Implementar o Financeiro ampliado dentro da aparência oficial atual, sem placeholders ou funcionalidades futuras.
- [x] Aplicar permissões financeiras, validações e cálculos locais coerentes com os fluxos observados.
- [x] Cobrir o setor com testes de persistência, permissões, cálculos e regressão.
- [x] Validar desktop, mobile, TypeScript e build preservando a identidade visual aprovada.
- [x] Atualizar a documentação, salvar checkpoint e apresentar o setor funcional no preview.

## Publicação autorizada — Financeiro ampliado

- [x] Revisar o estado Git, o diff e a autorização de escrita antes do envio.
- [x] Criar commit descritivo com Financeiro ampliado, migração v6, testes e documentação.
- [x] Enviar a atualização para a branch principal do repositório autorizado.
- [x] Confirmar o hash remoto e recomendar a revogação de credenciais anteriormente expostas.

## Redesenho visual autorizado — identidade do SIGA SEMED

- [x] Receber as referências, elementos e prioridades visuais do usuário.
- [x] Mapear tokens visuais, componentes afetados e limites de preservação funcional.
- [x] Aplicar a nova identidade ao shell e aos componentes compartilhados sem alterar rotas, fluxos, permissões ou dados locais.
- [x] Adaptar as páginas existentes à nova identidade sem alterar comportamentos funcionais.
- [x] Validar desktop, mobile, acessibilidade, testes, TypeScript e build.
- [x] Documentar o redesenho, salvar checkpoint e apresentar o preview atualizado.

### Direção visual confirmada

- [x] Incorporar base clara, azul institucional profundo, verde como destaque, cartões brancos leves, tipografia humanizada e legendas mais claras.
- [x] Atualizar primeiro o login com composição institucional ilustrada, painel de acesso branco e novo logotipo fornecido.
- [x] Propagar a mesma identidade ao shell, navegação lateral, painéis, formulários, tabelas e indicadores sem alterar qualquer comportamento.

## Consulta de acessos demonstrativos

- [x] Verificar os usuários e perfis disponíveis no armazenamento local do preview.
- [x] Apresentar credenciais demonstrativas de navegação sem expor qualquer dado externo.

## Refinamento interno autorizado — login congelado

- [x] Congelar integralmente a tela de login aprovada, incluindo composição, cores, fontes, ilustração e comportamento.
- [x] Mapear painéis internos prioritários e elementos visuais a aprimorar.
- [x] Refinar somente shell autenticado, painéis, tabelas, formulários e indicadores sem alterar navegação, lógica, permissões ou dados locais.
- [x] Validar os fluxos internos em desktop e mobile, mantendo o login visualmente inalterado.
- [x] Documentar, salvar checkpoint e apresentar o refinamento interno.

## Reformulação editorial interna — referência municipal

- [x] Registrar a referência de composição interna com barra lateral clara, cabeçalho limpo, painel editorial, cartões coloridos, agenda e ações rápidas.
- [x] Preservar integralmente a tela de login, além de rotas, navegação, permissões, dados locais, cálculos e ações dos módulos.
- [x] Preparar a composição visual e os ativos municipais para uso exclusivo no ambiente autenticado.
- [x] Reformular barra lateral, cabeçalho e painel inicial sem alterar comportamentos.
- [x] Harmonizar os módulos internos e validar desktop, mobile, testes, TypeScript e build.
- [x] Documentar, salvar checkpoint e apresentar o novo ambiente interno.

## Ajuste visual solicitado — remoção de imagem fotográfica

- [x] Remover a imagem municipal fotográfica do ambiente autenticado, incluindo barra lateral, boas-vindas e painel inicial.
- [x] Preservar a tela de login congelada e todos os fluxos funcionais durante o ajuste.
- [x] Validar o ambiente interno limpo, documentar e salvar checkpoint.

## Publicação autorizada — nova aparência interna

- [x] Revisar o estado Git, os arquivos visuais e a autorização de escrita antes do envio.
- [x] Criar commit descritivo com o login congelado, a reformulação interna e a remoção do banner fotográfico.
- [x] Enviar a atualização visual para a branch principal do repositório autorizado.
- [x] Confirmar o hash remoto e orientar sobre segurança de credenciais.

## Reprodução funcional autorizada — Configurações institucionais

- [x] Observar em modo somente leitura as seções, formulários, controles e permissões de Configurações na referência.
- [x] Registrar campos, regras, estados e sequência operacional sem copiar dados, contatos, chaves, documentos ou identificadores reais.
- [x] Modelar preferências e parâmetros demonstrativos no armazenamento local, sem D1 ou serviços externos.
- [x] Implementar Configurações institucionais na identidade visual atual, sem alterar login, navegação ou fluxos existentes.
- [x] Aplicar permissões, cobrir persistência e regressão com testes, e validar desktop, mobile, TypeScript e build.
- [x] Documentar a entrega, salvar checkpoint e apresentar o módulo funcional no preview.

## Escopo confirmado — novo módulo institucional demonstrativo

- [x] Criar um módulo novo de configurações por autorização explícita do usuário, já que a referência não possui uma área institucional própria.
- [x] Definir parâmetros locais para identificação institucional, exercício, comunicações, segurança e auditoria, sem serviços ou credenciais externas.
- [x] Restringir leitura e escrita das configurações ao Administrador, preservando os demais perfis em modo protegido.

## Publicação autorizada — Configurações institucionais

- [x] Revisar o estado Git, os arquivos de migração v7, testes e a autorização de escrita antes do envio.
- [x] Criar commit descritivo com Configurações institucionais, migração v7, testes e documentação.
- [x] Enviar a atualização para a branch principal do repositório autorizado.
- [x] Confirmar o hash remoto e orientar sobre segurança de credenciais.

## Reprodução funcional autorizada — Frota

- [x] Observar em modo somente leitura veículos, abastecimento, manutenção, ocorrências, filtros, indicadores e relatórios na referência.
- [x] Registrar campos, regras, permissões e sequência operacional sem copiar placas, motoristas, valores, documentos ou identificadores reais.
- [x] Modelar veículos, movimentações, manutenções, ocorrências e relatórios demonstrativos no armazenamento local, sem D1 ou serviços externos.
- [x] Implementar Frota na identidade visual atual, sem alterar login, navegação, permissões ou fluxos existentes.
- [x] Cobrir permissões, persistência, validações e regressão com testes; validar desktop, mobile, TypeScript e build.
- [x] Documentar a entrega, salvar checkpoint e apresentar o módulo funcional no preview.

## Publicação autorizada — Frota e governança

- [x] Revisar o estado Git, a migração v8, os testes e a autorização de escrita antes do envio.
- [x] Criar commit descritivo com Frota, governança, correção de barra lateral, testes e documentação.
- [x] Enviar a atualização para a branch principal do repositório autorizado.
- [x] Confirmar o hash remoto e orientar sobre segurança de credenciais.

## Análise somente leitura — SIGASEMEDverificado.zip

- [x] Inventariar a estrutura, as tecnologias, manifestos e arquivos principais do pacote sem executar código.
- [x] Mapear módulos, modelos de dados, autenticação, permissões e fluxos somente pela leitura dos arquivos.
- [x] Comparar o pacote com o preview atual e apresentar recomendações sem copiar dados, credenciais ou documentos reais.

## Verificação de primeiro acesso e troca de senha

- [x] Inspecionar a regra local de primeiro acesso e seu marcador de persistência sem alterar a aparência do login.
- [x] Corrigir repetição indevida da troca de senha, se confirmada (não aplicável: a persistência já está correta).
- [x] Validar a troca, o novo login e a reidratação do armazenamento local.

## Correção funcional — buscador global

- [x] Inspecionar o campo de busca, seus handlers e as visões disponíveis no shell autenticado.
- [x] Implementar resultados filtrados e navegação para os módulos e contextos já existentes.
- [x] Cobrir busca, seleção de resultado e preservação das permissões com testes.
- [x] Validar desktop, mobile, TypeScript e build sem alterar o login congelado.
- [x] Documentar a correção e salvar checkpoint.
- [x] Manter o buscador global disponível e utilizável no cabeçalho em largura móvel.

## Análise autorizada — perfis, setores e governança de dados

- [x] Mapear os perfis, as permissões e os setores funcionais implementados no código atual.
- [x] Identificar a origem, transformação, consumo e responsabilidade pelos dados demonstrativos de cada setor.
- [x] Avaliar lacunas de segregação de funções, validação, auditoria, dependências e governança entre módulos.
- [x] Apresentar recomendações priorizadas de mudanças efetivas sem alterar código nesta etapa.

## Implementação autorizada — base mínima de governança

- [x] Definir matriz local de ações por setor para preparar, revisar, aprovar, executar, cancelar e auditar, sem alterar o login ou os perfis existentes.
- [x] Criar referências estruturadas locais entre documentos, contratos, pagamentos e execuções financeiras, preservando os campos textuais atuais.
- [x] Criar auditoria transversal local para alterações críticas, com ator, ação, entidade, resumo e correlação de processo.
- [x] Aplicar os novos controles aos fluxos atuais de Contratos, Documentos e Financeiro sem quebrar operações existentes.
- [x] Cobrir as regras com testes de permissão, integridade referencial, auditoria e regressão; validar desktop, mobile, TypeScript e build.
- [x] Atualizar documentação, salvar checkpoint e apresentar a base de governança funcional.

## Correção de layout — barra lateral interna

- [x] Remover o comportamento travado da barra lateral, mantendo-a alinhada à altura e à rolagem natural do ambiente autenticado.
- [x] Preservar a tela de login congelada, a navegação, os submenus e os fluxos funcionais durante a correção.
- [x] Validar a barra lateral e o conteúdo interno em desktop e mobile antes de retomar a governança.

## Correção de publicação — barra lateral esquerda

- [x] Comparar a barra lateral no preview e na versão publicada para identificar a regra visual divergente.
- [x] Corrigir posicionamento, altura e responsividade da barra lateral sem alterar login, rotas, submenus ou fluxos.
- [x] Validar a correção nos dois ambientes e salvar um novo checkpoint publicado.

## Ampliação autorizada — Gestão complementar

- [x] Mapear as operações atuais de tarefas, alertas, relatórios, anexos e aprovações, incluindo permissões e dados locais usados.
- [x] Definir os fluxos complementares prioritários e seus estados demonstrativos sem alterar os módulos existentes.
- [x] Implementar operações locais e trilhas de auditoria compatíveis com as permissões atuais.
- [x] Cobrir os novos fluxos com testes e validar desktop, mobile, TypeScript e build, preservando o login congelado.
- [x] Atualizar a documentação, salvar checkpoint e apresentar a ampliação concluída.
- [x] Persistir tarefas com criação, edição, conclusão e vínculo contextual local.
- [x] Derivar alertas da Gestão a partir de tarefas, contratos e documentos sem expor dados externos.
- [x] Criar solicitações de aprovação, com decisão segregada, devolução fundamentada e auditoria local.
- [x] Registrar metadados de anexos locais vinculados a contextos existentes, sem upload ou transmissão de arquivos.
- [x] Preparar relatórios gerenciais locais com recorte por área e exportação CSV apenas no navegador.

## Aprimoramentos autorizados — Gestão e painel Início

- [x] Mapear os componentes, coleções locais e permissões afetados por filtros de tarefas, histórico de aprovações e indicadores do painel Início.
- [x] Definir os filtros por área, responsável e intervalo de prazo; o histórico por solicitação será derivado da auditoria transversal, sem nova coleção persistida.
- [x] Implementar filtros de tarefas por responsável e intervalo de prazo, sem alterar os dados fora do navegador.
- [x] Registrar e apresentar o histórico de decisões por solicitação, mantendo a segregação de aprovador e solicitante.
- [x] Integrar indicadores demonstrativos de Gestão ao painel Início, respeitando a leitura permitida ao perfil atual.
- [x] Cobrir os aprimoramentos com testes e validar desktop, mobile, TypeScript e build sem modificar o login congelado.
- [x] Atualizar documentação, salvar checkpoint e apresentar a nova versão publicada.

## Aprimoramentos autorizados — Gestão, devoluções e visão mensal

- [x] Mapear os fluxos, modelos locais e permissões necessários para filtros de status/prioridade, comentários de devolução e visão mensal de prazos.
- [x] Definir filtros combináveis; comentários restritos a solicitante e decisor em solicitações devolvidas; e visão mensal limitada aos prazos de Gestão legíveis pelo perfil.
- [x] Implementar filtros de tarefas por status e prioridade, mantendo a combinação com os filtros atuais.
- [x] Persistir comentários internos exclusivamente locais nas devoluções, com autoria, data/hora e auditoria.
- [x] Adicionar uma visão mensal demonstrativa de prazos no painel Início, respeitando a leitura de Gestão do perfil atual.
- [x] Cobrir persistência, permissões e regressões; validar desktop, mobile, TypeScript e build sem alterar o login congelado.
- [x] Atualizar documentação, salvar checkpoint e apresentar a versão publicada.

## Publicação autorizada — Gestão e visão mensal

- [x] Revisar o estado Git, o destino remoto e os arquivos alterados, excluindo credenciais e referências somente leitura.
- [x] Preparar um commit descritivo com a migração v10, Gestão, painel Início, testes e documentação.
- [x] Enviar a versão validada para a branch principal do repositório autorizado e confirmar o hash remoto.

## Avaliação recebida — orientações de correção

- [x] Confirmar a autenticação por matrícula ou CPF para todos os perfis e o cadastro com os dois identificadores coexistentes.
- [x] Confirmar recuperação defensiva da lista de usuários durante a normalização de bases locais migradas.
- [x] Confirmar restauração do status de veículo após cancelamento de manutenção e a visibilidade de ações de Frota conforme permissão.
- [x] Confirmar sinalização de pagamento acima do contratado no Financeiro, sem alterar a decisão de negócio sobre bloqueio.
- [x] Confirmar a validação combinada de dias trabalhados e faltas no RH.
- [x] Avaliar os quatro itens de manutenibilidade para encaminhamento posterior, sem ampliar o escopo sem validação.
- [x] Consolidar diagnóstico, impacto, testes necessários e escopo recomendado antes de alterar o preview.

## Correções recomendadas — aguardando confirmação

- [x] Permitir cadastro e login por matrícula ou CPF coexistentes em todos os perfis, com regressão de autenticação pelos dois identificadores.
- [x] Proteger a normalização da coleção de usuários e cobrir recuperação de base local parcialmente corrompida.
- [x] Restaurar a disponibilidade do veículo ao cancelar manutenção, preservando bloqueio quando existir outra manutenção aberta.
- [x] Validar que dias trabalhados mais faltas não ultrapassam o total previsto da competência de RH.
- [x] Alinhar as opções de cancelamento e resolução da Frota à permissão de governança antes do preenchimento do formulário.
- [x] Sinalizar pagamentos históricos acima do contratado sem alterar o bloqueio atual de novas baixas acima do saldo.
- [x] Manter em backlog técnico o teste genérico de normalização, a regra de comentários administrativos, o contador persistido de Cadastros e a abertura contextual de abas da Frota.

## Execução autorizada — correções prioritárias

- [x] Ampliar as regressões de identidade, recuperação, Frota, RH, permissões e Financeiro antes da validação final.
- [x] Validar desktop, mobile, TypeScript e build, preservando composição e comportamento visual do login.
- [x] Documentar as correções, salvar checkpoint e apresentar a versão publicada.

## Verificação solicitada — submenus de Recursos Humanos

- [x] Mapear os destinos, permissões e conteúdo esperado de Cadastro de Servidores, Ficha Financeira, Holerite, Frequência e movimento e Relatórios.
- [x] Confirmar no preview autenticado a navegação de cada submenu indicado.
- [x] Corrigir qualquer destino ou conteúdo sem resposta e incluir regressão correspondente.
- [x] Validar a versão resultante e apresentar o diagnóstico ao usuário.
- [x] Criar destinos internos específicos para as cinco abas de Recursos Humanos e propagá-los ao componente de RH.

## Alteração autorizada — senha demonstrativa do Administrador

- [x] Localizar a conta Administrador e atualizar sua senha local para o valor informado, sem registrá-lo em código, documentação ou testes.
- [x] Preservar o estado de primeiro acesso e as credenciais dos demais perfis demonstrativos.
- [x] Validar o acesso administrativo com a nova senha, executar regressão de autenticação e salvar checkpoint.

## Refinamento autorizado — tipografia do ambiente interno

- [x] Mapear as fontes, os seletores e as hierarquias tipográficas do shell e dos módulos autenticados, sem tocar no login.
- [x] Definir tipografia institucional para títulos, dados, rótulos e navegação, com caixa alta reservada a contextos de leitura rápida.
- [x] Aplicar fontes, pesos, espaçamentos e caixa alta ao ambiente autenticado sem alterar textos, rotas, permissões ou ações.
- [x] Validar contraste, responsividade, testes, TypeScript e build; documentar e salvar checkpoint da atualização visual.

## Ajuste autorizado — nova tipografia institucional interna

- [x] Substituir a combinação tipográfica atual por uma alternativa mais sóbria, legível e adequada a painel administrativo.
- [x] Reduzir a caixa alta a rótulos institucionais, estados e cabeçalhos de tabela, preservando a leitura em frase nos demais contextos.
- [x] Validar no preview, em desktop e mobile, os testes, TypeScript e build sem alterar a tela de login congelada.
- [x] Atualizar documentação, salvar checkpoint e apresentar a nova alternativa visual.

## Refinamento autorizado — hierarquia de legendas em todo o ambiente interno

- [x] Mapear títulos, subtítulos, descrições, rótulos, abas, tabelas, estados, textos auxiliares e navegação dos módulos autenticados.
- [x] Definir tokens globais de escala, cor, peso, linha e espaçamento para cada nível editorial, sem alterar o login.
- [x] Aplicar a hierarquia de texto a painéis, formulários, listas, tabelas, estados e navegação sem modificar textos, fluxos ou permissões.
- [x] Cobrir os tokens tipográficos com regressão e validar contraste, desktop, mobile, TypeScript e build.
- [x] Atualizar documentação, salvar checkpoint e apresentar o refinamento sistêmico publicado.

## Correção autorizada — legendas pequenas do ambiente interno

- [x] Identificar as legendas, metadados e textos auxiliares que ainda herdam estilo inadequado nos painéis, cartões, agenda, listas e ações rápidas.
- [x] Aplicar uma fonte de interface distinta, com tamanho, peso, contraste e espaçamento perceptivelmente melhores a essas legendas.
- [x] Validar em preview desktop e mobile, cobrir regressão tipográfica, executar TypeScript e build sem alterar a tela de login.
- [x] Atualizar documentação, salvar checkpoint e apresentar a correção visual.

## Implementação autorizada — sistema unificado de kickers

- [x] Mapear os usos de `.siga-kicker`, `access-*`, headings, filtros, detalhes, alertas e gatilhos de formulário em todas as telas afetadas.
- [x] Definir kickers institucional, de seção e de card, incluindo variantes de cor, inverse, acento gráfico e regras mobile acessíveis.
- [x] Consolidar as classes em `client/src/index.css` e aplicar a nova semântica sem alterar textos, ids, testids, rotas ou layout estrutural.
- [x] Cobrir a hierarquia com regressão e validar Início, login, gestão/relatório e alertas/detalhes em desktop e mobile.
- [x] Atualizar documentação, salvar checkpoint e apresentar o sistema publicado.

## Correção prioritária — regressão de kickers

- [x] Isolar os seletores genéricos que aplicaram fonte, marcadores e caixa alta a textos de apoio de cartões, agenda e ações rápidas.
- [x] Remover a aplicação de kicker desses textos e preservar legenda discreta, em leitura de frase e sem marcador visual.
- [x] Restringir kickers a contexto institucional e cabeçalhos de seção, sem alterar layout, ações, dados ou login.
- [x] Cobrir a regressão e validar cartões, agenda, navegação, desktop, mobile, TypeScript e build.
- [x] Atualizar documentação, salvar checkpoint e apresentar a correção.

## Direção autorizada — Montserrat e Inter no ambiente interno

- [x] Mapear títulos, métricas, menus, botões, legendas, descrições e tabelas que receberão Montserrat ExtraBold ou Inter.
- [x] Carregar Montserrat e Inter e definir tokens tipográficos exclusivos do ambiente autenticado, preservando o login.
- [x] Aplicar Montserrat aos títulos, chamadas e números de destaque; aplicar Inter a menus, botões, legendas, descrições e tabelas.
- [x] Validar a nova direção em Início, cartões, agenda, navegação, desktop e mobile, com testes, TypeScript e build.
- [x] Atualizar documentação, salvar checkpoint e apresentar a nova alternativa tipográfica.

## Publicação autorizada — versão tipográfica atual

- [x] Revisar estado Git, integração GitHub, arquivos alterados e destino remoto, excluindo credenciais e referências somente leitura.
- [x] Preparar commit descritivo com a atualização tipográfica, testes e documentação atuais.
- [x] Enviar a versão para a branch principal do repositório autorizado e confirmar o hash remoto.

## Implementação autorizada — tokens tipográficos globais nos módulos

- [x] Auditar todas as ocorrências de fontes fixas nos estilos de páginas internas e mapear a função editorial de cada uso.
- [x] Declarar tokens globais de Montserrat e Inter em `client/src/index.css` e carregá-las antecipadamente em `client/index.html`.
- [x] Substituir fontes fixas nos módulos por tokens funcionais, mantendo o login congelado e sem alterar textos, ids, testids, fluxos ou permissões.
- [x] Ampliar a regressão para todos os estilos de módulo e validar os módulos internos em desktop e mobile, TypeScript e build.
- [x] Documentar que o login permanece fora do escopo visual, salvar checkpoint e apresentar a atualização.

## Correção autorizada — hierarquia visual específica de Gestão

- [x] Mapear a escala de títulos, abas, filtros, tarefas, metadados e agenda da Gestão atualmente visíveis no preview.
- [x] Aplicar Montserrat e Inter com tamanhos, pesos, contraste e espaçamento específicos à Gestão, sem alterar textos, dados ou ações.
- [x] Validar tarefas, filtros e agenda em desktop e mobile, com regressão tipográfica, TypeScript e build.
- [x] Atualizar documentação, salvar checkpoint e apresentar a correção específica.

## Relatório solicitado — alterações após o último diálogo

- [x] Consolidar alterações de código, validações executadas, checkpoints e limitações visuais ainda observadas.
- [x] Gerar e entregar arquivo `.txt` objetivo, sem expor credenciais ou informações externas.

## Correção estrutural orientada — causa raiz da tipografia em Gestão

- [x] Confirmar os seletores reais e os valores fixos de `siga-pages.css` usados por tarefas, abas, cabeçalho e agenda de Gestão.
- [x] Reescrever diretamente essas regras-base para usar os tokens globais de fonte e escala, sem novas camadas genéricas de sobreposição.
- [x] Reforçar o teste para verificar tokens nas regras reais de Gestão, não apenas sua presença em algum arquivo.
- [x] Validar a Gestão em sessão autenticada com captura posterior à alteração antes de salvar qualquer checkpoint visual.
- [x] Documentar o resultado ou o bloqueio de validação e apresentar a próxima ação sem afirmar uma correção visual não comprovada.

## Publicação autorizada — correção estrutural de Gestão

- [x] Revisar os arquivos pendentes e excluir documentos externos, capturas, credenciais e utilitários temporários do envio.
- [x] Criar commit da correção estrutural de Gestão, da regressão e da documentação relacionada.
- [x] Enviar a atualização à branch principal do repositório autorizado e confirmar o hash remoto.

## Correção estrutural orientada — tipografia da página Início

- [x] Confirmar os seletores efetivos de Início que ainda usam fontes ou escalas rígidas, incluindo cabeçalho, indicadores, agenda, acesso rápido e legendas.
- [x] Reescrever diretamente no CSS-base os estilos de Início com tokens de Montserrat ExtraBold e Inter, sem sobreposição adicional.
- [x] Estender a regressão tipográfica para inspecionar os seletores reais da página Início e impedir fontes legadas ou escalas rígidas.
- [x] Validar o painel Início em sessão autenticada, em desktop e mobile, após a alteração e sem modificar a tela de login.
- [x] Documentar o resultado comprovado e atualizar o checkpoint somente após a validação específica de Início.

## Auditoria corretiva — fontes efetivamente renderizadas em Início

- [x] Inspecionar no sandbox a família tipográfica calculada dos títulos, legendas, indicadores, agenda, ações rápidas e prazos de Início.
- [x] Corrigir somente a causa comprovada de fonte não aplicada ou de percepção visual insuficiente, sem alterar login, dados ou fluxos.
- [x] Revalidar visualmente no sandbox e repetir a regressão, TypeScript e build antes de novo checkpoint.
- [x] Documentar o resultado com evidência da fonte calculada e da comparação visual, sem alegar mudança não perceptível.

## Direção autorizada — Manrope nas legendas internas de Início

- [x] Mapear as legendas, descrições, menus, botões, controles e metadados visíveis de Início que receberão Manrope, preservando Montserrat nos títulos e números.
- [x] Aplicar Manrope diretamente aos seletores efetivos de Início, sem tocar no login, nos fluxos, nos dados locais ou nas permissões.
- [x] Verificar a família calculada de títulos e legendas no sandbox, validar desktop e mobile e executar regressões antes de novo checkpoint.
- [x] Documentar o resultado visual comparável e salvar checkpoint somente após a validação autenticada.

## Ajuste corretivo — legibilidade perceptível de Início

- [x] Mapear as legendas que permanecem visualmente discretas na resolução de uso real, incluindo indicadores, agenda, prazos, ações rápidas e prioridades.
- [x] Aumentar de forma coerente tamanho, peso, contraste e espaçamento de Manrope nesses seletores efetivos, mantendo Montserrat nos títulos e números.
- [x] Validar em sessão autenticada na escala de desktop da captura do usuário e em mobile, além de repetir testes, TypeScript e build.
- [x] Documentar o resultado somente se a comparação visual evidenciar a nova hierarquia antes de salvar checkpoint.

## Convenção visual autorizada — caixa alta institucional

- [x] Mapear os títulos institucionais e os botões de abas, módulos, janelas e ações de navegação que devem usar caixa alta no ambiente autenticado.
- [x] Aplicar a convenção diretamente aos seletores efetivos do shell e dos módulos, mantendo textos de conteúdo, dados, descrições e campos em leitura normal.
- [x] Reforçar a regressão para diferenciar controles institucionais de textos de conteúdo e impedir alterações na tela de login.
- [x] Validar Gestão, Início, menu lateral e pontos de quebra mobile em sessão autenticada antes de salvar checkpoint.
- [x] Documentar o resultado e disponibilizar a versão somente após a validação visual comprovada.

## Expansão incremental — cobertura de campos do sistema de referência

- [x] Consolidar os setores ausentes: agenda/mensagens, cadastros gerais, Agricultura Familiar e PDDE/FNDE, sem criar conexão externa.
- [x] Mapear a expansão compatível de Unidades Escolares e a necessidade de cadastro de turmas no armazenamento local atual.
- [x] Definir, com autorização do usuário, o primeiro grupo de campos e telas a implementar, preservando arquitetura, login, rotas, fluxos e permissões existentes.
- [ ] Implementar e validar exclusivamente o grupo autorizado com dados demonstrativos em localStorage, sem migração de dados reais ou Cloudflare D1.
- [ ] Atualizar a matriz de cobertura dos demais módulos somente após sua revisão campo a campo.

## Execução sequencial autorizada — ampliação de cobertura local

- [x] Preparar tipos e migração local compartilhada para os cinco grupos autorizados, sem conexão externa.
- [x] Expandir Unidades Escolares e implementar o cadastro local de Turmas, com seus campos e permissões.
- [ ] Implementar Agenda, Mensagens e Notas locais com persistência e fluxos de leitura próprios.
- [ ] Implementar Cadastros Gerais institucionais reutilizáveis pelos módulos locais.
- [ ] Implementar Agricultura Familiar com entidades, contratos, planos, guias, recebimentos e faturamento demonstrativos.
- [ ] Implementar PDDE/FNDE por unidade escolar, incluindo unidade executora, contas e prestação de contas local.
- [ ] Validar cada grupo em desktop e mobile, com testes, TypeScript, build e preservação de login, fluxos e permissões.
- [ ] Consolidar documentação de cobertura de campos e salvar checkpoint somente após a validação final.
