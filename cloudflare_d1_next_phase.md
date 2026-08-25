# Integração Cloudflare D1 — Arquivada

O plano de conectar este novo SIGA SEMED ao Cloudflare D1 foi **arquivado por decisão de escopo**. Esta versão não acessa banco externo, não cria bindings, não executa SQL e não utiliza dados da referência.

Em seu lugar, a aplicação usa uma simulação local compatível descrita em [`local_compatibility_model.md`](./local_compatibility_model.md). Ela preserva o desenho de usuários, sessões, registros, pagamentos e documentos para que as páginas possam operar localmente e manter uma estrutura semelhante à do código de referência.
