# Unilink

Rede social para estudantes da UNIRIO, desenvolvida na disciplina de **Projeto Integrador 2**.

**Equipe:** Amanda de Lima Campos Brandes e Thiago Ramos Ivo

## Entregas

| Entrega | Data | Link |
| --- | --- | --- |
| 1º teste de carga | 09/11/2026 | [Medições do SLA](testes-de-carga/README.md) |
| 2º teste de carga | 16/11/2026 | [Medições do SLA](testes-de-carga/README.md) |

## Como o sistema funciona

```
Navegador (HTML, CSS, JS)  --HTTP/JSON-->  Back-end (Java + Spring Boot)  --JDBC/SQL-->  MySQL 8
```

Tudo roda no seu computador dentro do Docker: um container com o banco e outro com o back-end,
que também entrega o site. Assim o site e a API ficam no mesmo endereço, `localhost:8080`.

## Como rodar no seu computador

Só é preciso ter o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **aberto**.

1. Abra um terminal na pasta do projeto (no VS Code: *Terminal → New Terminal*).
2. Ligue tudo:

   ```
   docker compose up -d --build
   ```

   Na primeira vez demora alguns minutos, porque o Docker baixa o MySQL e o Java e compila o projeto.
3. Confira no navegador:
   - <http://localhost:8080> abre o site (tela de login)
   - <http://localhost:8080/api/status> deve mostrar `{"backend":"ok","banco":"ok","estudantes":5}`
   - <http://localhost:8080/api/postagens> deve mostrar as 3 postagens da carga inicial

### Comandos do dia a dia

| Quero... | Comando |
| --- | --- |
| Ligar o sistema (e recompilar se o código mudou) | `docker compose up -d --build` |
| Desligar o sistema (os dados ficam guardados) | `docker compose down` |
| Apagar o banco e recriar do zero com a carga inicial | `docker compose down -v` e depois `docker compose up -d --build` |
| Ver os logs do back-end (útil quando dá erro) | `docker compose logs -f backend` |
| Abrir o MySQL pelo terminal | `docker compose exec mysql mysql -uunilink -punilink unilink_db` |

Para conectar um programa de banco (MySQL Workbench, DBeaver): host `localhost`, porta `3306`,
usuário `unilink`, senha `unilink`, banco `unilink_db`.

Os estudantes da carga inicial usam a senha `123456` (ex.: `thiago.ivo@edu.unirio.br`).

### Problemas comuns

- **"Cannot connect to the Docker daemon"**: o Docker Desktop não está aberto.
- **"port is already allocated" na porta 3306**: já existe um MySQL instalado no seu computador.
  Desligue esse MySQL, ou troque `"3306:3306"` por `"3307:3306"` no `docker-compose.yml`.
- **Mudei os arquivos da pasta `database/` e nada mudou**: os scripts só rodam quando o banco é criado.
  Use `docker compose down -v` e suba de novo.

### Rodar o back-end fora do Docker (opcional, para quem programa)

Precisa do Java 21. Ligue só o banco e rode o Spring Boot pelo Maven Wrapper:

```
docker compose up -d mysql
cd backend
./mvnw spring-boot:run        (no Windows: mvnw spring-boot:run)
```

## Pastas do projeto

```
unilink-pi2-amanda-thiago/
├─ backend/                 projeto Java (Spring Boot)
│  ├─ pom.xml               bibliotecas que o projeto usa
│  ├─ Dockerfile            receita para compilar e rodar o back-end no Docker
│  └─ src/main/
│     ├─ java/br/unirio/unilink/
│     │  ├─ controller/     portas de entrada da API (recebem o pedido, devolvem JSON)
│     │  ├─ service/        regras de negócio (validações dos casos de uso)
│     │  ├─ repository/     único lugar que fala com o banco (o SQL fica aqui)
│     │  └─ model/          formato dos dados (uma linha de cada tabela)
│     └─ resources/
│        └─ application.properties   endereço, usuário e senha do banco
├─ database/
│  ├─ 01-schema.sql         criação das tabelas (seção 10.1 da especificação)
│  └─ 02-carga.sql          carga inicial (seção 10.2 da especificação)
├─ frontend/                site (HTML, CSS e JavaScript puros, sem framework)
│  ├─ *.html                uma página por tela
│  ├─ css/base.css          cores, fonte, botões, campos e o menu (vale para todas as telas)
│  ├─ css/telas.css         estilos específicos de cada tela
│  ├─ js/app.js             funções usadas por todas as telas (menu, sessão, avisos, chamadas à API)
│  ├─ js/<tela>.js          comportamento de cada tela
│  └─ img/                  logo, ícones (icones.svg) e imagens
├─ testes-de-carga/         scripts do k6 e página com as medições
└─ docker-compose.yml       receita que liga o banco e o back-end juntos
```

Quem chama quem dentro do back-end: `Controller → Service → Repository → MySQL`.

## Telas

| Tela | Arquivo | Casos de uso |
| --- | --- | --- |
| Login | `index.html` | UC02 |
| Cadastro em 3 passos | `cadastro.html` | UC01 |
| Início: stories, publicar, filtros e feed | `home.html` | UC08, UC09, UC10 |
| Descobrir (cards) | `descobrir.html` | UC03 |
| Joga pra Rolo | `jogaprarolo.html` | UC05, UC11 |
| Eventos | `eventos.html` | UC06 |
| Mensagens e Unibot | `mensagens.html` | UC04 |
| Seu perfil e Central de Ajuda | `perfil.html` | UC07 |

O feed da tela inicial já lê as postagens do banco. As outras telas ainda usam dados de exemplo
(os mesmos da carga inicial) e passam a usar a API conforme cada endpoint fica pronto.

Como o site é lido direto da pasta `frontend`, depois de mudar um HTML, CSS ou JS basta recarregar a página.

## Endpoints disponíveis

| Método | Endereço | O que faz |
| --- | --- | --- |
| GET | `/api/status` | Confere se o back-end e o banco estão no ar |
| GET | `/api/postagens` | Lista as postagens do feed, da mais nova para a mais antiga |
