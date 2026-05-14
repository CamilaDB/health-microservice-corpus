
# Health Microservice Corpus

This project is a health microservice built with [NestJS](https://nestjs.com/) and TypeScript, designed to manage patients, encounters, orders, and results in a healthcare context. It uses PostgreSQL as the database and TypeORM for ORM.

## Features

- **Patient Management**: CRUD operations for patients
- **Encounter Management**: Track patient encounters and their statuses
- **Order Management**: Create and manage medical orders
- **Result Management**: Store and retrieve results for orders
- **Health Check**: `/health` endpoint for service status

## Project Structure

```
src/
  patient/      # Patient domain logic
  encounter/    # Encounter domain logic
  order/        # Order domain logic
  result/       # Result domain logic
  health/       # Health check endpoint
  database/     # TypeORM data source and migrations
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- Docker & Docker Compose (for local DB)

### Installation

```bash
npm install
```

### Running the Application

#### Development
```bash
npm run start:dev
```

#### Production
```bash
npm run build
npm run start:prod
```

#### Using Docker Compose
```bash
docker-compose up --build
```
The API will be available at `http://localhost:3000` by default.

#### Database
The service uses PostgreSQL. By default, Docker Compose will start a `health_db` container. Connection details can be configured via environment variables in `docker-compose.yml`.

#### Migrations
Generate a new migration:
```bash
npm run migration:generate -- <MigrationName>
```
Run migrations:
```bash
npm run migration:run
```
Revert last migration:
```bash
npm run migration:revert
```

## Testing

Run all tests:
```bash
npm run test
```
Run e2e tests:
```bash
npm run test:e2e
```
Test coverage:
```bash
npm run test:cov
```

## Code Quality

Lint code:
```bash
npm run lint
```
Format code:
```bash
npm run format
```
Check complexity (warns if complexity > 1 in services/repositories):
```bash
npm run complexity
```

## API Endpoints

- `GET /health` - Health check
- `GET /patients`, `POST /patients`, etc. - Patient management
- `GET /encounters`, `POST /encounters`, etc. - Encounter management
- `GET /orders`, `POST /orders`, etc. - Order management
- `GET /results`, `POST /results`, etc. - Result management

## License

This project is UNLICENSED. See the `package.json` for details.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
