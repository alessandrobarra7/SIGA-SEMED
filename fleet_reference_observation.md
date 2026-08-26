# Observação da referência — Frota

## Protocolo e limite de dados

O escopo foi consolidado a partir de registros locais de observação anterior feitos em modo somente leitura. Nenhum veículo, placa, condutor, fornecedor, valor, documento fiscal ou ocorrência da referência foi copiado. A reprodução usará exclusivamente dados demonstrativos no `localStorage`.

## Estrutura confirmada

| Contexto | Controles e campos observados | Reprodução local prevista |
|---|---|---|
| Cadastro de Veículos | Novo veículo, CSV, quatro indicadores, busca por placa/modelo/patrimônio, filtro por situação, lista ou estado vazio. | Catálogo local de veículos, pesquisa, situação e indicadores. |
| Controle de Abastecimento | Veículo, data, quilometragem, litros, valor unitário, fornecedor, responsável e documento fiscal; salvamento e lista. | Lançamento local com cálculo de valor total, documento demonstrativo e vínculo de veículo. |
| Controle de Manutenção | Veículo, data, quilometragem, tipo, fornecedor, custo, próxima data, próxima quilometragem e descrição. | Ordem local com custo, alertas de próxima revisão e histórico de veículo. |
| Controle de Ocorrências | Veículo, data, tipo, situação, local, responsável e descrição. | Registro local com estado, responsável e resolução auditável. |
| Relatórios | Conteúdo, veículo, situação, período, exportação e quatro indicadores agregados. | Consolidações, filtros, CSV e impressão somente locais. |

## Regras locais derivadas

> Frota será construída sobre a base de governança já aprovada: veículo, responsável, centro de custo, contrato, documento, fonte financeira e executor serão referências estruturadas opcionais ou obrigatórias conforme a operação. Abastecimento, manutenção e ocorrência terão estados e auditoria transversal.

| Operação | Permissão proposta | Controle local |
|---|---|---|
| Criar ou editar veículo | Administrador ou Técnico com Frota | Código e patrimônio únicos; situação obrigatória. |
| Registrar abastecimento ou manutenção | Administrador ou Técnico autorizado | Quilometragem e valores positivos; vínculo de veículo; auditoria. |
| Encerrar ocorrência ou cancelar lançamento | Administrador | Segregação por ação e trilha transversal. |
| Consultar relatórios | Perfis com leitura de Frota | Filtros e exportação exclusivamente demonstrativos. |
