# Mapa de páginas do novo SIGA SEMED

## Princípio de fidelidade

As páginas serão reconstruídas como uma nova implementação visual. A sequência, os campos e as ações abaixo foram extraídos do código de referência e não devem ser trocados por equivalentes inventados.

| Ordem | Página ou estado | Conteúdo obrigatório |
|---:|---|---|
| 1 | Verificação de acesso | Marca SIGA SEMED e estado `Carregando acesso` |
| 2 | Login | Usuário, Senha, mensagem de erro e botão `Entrar` |
| 3 | Primeiro acesso | Senha atual, Nova senha, Confirmar nova senha, mensagem e botão `Salvar senha` |
| 4 | Shell operacional | Cabeçalho, usuário/papel, ações de senha, atualizar, imprimir, exportar CSV e sair |
| 5 | Resumo | Registros, Ativos, A vencer, Vencidos e Saldo a pagar |
| 6 | Contratos e Processos | Cadastro/edição, filtros, listagem expansível, detalhes e pagamentos |
| 7 | Documentos | Cadastro/edição, filtros, listagem expansível, prévia e ações documentais |
| 8 | Segurança em contexto | Alteração de senha disponível dentro do shell operacional |

## Login

O rótulo será **Usuário**, com placeholder `Ex.: tecnico1`. Não será usado o rótulo Matrícula nesta reconstrução, pois ele não existe no primeiro componente funcional. A senha é obrigatória, e o estado de envio troca a ação para `Entrando...`.

## Primeiro acesso

O primeiro acesso é um bloqueio, não uma preferência visual. O dashboard só abre após a troca da senha temporária. A tela contém o nome do usuário, o contexto `Primeiro acesso`, a instrução de alteração de senha, os três campos obrigatórios e o retorno de erro caso a confirmação seja diferente ou a senha não atenda às regras.

## Contratos e Processos

A página conservará o formulário com: tipo, número, objeto/assunto, parte interessada, setor, responsável, valor, categoria financeira, data de próximo pagamento quando aplicável, início, vencimento, situação, observações e dias de alerta.

Filtros obrigatórios: busca textual, tipo, situação/alerta e setor. A listagem terá registro expansível e espaço para baixas de pagamento, saldo, edição e exclusão confirmada.

## Documentos

A página conservará o formulário com: tipo, número, modelo, assunto, destino, destinatário, vínculo, responsável, data, prazo de resposta, situação, resumo e observações.

Os tipos são Ofício, Memorando e Despacho. A lista terá busca, filtro de tipo, filtro de situação/alerta, detalhe expansível, prévia textual, edição e exclusão confirmada.

## Limite da fase atual

Nesta fase, os botões demonstrarão as páginas, estados e transições de interface. Cloudflare D1, sessão, rotas e persistência serão conectados posteriormente, preservando exatamente os contratos de dados documentados no código de referência.
