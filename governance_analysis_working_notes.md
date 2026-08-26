# Análise de governança — notas de trabalho

## Escopo

Esta análise examina exclusivamente o código e os dados demonstrativos locais do preview. Nenhum dado externo, credencial ou registro de produção foi consultado ou reproduzido.

## Perfis e política central atual

| Perfil | Leitura atual | Escrita atual |
|---|---|---|
| Administrador | Todos os módulos | Todos os módulos; exclusividade para Usuários, Configurações, Fontes e Regras financeiras. |
| Técnico | Somente chaves concedidas individualmente | As mesmas chaves concedidas individualmente. |
| Gestor Escolar | Início e Unidades Escolares | Sem escrita; o escopo de unidade existe nas operações escolares de Estoque. |
| Secretário Escolar | Início e Unidades Escolares | Sem escrita. |
| Auditoria Externa | Todos os módulos, exceto Usuários | Sem escrita. |
| Contadora Municipal | Todos os módulos, exceto Usuários | Financeiro, quando a chave do módulo estiver acessível. |

## Fluxos e dependências confirmadas

| Fluxo | Dados de origem | Dados derivados ou consumidores | Estado de vínculo |
|---|---|---|---|
| Unidade escolar | Unidades Escolares | RH, Estoque escolar, Nutrição semanal | Usa os mesmos IDs demonstrativos em parte dos fluxos. |
| Nutrição | Escolas, contratos próprios e catálogo próprio | Planejamentos semanais e anuais | Contratos e catálogo não estão vinculados por chave às tabelas de Contratos ou Estoque. |
| Estoque | Catálogo central e saldos por escola | Movimentações, conferências e pedidos de kit | Referências de origem/destino permanecem textuais. |
| RH | Servidores vinculados à unidade | Ficha financeira e frequência | Não há vínculo financeiro direto com Execução do Financeiro. |
| Financeiro | Fontes, regras, planejamento, receitas e execução | Indicadores e relatórios | Referência de documento é textual; não há vínculo obrigatório com Contratos, Documentos ou pagamentos de contratos. |
| Contratos e Documentos | Registros, pagamentos e documentos | Saldo por contrato e referências internas | Operações não recebem ator nem geram auditoria uniforme no repositório central. |
| Configurações | Parâmetros institucionais locais | Interface de configurações e auditoria própria | Exercício, sessão, senha mínima e alertas ainda não são consumidos globalmente. |

## Lacunas preliminares a confirmar

1. A política de leitura para Auditoria Externa e Contadora Municipal é ampla, inclusive em setores que normalmente requerem minimização de dados pessoais.
2. O Técnico pode acumular leitura e escrita para qualquer conjunto de chaves concedidas; não há separação de funções por etapa de processo.
3. Contratos, documentos, pagamentos de contratos, estoque, nutrição, RH e financeiro têm vínculos textuais ou paralelos em pontos críticos, o que pode criar divergência entre saldos e execução.
4. A auditoria é robusta em Usuários, RH, Financeiro, Estoque e Configurações, mas não é uniforme em Contratos, Documentos, Nutrição, Unidades e Educa Paço.
5. Configurações institucionais persistem e auditam alterações, mas vários parâmetros ainda são informativos e não governam a autenticação, alertas ou os filtros dos módulos.

## Mudanças efetivas candidatas

1. Criar uma matriz de responsabilidades por setor e etapa, separando preparar, revisar, aprovar, executar e auditar.
2. Introduzir referências estruturadas — não apenas texto — entre documentos, contratos, pagamentos, fontes financeiras, estoque e planos de nutrição.
3. Unificar a trilha de auditoria para atos que alteram cadastros, valores, saldos, estados e permissões.
4. Tornar parâmetros institucionais realmente consumidos: exercício padrão, dias de alerta, duração de sessão e política de senha.
5. Projetar Frota sobre os mesmos identificadores estruturados desde o início: veículo, condutor, centro de custo, contrato, abastecimento, manutenção, documento e executor.
