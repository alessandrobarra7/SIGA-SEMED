# Validação de frontend no previewer

## Evidência de página executável

A rota principal do previewer renderiza o dashboard React do SIGA SEMED com cabeçalho, ações, KPIs, abas, coluna de cadastro, painel de acompanhamento, gráficos, alertas, filtros e accordions de registros.

## Interações verificadas

O acionamento de **Cadastro — Novo registro** abriu um formulário funcional sem navegar para outra página. A sequência preservada no formulário é: tipo de registro, número, objeto, fornecedor/interessado, setor, responsável, início, vencimento, valor, prazo de alerta, controle financeiro, próximo pagamento, situação, observações e ação de cadastro.

O accordion do contrato `012/2026` foi aberto no previewer. A expansão preservou sua área dentro da lista e revelou detalhes, controle financeiro, execução percentual, valores pago/em aberto, formulário de baixa, histórico de pagamentos e ações de editar/excluir.

A aba **Documentos** foi acionada com êxito no previewer. A área documental permaneceu na mesma posição funcional: cadastro à esquerda, controle documental à direita, KPIs documentais antes da leitura analítica, filtros antes da lista e documentos expansíveis ao final. O módulo renderiza dados por tipo, leitura de prazos, filtros e registros de Ofício, Memorando e Despacho como interações reais de frontend.

## Escopo do preview

As alterações são exclusivamente de frontend e usam dados demonstrativos mantidos no navegador. O preview não altera os endpoints, o banco, as APIs nem regras de negócio do projeto original.

## Responsividade e compilação

Capturas em 1440 px e em 375 px confirmaram que a sequência funcional se mantém. No desktop, cadastro ocupa a coluna de apoio à esquerda e acompanhamento permanece na coluna principal à direita; no celular, a mesma ordem fica empilhada: cabeçalho, aviso, KPIs, abas, cadastro, acompanhamento, análises, alertas, filtros e registros.

`pnpm check` e `pnpm build` foram concluídos sem erros. O bundle alerta apenas para um chunk JavaScript acima de 500 kB, decorrente da inclusão da biblioteca de gráficos; é uma oportunidade futura de code-splitting, sem impedir a execução atual do preview.

## Página de login institucional

A página inicial passou a abrir na tela de acesso. Foram validados no previewer os campos de usuário e senha, o estado de processamento `Verificando acesso...` e a liberação posterior do dashboard React ao enviar credenciais demonstrativas. A autenticação permanece propositalmente local ao frontend nesta fase; não foram inseridas credenciais reais nem alterados endpoints, APIs ou regras do backend.

## Correção de fidelidade do acesso

O login foi corrigido para usar **Matrícula** e **Senha**, com a mensagem de preenchimento correspondente. A imagem institucional enviada pelo usuário é agora o contexto visual direto da tela. Após o envio de matrícula e senha demonstrativas, o preview não abre mais o dashboard: ele direciona à tela obrigatória de **Primeiro acesso**, com senha atual, nova senha, confirmação, validação de equivalência, mínimo de 10 caracteres e ação `Salvar senha`, reproduzindo a sequência protegida do código original antes da área de trabalho.

Os campos de senha atual, nova senha e confirmação foram preenchidos com valores demonstrativos válidos no previewer. A etapa está pronta para concluir a ação `Salvar senha` e liberar o dashboard somente após a alteração da senha temporária.

A ação `Salvar senha` foi concluída com sucesso no previewer. Somente então o dashboard foi exibido, acompanhado da mensagem `Senha atualizada.`, confirmando a sequência: matrícula e senha → primeiro acesso → alteração de senha → área de trabalho.

## Simplificação visual

A tela de acesso foi validada em desktop e celular após a remoção do símbolo operacional de cabeçalho, dos metadados, da orientação persistente de primeiro acesso e dos textos auxiliares do painel direito. O formulário mantém somente título, Matrícula, Senha, mensagem de validação quando necessária e botão `Entrar`; a sequência funcional de primeiro acesso permanece intacta.

