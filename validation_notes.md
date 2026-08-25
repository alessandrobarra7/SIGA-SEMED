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
