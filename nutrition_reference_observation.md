# Observação funcional — Nutrição

## Limites da observação

O módulo foi consultado no sistema original exclusivamente em modo leitura. Nenhum planejamento, projeção, guia, cardápio, ajuste, aprovação, impressão, exportação ou download foi iniciado. Credenciais, pessoas, unidades, contratos, entidades, valores, saldos e demais dados operacionais não foram copiados para este documento.

## Navegação

Nutrição possui dois submódulos, nesta ordem:

| Submódulo | Finalidade observada |
|---|---|
| Planejamento semanal e análise de saldos | Projetar entregas semanais antes da emissão de guias e acompanhar o impacto nos saldos contratuais. |
| Planejamento anual da alimentação | Organizar per capita, matrículas, períodos e necessidade de aquisição por etapa de ensino. |

## Planejamento semanal e análise de saldos

A página mantém o cabeçalho institucional do módulo, seguido do título operacional e da ação contextual **Nova projeção**. A ação não foi aberta na referência, pois inicia um fluxo de escrita.

| Bloco | Estrutura observada |
|---|---|
| Indicadores | Projeções, Em análise, Aprovadas para guia, Escolas e Meses planejados. |
| Pesquisa | Escola, INEP, contrato ou entidade. |
| Filtros | Mês, modalidade e situação. |
| Modalidades | Todas, Creche, Pré-Escola, Ensino Fundamental e EJA. |
| Situações | Todas, Em análise, Ajustado, Aprovado para guia e Arquivado. |
| Estado vazio | Orienta criar um planejamento para analisar saldos antes da emissão das guias. |

O formulário semanal foi mapeado no artefato auditável local, sem ser aberto na referência. Ele contém contrato, escola, mês de referência, modalidade, situação e observações. A projeção é organizada por produto e por semana, com quantidades semanais editáveis, distribuição igual entre semanas, ajuste ao saldo disponível, análise do contrato e orientações de saldo. A própria interface informa que o saldo real somente é baixado após a confirmação da entrega; salvar a projeção não equivale à baixa de estoque.

Os indicadores internos do editor semanal são Produtos analisados, Semanas, Quantidade projetada e Saldos insuficientes. Para cada produto, a linha compara quantidade contratada, quantidade comprometida em guias, outras projeções ativas, quantidades por semana, total projetado e saldo após a projeção. O saldo após é calculado pela disponibilidade contratual descontadas as quantidades semanais deste planejamento. O sistema classifica o resultado como adequado, atenção quando o saldo remanescente é baixo, ou crítico quando a projeção ultrapassa o disponível. O salvamento persiste contrato, escola, mês, modalidade, situação, datas semanais, itens e observações; não executa baixa real.

A disponibilidade semanal foi confirmada como **quantidade contratada menos quantidade comprometida em guias menos o total de outras projeções ativas do mesmo contrato e produto**. Projeções arquivadas ou canceladas não comprometem saldo. O total do item é a soma das quantidades de todas as semanas; existe saldo insuficiente quando esse total supera a disponibilidade antes da projeção atual.

## Planejamento anual da alimentação

A página mantém o mesmo cabeçalho do módulo, seguido do título anual e da ação contextual **Novo planejamento**. A ação não foi aberta na referência, pois inicia um fluxo de escrita.

| Bloco | Estrutura observada |
|---|---|
| Indicadores | Planejamentos, Aprovados, Matrículas por etapa, Produtos projetados e Etapas planejadas. |
| Pesquisa | Cardápio, modalidade ou etapa. |
| Filtros | Ano, etapa e situação. |
| Etapas | Creche, Pré-Escola, Ensino Fundamental — Anos Iniciais e Finais, EJA — Anos Iniciais e Finais, e Atendimento Educacional Especial. |
| Situações | Todas, Em elaboração, Em análise, Aprovado e Arquivado. |
| Estado vazio | Informa a ausência de planejamentos anuais para os filtros selecionados. |

O formulário anual foi mapeado no artefato auditável local, sem ser aberto na referência. Ele contém identificação do cardápio, ano, modalidade, etapa de ensino, início e fim do período, situação e observações. A etapa carrega matrículas agregadas, e o período organiza os dias letivos previstos por mês.

Cada produto planejado possui nome, origem — Industrializado ou Agricultura Familiar —, categoria, base do per capita, per capita, unidade e ofertas mensais. As bases observadas são **Por oferta** e **Mensal consolidado**; as unidades são grama, mililitro e unidade. O resultado compara necessidade projetada, cobertura por contratos ativos da Agricultura Familiar e saldo do estoque industrializado. A lista anual também prevê edição, geração de CSV e impressão; essas ações não foram executadas na referência.

O editor anual usa a matrícula agregada da etapa selecionada como base do cálculo. Para cada mês dentro do período, registra dias letivos e número de ofertas; produtos na base Mensal consolidado recebem uma ocorrência por mês ativo, enquanto produtos Por oferta usam a quantidade informada. A unidade de consumo é convertida para a unidade de fornecimento correspondente: grama para quilograma, mililitro para litro e unidade para unidade.

O produto somente pode ser incluído quando possui nome e per capita maior que zero. O planejamento registra uma fotografia das matrículas, o calendário mensal, os itens e suas ofertas. A análise sinaliza produtos sem vínculo com catálogos de contrato ou estoque, compara a necessidade total com a cobertura atual e orienta a distribuição mensal ou bimestral. A exportação CSV organiza identificação do planejamento, ano, modalidade, etapa, total agregado de alunos, produtos, origem, unidade, per capita, meses, total anual, cobertura e necessidade de compra/contratação; nenhum arquivo da referência foi gerado ou baixado.

## Validação responsiva do preview local

O preview local foi validado em viewport móvel de 390 px após o login demonstrativo. A navegação lateral preserva todos os grupos e abre Nutrição com os dois submódulos identificáveis. O Planejamento semanal reorganiza indicadores em grade de duas colunas, empilha filtros e mantém a lista resumida com situação, quantitativos e ação local. O Planejamento anual mantém as abas, indicadores, filtros e ações locais de CSV, impressão e arquivamento sem sobreposição funcional. A faixa exibida pelo ambiente de prévia é externa ao aplicativo e não faz parte do módulo Nutrição.

Também foi validado no editor anual que os dias letivos não são apenas informativos: eles limitam as ofertas consideradas em cada mês. Ao reduzir temporariamente um mês de 20 para 3 dias, o item por oferta passou de 80 para 75 ofertas anuais consideradas e sua necessidade/compra a contratar foi recalculada imediatamente; a alteração foi descartada sem salvamento. Itens de base mensal consolidada preservam uma oferta por mês letivo ativo.

## Sequência operacional a preservar

| Fluxo | Sequência funcional |
|---|---|
| Semanal | Selecionar contrato e escola; definir mês, modalidade e situação; revisar saldo; distribuir quantidades por produto e semana; salvar projeção; somente uma confirmação posterior de entrega pode afetar saldo real. |
| Anual | Identificar cardápio e ano; selecionar etapa e período; revisar matrículas; informar dias letivos; adicionar produtos e per capita; calcular necessidade e cobertura; salvar planejamento; exportação e impressão permanecem ações posteriores. |

## Regras para a reprodução local

A reprodução deve manter os dois submódulos, a ordem dos filtros, os indicadores, estados e sequência operacional observados. Os fluxos de criação serão implementados somente no preview, com dados demonstrativos próprios. A referência não será utilizada para escrever, copiar ou sincronizar dados.
