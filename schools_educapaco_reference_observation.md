# Observação da referência — Unidades Escolares e Educa Paço

## Limite de coleta

As consultas deste documento ocorrem na referência autenticada exclusivamente em modo leitura. Não serão criadas, editadas, excluídas, impressas, exportadas ou baixadas informações. O registro preserva apenas estrutura, campos, filtros, estados e sequência operacional, sem unidades, endereços, contatos, matrículas, valores ou identificadores reais.

## Estrutura de navegação confirmada

| Módulo | Submódulos observados no menu |
|---|---|
| Unidades Escolares | Cadastro; Relatórios |
| Educa Paço | Cadastro de Núcleos; Relatórios |

> Fonte de observação: shell autenticado de produção, versão institucional indicada no próprio cabeçalho, acessado somente para mapeamento estrutural.

## Unidades Escolares — Cadastro

A página inicia com um atalho de **Nova unidade**, cabeçalho de rede e cartões de contagem agregada. A consulta possui botão de atualização, campo de pesquisa por nome ou código institucional e seletor de tipo de unidade. A listagem vertical apresenta, por item, identidade da unidade, classificação, área de localização ou aviso de dados complementares, referência de censo, situação e duas ações contextuais: edição e mapa. A reprodução local deverá preservar esse padrão de filtros e cartões, mas utilizará somente unidades, indicadores e endereços demonstrativos.

| Elemento | Comportamento a reproduzir localmente |
|---|---|
| Nova unidade | Abre formulário local para cadastro ou complementação de dados. |
| Atualização do cadastro | Salva e reflete a alteração apenas no armazenamento local. |
| Pesquisa | Filtra por texto livre de nome ou código institucional demonstrativo. |
| Tipo | Alterna entre todas, municipal e conveniada. |
| Item de unidade | Exibe resumo, situação e censo demonstrativos; permite edição local e mapa fictício. |

## Unidades Escolares — Relatórios

A central de relatórios inicia com texto de orientação e uma faixa única de filtros. A consulta combina busca por nome ou código institucional, tipo de unidade, situação e ano de censo. Há uma ação de exportação CSV, que será reproduzida somente como exportação de dados demonstrativos locais. Durante a consulta, o sistema apresenta estado de carregamento antes da lista ou do estado vazio.

| Filtro ou ação | Comportamento local planejado |
|---|---|
| Pesquisa | Filtra unidades demonstrativas por nome ou código. |
| Tipo | Municipal, conveniada ou todos. |
| Situação | Ativa, inativa ou todas. |
| Ano do Censo | Consulta o período de censo demonstrativo. |
| Exportar CSV | Gera arquivo local com os resultados filtrados, sem informações externas. |

Após o carregamento, a central exibe cartões de resumo por tipo de rede e uma tabela com colunas institucionais, tipo, situação, localização e matrículas. No preview, esses cartões e colunas serão mantidos com valores demonstrativos agregados, sem reproduzir listas ou totais externos.

## Educa Paço — Estrutura de navegação

| Módulo | Submódulos confirmados no menu |
|---|---|
| Educa Paço | Cadastro de Núcleos; Relatórios |

Os dois submódulos serão abertos em consulta segura nas próximas etapas. A referência mantém o conteúdo anterior no painel enquanto apenas o grupo de navegação é expandido; o preview deverá reproduzir essa navegação sem carregar dados externos.

## Educa Paço — Cadastro de Núcleos

O cadastro de núcleos apresenta uma faixa de contexto de atividade complementar, aviso de integração com alimentação escolar e uma ação de novo núcleo. O conteúdo possui abas **Núcleos** e **Relatórios**. Na aba de núcleos, a consulta combina pesquisa livre por código, núcleo, endereço ou responsável, seletor de classificação e seletor de situação. Enquanto a consulta é carregada, existe estado explícito de carregamento.

| Elemento | Comportamento local planejado |
|---|---|
| Novo núcleo | Abre formulário local para núcleo demonstrativo. |
| Núcleos | Lista e filtra os registros locais. |
| Relatórios | Alterna para os cartões e tabelas agregadas do módulo. |
| Pesquisa | Filtra texto demonstrativo por código, nome, endereço ou responsável. |
| Classificação | Restringe a modalidade de núcleo demonstrativa. |
| Situação | Alterna entre ativo, inativo e todos. |

## Educa Paço — Relatórios

A aba de relatórios amplia a consulta com filtros de pesquisa, classificação, atividade, modalidade esportiva, responsável e situação. Também apresenta cartões agregados por classificação, tabela por núcleo e comandos de baixar CSV e impressão. A tabela combina colunas de identificação, classificação, capacidade, atividades, modalidades, localização e responsáveis. No preview, esses mesmos grupos de informação serão simulados com nomes, endereços, equipes, códigos e totais integralmente fictícios.

| Filtro ou ação | Comportamento local planejado |
|---|---|
| Classificação | Todas, pedagógico, esportivo ou pleno. |
| Atividade | Filtra atividades complementares demonstrativas. |
| Modalidade esportiva | Filtra modalidades demonstrativas. |
| Responsável | Pesquisa coordenação ou supervisão fictícia. |
| Situação | Ativo, inativo ou todos. |
| CSV e impressão | Produzem somente relatório local demonstrativo. |

## Reprodução e validação local concluídas

O preview passou a oferecer quatro contextos locais separados pelo mesmo submenu institucional observado: **Cadastro** e **Relatórios** para Unidades Escolares, além de **Cadastro de Núcleos** e **Relatórios** para Educa Paço. Os cadastros usam apenas códigos, unidades, endereços, atividades, capacidades e responsáveis demonstrativos. O domínio local foi elevado ao esquema v5, com migração de bases v4 que preserva Usuários, Nutrição, Estoque e Recursos Humanos e insere apenas as duas coleções novas.

| Área local | Validação registrada |
|---|---|
| Unidades Escolares | Pesquisa por código, nome ou setor; filtros por tipo, situação e ano de censo; formulário de inclusão/edição, controle de código duplicado, indicadores e CSV local. |
| Educa Paço | Pesquisa por código, núcleo, endereço ou responsável; filtros por classificação e situação; formulário de inclusão/edição, atividades, modalidades, capacidade, integração de nutrição, indicadores, CSV e impressão local. |
| Permissões | Escrita bloqueada para perfil técnico sem concessão e permitida para Técnico com a chave de módulo correspondente; Administrador preserva a escrita. |
| Regressão técnica | Suíte Vitest aprovada com 64 testes, além de TypeScript e build de produção aprovados. |
| Interface | Fluxos conferidos no preview em desktop; a composição responsiva foi conferida em viewport móvel sem alterar a identidade visual oficial. |
