# Validação do modelo local compatível

## Escopo confirmado

O primeiro pacote funcional segue isolado e somente leitura. O novo projeto não acessa Cloudflare D1, não utiliza MySQL, não chama endpoints do sistema original e não contém dados, cookies, tokens, hashes, sais ou credenciais extraídos da referência.

As páginas operam com uma simulação local própria no `localStorage` do navegador. A estrutura, os campos, as relações e as regras de cálculo correspondem ao modelo analisado, conforme o mapeamento documentado em [`local_compatibility_model.md`](./local_compatibility_model.md).

## Acesso e Segurança

O fluxo visual usa **Usuário** e **Senha**, com `Ex.: tecnico1` como exemplo de entrada. O primeiro acesso exige senha atual, nova senha e confirmação, aplicando confirmação igual, mínimo de dez caracteres e nova senha diferente da atual. O painel Minha senha reapresenta essas regras dentro do shell.

Essas telas são demonstrativas: não consultam senha real, não fabricam hash e não criam sessão segura. A coleção local `semedUsers` mantém a forma estrutural dos campos de usuário; ao entrar, `semedSessions` recebe apenas uma sessão simulada com identificador local e expiração de sete dias, removida ao sair.

Na revisão do fluxo principal, a entrada demonstrativa com o usuário `admin` exibiu a identidade **Administrador** e conduziu corretamente à tela obrigatória de Primeiro acesso antes da área operacional. A identidade foi obtida pela estrutura local, sem consultar o código ou o banco de referência.

O ciclo foi concluído com valores exclusivamente demonstrativos: a alteração de senha liberou o shell como Administrador. Esse percurso atualiza somente o marcador `mustChangePassword` e uma sessão simulada na coleção local; nenhum segredo é conservado ou enviado para fora do navegador.

Após recarregar a página, o mesmo usuário demonstrativo foi autenticado novamente e seguiu diretamente para o shell, sem repetir Primeiro acesso. Isso confirma a persistência local do marcador de primeiro acesso no navegador.

No shell, a exclusão de um contrato abriu o diálogo que identifica o registro e exige `EXCLUIR`. O diálogo foi fechado por Cancelar, sem remover o item demonstrativo. A suíte automatizada complementa essa verificação visual ao testar que a camada local bloqueia a exclusão com texto incorreto e remove o registro — junto das baixas relacionadas — apenas com a confirmação correta.

## Revalidação de acesso demonstrativo

O fluxo principal foi reexecutado com `admin` e `tecnico1`, usando uma senha demonstrativa não vazia. O perfil Administrativo abriu diretamente o shell quando o Primeiro acesso já estava concluído no navegador; o perfil Técnico abriu corretamente a etapa obrigatória de alteração de senha. A regressão automatizada passou a validar os três usuários locais (`admin`, `tecnico1` e `tecnico2`) e rejeita usuário inexistente.

A revisão manual foi concluída com `tecnico2`: a autenticação abriu corretamente Primeiro acesso para **Técnico SEMED 2**. Assim, `admin`, `tecnico1` e `tecnico2` foram validados tanto no fluxo local quanto na cobertura de regressão, sem reprodução de falha de autenticação.

## Reorganização conforme a referência

No shell de revisão, o módulo Contratos e Processos passou a seguir a sequência observada na referência: cabeçalho institucional, resumo de cinco cartões, abas, cadastro expansível em largura total, painel “Acompanhamento / Relatório e alertas”, faixa de alertas, filtros e lista de accordions. A antiga composição com o cadastro lateral foi removida. Os filtros ficaram na ordem Buscar, Tipo, Situação e Setor; os accordions passaram a priorizar apenas o número no resumo.

O módulo Documentos foi revisado na mesma estrutura vertical: cadastro expansível, painel “Controle documental”, cinco indicadores específicos, alertas documentais, filtros e lista. A captura móvel confirmou a leitura sequencial dos cartões, abas, cadastro, alertas, filtros e accordions em uma coluna, sem o painel lateral que divergira da referência.

O accordion do Memorando 238/2026 também foi aberto após a reorganização. Os campos de tipo, situação, data, prazo, modelo, destino, destinatário, vínculo e assunto permanecem disponíveis, seguidos da prévia textual e das ações locais Editar e Excluir.

O Contrato 012/2026 foi aberto no módulo reorganizado. O detalhe preserva os campos do registro, os valores de contrato, pago e saldo, o histórico de baixa local, além dos comandos Registrar baixa, Editar e Excluir.

## Operações locais validadas

No módulo Contratos e Processos, busca, filtros por tipo/setor/situação, criação, edição, exclusão confirmada por `EXCLUIR`, baixa, remoção de baixa e exportação CSV operam sobre as coleções locais. A baixa atualiza o histórico, o valor pago e o saldo do contrato por relação `recordId`; valores acima do saldo são rejeitados.

No módulo Documentos, filtros, cadastro, edição, exclusão confirmada e prévia textual usam os campos estruturais de Ofício, Memorando e Despacho. A normalização de texto para maiúsculas ocorre na camada local antes da persistência no navegador.

## Evidências de validação

Foram executados `pnpm check`, `pnpm test` e `pnpm build` com êxito. A suíte atual contém **24 testes** para encerramento de sessão do template, regras de Primeiro acesso, cálculo financeiro, estrutura local, ciclo de sessão, CRUD de registros e documentos, baixas, exclusões em cascata, confirmação textual, serialização e persistência real em `window.localStorage`.

A suíte de navegador cria, edita, registra baixa, exclui, salva e reidrata dados por `window.localStorage`; também confirma que Primeiro acesso concluído persiste após a recarga. Além dos helpers, o hook `useSigaLocalRepository` usado diretamente por `Home.tsx` e `WorkspacePreview.tsx` foi montado em jsdom: o teste confirma criação, edição, baixa, bloqueio sem `EXCLUIR`, exclusão confirmada e reidratação pelo mesmo adaptador. A revisão no preview confirmou o carregamento da lista pelo modelo local, a abertura de contrato, edição de registro, abertura e edição de documento, filtros, detalhes expansíveis e a confirmação visual de exclusão.

Em viewport móvel de 375 px, cabeçalho, indicadores, abas, formulário, filtros e lista foram renderizados em uma única coluna sem sobreposição. O aviso de bundle JavaScript acima de 500 kB permanece não bloqueante.
