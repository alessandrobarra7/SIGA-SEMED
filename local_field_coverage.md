# Cobertura local de campos — expansão sequencial

> **Finalidade.** Este documento registra os grupos de coleta implementados no preview do SIGA SEMED em 27/08/2026. Todos os registros descritos são demonstrativos, persistidos apenas no `localStorage` do navegador. Não há conexão, importação, sincronização ou migração de dados com Cloudflare D1 ou qualquer sistema externo.

## Visão consolidada

| Grupo | Coleções locais | Relações protegidas | Estado |
|---|---|---|---|
| Unidades Escolares e Turmas | Unidades escolares expandidas; Turmas | Turma vinculada ao INEP e ao ano letivo | Concluído |
| Agenda, Mensagens e Lembretes | Eventos; mensagens; confirmações de leitura; anotações individuais | Mensagem vinculada ao remetente e destinatário; lembrete restrito ao autor | Concluído |
| Cadastros Gerais | Cadastros institucionais | Código único por registro; edição pelo módulo autorizado | Concluído |
| Agricultura Familiar | Entidades; contratos; itens; planos; guias; itens de guia; faturamentos | Entidade → contrato → produto/plano/guia → recebimento → faturamento | Concluído |
| PDDE/FNDE | Unidades executoras; contas; itens de prestação | Escola → Unidade Executora → Conta → Prestação | Concluído |

## Unidades Escolares e Turmas

O cadastro de Unidades Escolares passou a coletar identificação institucional, código/INEP local, endereço e contatos, etapas de ensino, turnos, censo, matrículas por etapa e ano, necessidades educacionais especiais, infraestrutura, acessibilidade, alimentação, conectividade e observações. O destino **Turmas** coleta unidade escolar, INEP, ano letivo, etapa/modalidade, identificação da turma, turno, quantidade de estudantes, capacidade, origem e data de referência. A gravação exige unidade, ano e identificação válidos, preservando registros existentes por migração local compatível.

## Agenda, Mensagens e Lembretes

A página Início deixou de usar listas fixas para esses contextos. Eventos registram título, data, horário, categoria, prioridade, responsável, situação e observações; podem ser concluídos localmente e alimentam a agenda do painel. Mensagens registram destinatário, assunto, conteúdo, autor e data, com confirmação de leitura individual. Lembretes pertencem ao usuário que os criou e são reidratados após recarga do navegador.

## Cadastros Gerais

Os Cadastros Gerais passaram a registrar tipo institucional, código, nome, documento demonstrativo, contato, e-mail, telefone, setor, função, endereço, situação e observações. A tela oferece pesquisa, filtro, criação e edição local; códigos duplicados são bloqueados. Esses registros são referências internas demonstrativas, não cadastros reais de pessoas, fornecedores ou entidades.

## Agricultura Familiar

O fluxo local contém entidades fornecedoras com tipo, documento demonstrativo, representante, contatos, endereço e situação; contratos com entidade, processo, vigência, situação e observações; produtos contratados com unidade, quantidade e preço; planos mensais por escola, contrato, modalidade, semanas e itens; guias com numeração local, escola, entrega, transportador e itens; confirmação de recebimento; e faturamento local. O faturamento só é aceito para guia recebida, de modo que a sequência de dados não pode ser registrada fora de ordem.

## PDDE/FNDE

O novo destino **Unidades Escolares > PDDE/FNDE** coleta Unidade Executora com escola, CNPJ demonstrativo, mandato, presidência, tesouraria, conselhos, estatuto, ata, percentuais de custeio e capital e observações. As contas coletam escola, exercício, programa, subprograma, saldo reprogramado, parcelas, datas, identificador interno, situação e observações. A prestação de contas registra conta, data, número de documento, descrição, natureza, quantidade, valor, referência documental e observações. O total da conta é derivado localmente; a primeira prestação altera a conta para o estado **Em prestação de contas**.

## Limites intencionais

| Aspecto | Limite mantido |
|---|---|
| Persistência | Exclusivamente `localStorage`; cada navegador mantém seu próprio conjunto demonstrativo. |
| Dados | Nenhum dado real, documento, valor, identificador ou credencial da referência é utilizado. |
| Integrações | Não há D1, Cloudflare, banco externo, API de terceiros ou sincronização. |
| Autorização | As operações continuam condicionadas às permissões já existentes do perfil local. |
| Login | A tela e o comportamento de acesso aprovados permanecem fora do escopo desta expansão. |
