# Observação da referência — Recursos Humanos

## Limite de coleta

O módulo foi observado no sistema de referência em modo exclusivamente leitura. Não foram abertos cadastros individuais, fichas, comprovantes, edições, relatórios, impressões ou downloads. Este registro contém apenas estrutura e fluxo; não reproduz pessoas, matrículas, CPFs, cargos, valores, documentos ou indicadores reais.

## Estrutura de navegação

O grupo **Recursos Humanos** utiliza cinco submódulos, nesta ordem:

1. Cadastro de Servidores.
2. Ficha Financeira.
3. Holerite.
4. Frequência e movimento.
5. Relatórios.

## Cadastro de Servidores

| Elemento | Estrutura observada |
|---|---|
| Cabeçalho | Título do setor e subtítulo sobre dados funcionais, complementação cadastral e comparação mensal da folha. |
| Indicadores | Quatro cartões: servidores ativos, cadastros incompletos, pendências mensais e última competência. |
| Filtros | Busca por nome, matrícula, CPF ou cargo; filtro de situação com opções agregadas. |
| Ação principal | Novo servidor. A operação não foi aberta. |
| Lista | Tabela paginada com matrícula, servidor, CPF, cargo, situação e ação de edição. |
| Estados | Situações visuais de ativo e de cadastro aguardando revisão; paginação anterior/próxima. |

> A futura reprodução utilizará servidores e competências demonstrativas, máscaras de privacidade e ações exclusivamente locais.

## Ficha Financeira

| Elemento | Estrutura observada |
|---|---|
| Objetivo | Consulta do histórico mensal de proventos, descontos e valores líquidos por servidor. |
| Indicadores e filtros | Reutiliza os cartões de situação e o filtro de status do cadastro. |
| Lista de seleção | Tabela paginada com os mesmos campos resumidos de identificação funcional e botão de abertura de ficha. |
| Próxima etapa | A ficha individual não foi aberta, pois pode expor informações financeiras pessoais. |

Na reprodução local, a ficha será composta por competências e rubricas demonstrativas agregadas, sem remunerações ou comprovantes reais.

## Holerite

| Elemento | Estrutura observada |
|---|---|
| Objetivo | Localizar servidor para consultar demonstrativos mensais disponíveis. |
| Indicadores e filtros | Mantém cartões de situação, busca e filtro de status. |
| Lista de seleção | Reutiliza a tabela paginada de servidores com ação específica de abertura de holerite. |
| Próxima etapa | O demonstrativo individual não foi aberto, pois pode expor dados financeiros pessoais. |

A versão local utilizará apenas um demonstrativo sintético, protegido por perfil e sem opção de baixar arquivos externos.

## Frequência e movimento

| Elemento | Estrutura observada |
|---|---|
| Objetivo | Preparação, validação e encaminhamento mensal de competências das unidades para Recursos Humanos. |
| Ação principal | Nova competência. A operação não foi aberta. |
| Indicadores | Competências, em preparação, aguardando gestora e enviadas ao RH. |
| Filtros | Código do movimento, competência mensal e unidade; ação de atualização. |
| Estado vazio | Ausência de competência cadastrada com orientação para criar a competência e capturar lotações da escola. |
| Fluxo inferido | Competência por unidade passa por preparação, validação/gestora e encaminhamento ao RH. |

A reprodução local deve manter competências mensais, lotações demonstrativas e transições de situação, sem copiar unidades ou movimentos da referência.

## Relatórios de Recursos Humanos

| Elemento | Estrutura observada |
|---|---|
| Abas | Relatório gerencial, Folhas importadas e Possíveis desligamentos. |
| Filtros do relatório gerencial | Pesquisa geral, situação, cargo, lotação, intervalo de admissão, completude cadastral, disponibilidade de telefone/e-mail e indicador IC. |
| Ações | Limpar filtros, exportar CSV, imprimir e atualizar relatório. Essas ações não foram executadas. |
| Indicadores | Contagem de resultados por situação, composição de folha, cargos e lotações; todos devem ser demonstrativos no preview. |
| Visualização | Blocos de distribuição por cargo e lotação, resumo agregado e tabela paginada de servidores. |
| Privacidade | A referência expõe campos sensíveis nessa área; a versão local deve usar dados fictícios minimizados e aplicar escopo/permissões. |

Na reprodução, exportação e impressão serão locais e demonstrativas. Nenhum contato, remuneração, data de admissão, lotação ou outro dado real será transferido.

## Detalhamento seguro da competência mensal

O artefato auditável local confirma que a criação de competência mensal reúne mês, unidade escolar, dados operacionais de contexto, dias planejados e um calendário de ocorrências. O calendário comporta data, classificação e descrição; suas ocorrências são registradas para a folha sem alterar automaticamente o total planejado.

| Etapa | Comportamento estrutural a reproduzir localmente |
|---|---|
| Preparação | Criar competência por unidade e mês, com registros demonstrativos de lotação/frequência. |
| Calendário | Adicionar ocorrências de calendário com categorias como feriado, ponto facultativo, recesso, suspensão, sábado letivo, reposição ou outra. |
| Revisão | Manter uma etapa de conferência do RH e devolução para correção com justificativa local. |
| Encaminhamento | Permitir transição de preparo para envio ao RH, de acordo com a permissão do perfil. |
| Saídas locais | Disponibilizar impressão demonstrativa de folhas e resumo mensal, sem gerar documentos externos. |
| Exclusão | Exigir confirmação e justificativa local, sem solicitar ou armazenar senha real. |

## Validação móvel do preview local

As áreas **Cadastro de Servidores** e **Ficha Financeira** foram verificadas em viewport móvel real. A navegação lateral preserva os cinco submódulos de Recursos Humanos; os indicadores empilham sem perda de leitura; a pesquisa, os filtros e o comando de novo servidor permanecem acessíveis; e os cartões financeiros reorganizam os valores demonstrativos de proventos, descontos e líquido de forma legível. A verificação utilizou exclusivamente a conta demonstrativa local e não criou ou alterou registros durante a captura.
