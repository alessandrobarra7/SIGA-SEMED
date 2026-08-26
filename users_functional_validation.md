# Validação funcional da página Usuários

## Cobertura concluída

A página **Usuários** foi validada em desktop e em viewport móvel real de 390 × 844 pixels, sem alteração da identidade visual oficial. A lista móvel mantém indicadores, pesquisa e os quatro filtros funcionais — perfil, situação, tipo de login e permissão — em sequência vertical legível.

O cadastro foi validado para acesso por **matrícula** e para os perfis externos que utilizam **CPF**. Ao selecionar Auditoria Externa ou Contadora Municipal, o formulário informa explicitamente o tipo de acesso CPF, exibe o campo correspondente e substitui a seleção manual de módulos por um resumo de permissões automáticas bloqueadas.

Também foram validados cadastro local, senha provisória exibida uma única vez, edição, ativação/desativação, encerramento de sessões, auditoria sem senha, bloqueios administrativos, primeiro acesso, migração local, persistência e login por matrícula ou CPF. A regressão final contém 44 testes aprovados, além de checagem TypeScript e build de produção concluídos.

Nenhuma credencial, matrícula, CPF ou senha do ambiente de referência foi copiada para o projeto.
