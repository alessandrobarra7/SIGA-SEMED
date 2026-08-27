# Roteiro de persistência real de negócio

## Escopo desta etapa

O projeto possui agora uma primeira camada de persistência real em MySQL/Drizzle para as identidades do domínio SIGA, Cadastros Gerais, Agenda, Mensagens, confirmações de leitura e Lembretes. A interface preserva o modo demonstrativo em `localStorage` enquanto não houver um usuário de domínio ativo autenticado por sessão segura.

> Este roteiro não autoriza, importa ou transforma dados reais de Cloudflare D1. A migração de dados reais continua sendo uma etapa independente, posterior à validação das tabelas e regras de negócio de destino.

## Ordem de migração proposta

| Ordem | Grupo de persistência | Dependências | Resultado esperado |
|---:|---|---|---|
| 1 | Identidades de domínio e permissões | Infraestrutura atual | Sessões seguras, perfis e autorizações sem dependência do login visual. |
| 2 | Cadastros Gerais e Início | Grupo 1 | Referências institucionais, agenda, comunicados e lembretes compartilháveis. |
| 3 | Unidades Escolares e Turmas | Grupos 1 e 2 | Cadastro escolar, censo, infraestrutura e turmas como bases relacionais. |
| 4 | Documentos, Contratos e Gestão | Grupos 1 a 3 | Processos, documentos, tarefas, anexos e aprovações vinculados. |
| 5 | Estoque, Kit do Aluno e Agricultura Familiar | Grupos 2 a 4 | Itens, movimentações, contratos de fornecimento, guias, recebimentos e faturamento. |
| 6 | Nutrição | Grupos 3 e 5 | Unidades atendidas, cardápios, planejamento e acompanhamento anual. |
| 7 | Recursos Humanos | Grupos 1 e 3 | Servidores, frequência, ficha financeira e holerites. |
| 8 | Financeiro, Frota, Educa Paço e Configurações | Grupos 1 a 7, conforme vínculo | Execução financeira, patrimônio operacional, núcleos, parâmetros e auditoria. |

## Regras de compatibilidade

| Cenário | Comportamento mantido |
|---|---|
| Banco indisponível ou sem usuário de domínio ativo | A interface mantém o armazenamento local e todos os fluxos demonstrativos existentes. |
| Sessão de domínio válida | Cadastros Gerais, Agenda, Mensagens e Lembretes usam procedimentos tRPC protegidos e tabelas MySQL. |
| Dados reais legados | Nenhuma importação automática é executada. |
| Login oficial | A composição, identidade visual e fluxo do login não são alterados por esta camada. |

## Critério para cada próximo grupo

Cada grupo deve conter, no mínimo, o modelo Drizzle, uma migração revisada sem operações destrutivas, procedimentos tRPC autorizados, testes de regra de negócio e fallback local. A interface só passa a consumir dados do banco após uma sessão de domínio válida e compatível com o usuário do ambiente atual.
