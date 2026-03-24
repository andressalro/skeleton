# Skeleton Monorepo

Monorepo Node.js + Express + TypeScript con DDD y Clean Architecture, gestionado con **pnpm workspaces**.

## Estructura

```
├── shared/                          # Módulos compartidos
│   ├── ddd/                         # @shared/ddd — Entity, AggregateRoot, ValueObject, DomainEvents
│   ├── clean-architecture/          # @shared/clean-architecture — UseCase, Repository, BaseController, DI
│   ├── logging/                     # @shared/logging — Logger con Pino (JSON + pretty)
│   ├── error-handling/              # @shared/error-handling — Jerarquía de errores tipados
│   └── utils/                       # @shared/utils — Utilidades de fecha y string
├── services/                        # Microservicios (próximamente)
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## Requisitos

- Node.js >= 20
- pnpm >= 9

## Inicio rápido

```bash
pnpm install
pnpm -r run test
pnpm -r run build
```

## Paquetes compartidos

| Paquete | Descripción |
|---------|-------------|
| `@shared/ddd` | Clases base DDD: Entity, AggregateRoot, ValueObject, UniqueEntityId, DomainEvent, EventPublisher |
| `@shared/clean-architecture` | Interfaces UseCase/Repository, BaseController Express, DTOs, error middleware, request validator con Zod, DI con tsyringe |
| `@shared/logging` | Logger basado en Pino con formato JSON (CloudWatch) y texto (desarrollo local) |
| `@shared/error-handling` | Jerarquía de errores: BaseError → DomainError, ApplicationError, InfrastructureError, NotFoundError, ValidationError, UnauthorizedError |
| `@shared/utils` | Utilidades puras: date-utils (addDays, diffInDays, etc.) y string-utils (camelCase, slugify, etc.) |