Na simplificação final, o título de boas-vindas também foi removido. A página passou a operar como uma única folha administrativa sobre o contexto institucional: identidade SIGA SEMED, Matrícula, Senha, retorno de validação quando necessário e ação `Entrar`. As capturas desktop e celular confirmaram a composição, e a checagem de tipos e build de produção foram concluídos sem erro.

## Recomposição com barra lateral

A barra institucional foi restaurada à esquerda, mantendo o tratamento mais legível da imagem de Paço do Lumiar. A folha clean com SIGA SEMED, Matrícula, Senha e `Entrar` permanece exclusivamente na coluna direita. Em celular, a barra institucional aparece antes do formulário. As capturas nos dois tamanhos e a nova checagem de tipos e build foram concluídas sem erro.

## Páginas reconstruídas a partir da referência

O novo conjunto de páginas substitui a antiga simulação por Matrícula. Em desktop e celular, o acesso agora usa **Usuário** (placeholder `Ex.: tecnico1`) e **Senha**, como no primeiro código funcional. O preenchimento demonstrativo conduziu corretamente ao estado **Primeiro acesso**, que apresenta senha atual, nova senha, confirmação, mensagem obrigatória e as ações `Sair` e `Salvar senha` antes da área operacional. Nenhuma chamada ao banco antigo foi executada.

O build do conjunto de páginas foi concluído sem erro. A navegação foi reiniciada no previewer e as credenciais demonstrativas foram preenchidas na nova tela por Usuário/Senha para validar novamente a passagem para Primeiro acesso antes dos módulos operacionais.

No fluxo retomado, o botão `Entrar` abriu a etapa obrigatória de Primeiro acesso. Senha atual, Nova senha e Confirmar nova senha foram preenchidas com valores demonstrativos válidos, mantendo o dashboard bloqueado até a ação `Salvar senha`.

Após `Salvar senha`, o shell operacional foi exibido com identificação do usuário/papel, ações de senha, atualização, impressão, exportação e saída, além dos cinco indicadores de resumo. A aba inicial de Contratos e Processos mostrou cadastro, filtros e quatro registros expansíveis; a troca para Documentos mostrou cadastro, filtros e os três tipos documentais da referência: Ofício, Memorando e Despacho.

A rota interna de revisão visual foi capturada em viewport móvel. O shell reorganiza o cabeçalho, os cinco indicadores, abas, painel de cadastro, filtros e lista de registros em uma coluna, sem ocultar os campos ou quebrar a leitura dos itens. A rota não é exposta na navegação; ela existe apenas para inspeção visual desta fase sem banco.

## Início da visualização dos módulos

No previewer, a matrícula demonstrativa `700321-5` e a senha temporária acionaram corretamente a etapa de primeiro acesso. A sequência ainda exige senha atual, nova senha e confirmação antes da liberação dos módulos de Contratos e Processos e Documentos, conforme o comportamento preservado do código original.

Os três campos de alteração de senha foram preenchidos com dados demonstrativos válidos no previewer. A próxima ação `Salvar senha` libera a primeira área prevista para revisão: Contratos e Processos.

Após salvar a senha demonstrativa, o previewer abriu a área inicial de **Contratos e Processos**. Ela contém indicadores, abas de módulos, cadastro expansível, relatório/alertas, gráficos, filtros e registros expansíveis; a área **Documentos** permanece como a próxima etapa da revisão.

A sessão demonstrativa foi retomada para continuar a revisão pelo módulo Documentos, sem inserção, alteração ou exclusão de dados do preview.

A etapa de primeiro acesso foi novamente confirmada durante a retomada, com senha atual, nova senha e confirmação preenchidas de forma demonstrativa antes de retornar ao dashboard.

O módulo **Documentos** foi aberto com sucesso. Ele preserva cadastro expansível de ofício, memorando e despacho, indicadores documentais, gráfico por tipo, leitura de prazos, filtros e três itens expansíveis com prévia textual, edição e exclusão.

A lista documental e seus três registros foram visualizados no previewer junto aos controles de filtro e aos acionadores expansíveis. Nenhum dado foi modificado durante a revisão.
