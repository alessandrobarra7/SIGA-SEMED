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
