## Projeto Helpinho

### Descrição Geral

Este projeto foi desenvolvido utilizando uma série de tecnologias para garantir uma experiência rica tanto no front-end quanto no back-end.

### Tecnologias Utilizadas

- **Front-end**:

  - **PrimeNG**: Utilizado para integrar componentes ricos e interativos.
  - **Tailwind CSS**: Implementado para estilização e layout responsivo de maneira eficiente.
  - **Login com Google**: Configurado para facilitar o cadastro e autenticação de usuários.
  - **CI/CD**: Foi implementado um pipeline de CI/CD para realizar builds automáticos a cada novo merge request na branch `develop`. Futuramente, pode ser configurado para deploy em produção na AWS.

- **Back-end**:
  - **Node.js 18**: Base da aplicação no servidor, proporcionando um ambiente robusto e escalável.
  - **PostgreSQL**: Utilizado como banco de dados relacional, integrando-se perfeitamente com a aplicação.
  - **Serverless com AWS Lambda**: Foi tentada a migração para um ambiente serverless utilizando AWS Lambda. A instância foi criada e funcionou bem, exceto por um problema de CORS que impediu a total funcionalidade.

### Desafios

Durante a migração para o ambiente serverless, enfrentamos um desafio relacionado ao CORS, que impediu a aplicação de funcionar plenamente na AWS Lambda.

### Próximos Passos

- Resolver o problema de CORS na instância AWS Lambda.
- Configurar o pipeline de CI/CD para incluir deploy automático na AWS.
