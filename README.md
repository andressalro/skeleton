# Skeleton

Monorepo base para microfrontends, microservicios y despliegue con AWS CDK.

## Estructura

```text
web/                             Frontends y microfrontends
packages/
  reports/
    apps/                        Entrypoints del dominio reports
    context/                     Bounded contexts DDD del dominio reports
shared/
  core/                          Building blocks compartidos de DDD/aplicacion
common-infra/                    Clientes e infraestructura reutilizable
infra/                           CDK stacks y constructs
```

## Flujo actual

Este skeleton ya incluye un contexto funcional de `pdf-generation`, con:

- Lambda HTTP para generar PDFs
- Contexto DDD de generacion de PDF
- Repositorios DynamoDB
- Almacenamiento de artefactos en S3
- Publicacion de eventos a EventBridge
- Stacks CDK para API Gateway, Lambda, S3, DynamoDB y permisos

## Comandos

```bash
pnpm install
pnpm build
pnpm synth
pnpm deploy
```
