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
