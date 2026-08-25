# Validação do primeiro incremento visual

## Escopo e referência

O pacote funcional original permaneceu isolado e somente leitura. O novo projeto contém páginas próprias, com dados demonstrativos locais e sem chamadas ao banco, cookies, hashes, credenciais ou endpoints do sistema de referência. O plano futuro mantém um Cloudflare D1 novo e independente; nenhuma tabela ou dado antigo foi copiado.

## Acesso e Segurança

A rota principal inicia no estado de verificação e apresenta o login por **Usuário** e **Senha**, com o placeholder `Ex.: tecnico1`, exatamente como a interface e o contrato de autenticação analisados no código de referência. Não há campo de Matrícula no fluxo atual.

O acesso demonstrativo conduz ao estado obrigatório de **Primeiro acesso**, com Senha atual, Nova senha e Confirmar nova senha. A validação visual exige confirmação igual, no mínimo dez caracteres e nova senha diferente da atual. Após a demonstração, o shell oferece também a página contextual **Minha senha**, com os mesmos campos e regras, acionável sem deixar a área operacional.

## Contratos e Processos

O shell apresenta indicadores, abas, cadastro expansível, busca, filtros por tipo, **setor** e situação, além dos registros expansíveis. Cada contrato exibe parte interessada, setor, responsável, vigência, categoria financeira, observações, edição e exclusão visual.

O detalhe financeiro usa somente dados demonstrativos do navegador. Ele mostra Valor do contrato, Já pago e Saldo a pagar derivados das baixas locais, histórico de pagamentos e o formulário **Registrar baixa** com data, valor e observação. A baixa não permite valor superior ao saldo demonstrativo e atualiza a leitura local; a persistência ficará para a fase Cloudflare D1.

## Documentos e exclusões

O módulo Documentos contém cadastro expansível e listagem de Ofício, Memorando e Despacho, com filtros, detalhes e prévia textual estruturada por modelo, destino, destinatário, vínculo, datas e resumo. As ações Excluir, tanto de registros quanto de documentos, abrem uma confirmação visual que requer o texto `EXCLUIR`; nesta fase ela não remove dados.

## Validação técnica e responsiva

Foram executados `pnpm check`, `pnpm test` e `pnpm build` com êxito. A suíte possui oito testes, cobrindo saída de sessão, regras de Primeiro acesso e cálculo financeiro demonstrativo. O build emite apenas o aviso não bloqueante de bundle JavaScript acima de 500 kB.

A rota interna `/pages-preview`, não exposta na navegação pública, foi usada para revisar o shell em desktop. A composição mantém filtros, expansão do contrato, histórico e formulário de baixa legíveis. Durante a revisão, uma baixa de R$ 1.000,00 atualizou localmente o contrato de R$ 78.500,00 pago / R$ 270.000,00 de saldo para R$ 79.500,00 pago / R$ 269.000,00 de saldo, exibindo a mensagem de que a persistência dependerá da etapa D1. A confirmação de exclusão do contrato também foi aberta e apresentou o campo obrigatório `EXCLUIR`.

Em viewport móvel de 375 px, cabeçalho, indicadores, abas, cadastro, filtros e registros foram renderizados em sequência de uma coluna sem sobreposição. Os três filtros de Contratos e Processos — tipo, setor e situação — permanecem disponíveis e legíveis antes da lista.
