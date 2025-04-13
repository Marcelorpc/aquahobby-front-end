# Aquahobby

Projeto front-end para gerenciamento de aquários, com funcionalidades de cadastro, edição, remoção e visualização de dados. Desenvolvido com HTML, CSS e JavaScript puro, integrando com uma API REST para persistência dos dados.

### Observações

- O projeto foi desenvolvido como parte da entrega do MVP da sprint de **Desenvolvimento Full Stack Básico** da pós-graduação em **Engenharia de Software da PUC-Rio**.

## Funcionalidades

- Cadastro de aquários com nome, volume, temperatura e pH
- Verificação de disponibilidade de nome
- Listagem dos aquários cadastrados
- Edição de aquários
- Remoção de aquários com confirmação
- Integração com API REST (`http://localhost:5000`)

## 🚀 Como Executar
- Clone este repositório
- Clone o repositório da API: https://github.com/Marcelorpc/aquahobby-api
- Execute a API localmente
- Certifique-se de que a API esteja rodando em: http://localhost:5000
- Agora basta abrir o index.html deste projeto

## Endpoints Esperados
O front-end se comunica com os seguintes endpoints da API:

- GET /aquarios: retorna todos os aquários

- GET /aquario: retorna um aquário

- POST /aquario: cadastra novo aquário

- PUT /aquario?nome=...: edita um aquário existente

- DELETE /aquario?nome=...: remove um aquário por nome

## Tecnologias Utilizadas
- HTML5

- CSS3

- JavaScript (Vanilla)

- Git

- Github