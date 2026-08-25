# Direção visual — SIGA SEMED Frontend Preview

## Três abordagens exploradas

| Tema | Introdução muito breve | Probabilidade |
|---|---|---:|
| **Caderno de Gestão Pública** | Uma interface editorial e institucional, com superfícies de papel, margens precisas, azul profundo e verde administrativo. A intenção é transformar a rotina operacional em uma leitura clara de gabinete, sem teatralidade. | 0,053 |
| **Painel de Sinalização Cívica** | Uma linguagem mais gráfica, com faixas coloridas e marcadores de status inspirados em sinalização de serviço público. A intenção é maximizar a leitura de prazos e prioridades. | 0,071 |
| **Mapa de Fluxos Administrativos** | Uma composição baseada em linhas, conexões e blocos sequenciais para dar sensação de processo em andamento. A intenção é destacar rastreabilidade e continuidade. | 0,039 |

## Abordagem escolhida: Caderno de Gestão Pública

### Movimento de design

**Editorial cívico contemporâneo**, combinando a sobriedade de relatórios de gestão pública com a clareza visual de produtos administrativos modernos.

### Princípios centrais

1. **Mesma geografia funcional:** o topo continua no topo, os indicadores continuam antes dos módulos, as abas continuam entre indicadores e área de trabalho, o cadastro permanece à esquerda no desktop e acima no celular, e os relatórios permanecem na área principal.
2. **Leitura por camadas:** primeiro o contexto e as ações, depois os indicadores, em seguida o módulo ativo, os alertas, filtros e registros. Nenhum dado existente é removido ou trocado de fluxo.
3. **Densidade responsável:** detalhes continuam disponíveis nos accordions, porém o resumo passa a comunicar situação, prazo e natureza do item antes da expansão.
4. **Institucional sem rigidez:** paleta de serviço público, microtexturas discretas, bordas finas e transições curtas tornam o sistema acolhedor sem parecer promocional.

### Filosofia de cor

O azul-petróleo profundo transmite confiança administrativa e estabiliza o cabeçalho. O verde SEMED mantém continuidade com a identidade pública e sinaliza ações de progresso. Âmbar e vermelho são reservados exclusivamente para atenção e risco; o fundo claro com leve aquecimento reduz a fadiga em jornadas longas.

### Paradigma de layout

O layout usa uma **faixa institucional horizontal** no topo e uma **coluna de apoio de cadastro** que acompanha o início da área de trabalho em telas largas. A região de acompanhamento mantém sua precedência visual e recebe painéis analíticos compactos antes de alertas, filtros e lista. Em telas menores, a ordem atual empilhada é preservada.

### Elementos de assinatura

1. Filetes verticais em verde e azul para diferenciar estados e seções.
2. Textura cartográfica-documental discreta no cabeçalho, sem texto e com contraste garantido.
3. Medidores lineares finos para saldo, progresso e distribuição, sempre acompanhados por valor textual.

### Filosofia de interação

Interações devem ser diretas e calmas. Abas, accordions e controles mantêm o comportamento atual, recebendo apenas feedback de foco, elevação suave e indicadores de estado. Ações destrutivas continuam explícitas e textuais.

### Animação

Entradas apenas por opacidade e deslocamento de até 8 px, com duração de 180–240 ms. Hover aplica contraste e elevação mínima; clique reduz a escala para 0,98. Tudo respeita `prefers-reduced-motion`.

### Sistema tipográfico

**Manrope** para a interface, por sua leitura compacta e institucional, e **Source Serif 4** em títulos selecionados, criando um tom de relatório executivo. Títulos em serif aparecem somente em marca, cabeçalhos de painel e números-chave; campos, tabelas e documentos permanecem em sans-serif.

### Essência de marca

**SIGA SEMED é o painel de acompanhamento técnico para equipes municipais que precisam transformar prazos, documentos e contratos em decisões organizadas.** Personalidade: criteriosa, clara e responsável.

### Voz da marca

Os títulos devem ser objetivos e indicar contexto; chamadas e microcopys devem explicar a próxima ação sem marketing genérico.

> “Prazos que pedem encaminhamento nesta semana.”

> “Registrar baixa e manter o saldo atualizado.”

### Wordmark e logo

O brasão institucional existente continua sendo a referência oficial. Um símbolo gráfico complementar, sem texto, será usado somente como marca operacional do preview e favicon: camadas geométricas que formam um documento, um selo e uma seta de acompanhamento.

### Cor de assinatura

**Azul Gabinete — #123A63.**

## Style Decisions

O preview adota superfícies de folhas administrativas sobre fundo aquecido, com divisórias finas em vez de sombras ou cantos como elemento predominante. Os filetes verticais, as etiquetas de status e os medidores lineares estruturam painéis, riscos e registros como uma assinatura recorrente. O Azul Gabinete organiza toda a hierarquia institucional; o verde SEMED fica restrito a confirmação, progresso e ação; âmbar e vermelho aparecem apenas como sinalização de atenção e risco.

Na tela de login, o formulário funciona como uma folha administrativa segura: filetes institucionais, divisórias finas, metadados discretos e o símbolo geométrico de documento, selo e seta substituem uma estética de card genérico. A estrutura preserva matrícula, senha, mensagem de validação, botão Entrar e a orientação obrigatória de primeiro acesso. A imagem institucional fornecida compõe diretamente o cenário e mantém o tom humano, educacional e cívico da Prefeitura de Paço do Lumiar.

A fotografia institucional funciona como contexto documental, com tintura Azul Gabinete e contraste reduzido; ela não compete com a tarefa de acesso. O verde SEMED é reservado a filetes, confirmação, orientação de primeiro acesso e indicadores, enquanto o azul organiza a hierarquia dominante da tela.

## Simplificação escolhida pelo usuário

A folha de acesso deve permanecer deliberadamente mínima: título, matrícula, senha, mensagem de validação quando necessária e ação principal. O símbolo complementar, os metadados de cabeçalho, a orientação persistente de primeiro acesso e os textos auxiliares não serão reintroduzidos na tela de login, pois conflitam com a simplificação solicitada. A identidade institucional continuará sendo sustentada pelo Azul Gabinete, pela tipografia editorial, pelos filetes discretos e pela imagem documental de fundo.

O login principal utiliza uma única folha administrativa, sem painel de benefícios, lista de ícones, parágrafo explicativo, rodapé institucional ou composição em duas colunas. O contexto municipal permanece exclusivamente no fundo, com tintura Azul Gabinete, enquanto a folha apresenta apenas a identidade SIGA SEMED, matrícula, senha, validação quando necessária e a ação Entrar.

## Ajuste de composição

A composição final volta a usar duas colunas em desktop: a barra institucional da esquerda é restaurada sobre o contexto visual municipal e a folha clean permanece exclusivamente na barra direita. Em celular, a barra institucional antecede o formulário de acesso em uma única coluna.

A barra lateral institucional mostra apenas a identidade oficial e a assinatura SIGA SEMED sobre o contexto municipal tinturado. Listas de benefícios, ícones de produto, texto explicativo e slogans são omitidos; o formulário da direita mantém a função de autenticação como endpoint visual da página.

## Referência para a futura área de trabalho

A imagem institucional enviada pelo usuário — com a marca Prefeitura Paço do Lumiar, famílias, educação e livros — será a referência de tom humano e cívico para a futura área de trabalho. Ela não será reduzida a um plano de fundo genérico e não será aplicada antecipadamente à tela de login, cuja função é comunicar segurança e acesso institucional.
