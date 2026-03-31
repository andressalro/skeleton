# Skeleton

Monorepo base para microfrontends, microservicios y despliegue con AWS CDK.

## Estructura

```text
web/                             Frontends y microfrontends
packages/
  utils/
    pdf-generation/              Utilidad con capas application/domain/infrastructure/interface
shared/
  core/                          Building blocks compartidos de DDD/aplicacion
common-infra/                    Clientes e infraestructura reutilizable
infra/                           CDK stacks y constructs
```

## Flujo actual

Este skeleton ya incluye una utilidad funcional de `pdf-generation`, con:

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

## Probar PDF localmente

Puedes correr `pdf-generation` sin Lambda y sin AWS:

```bash
pnpm pdf:local
```

Esto levanta un servidor local en `http://localhost:3100/pdf-document` y guarda:

- PDFs en `local-output/<tenantId>/`
- metadata JSON en `local-output/<tenantId>/metadata/`

Header requerido:

```text
x-api-key: local-tenant
```

Payload ejemplo:

```json
{
  "template": {
    "engine": "ejs",
    "body": "<html><body><h1><%= employee.name %></h1></body></html>",
    "header": "<div>Recibo</div>",
    "footer": "<div>Página <span class='pageNumber'></span></div>",
    "printConfig": {
      "top": "0.4",
      "bottom": "0.6",
      "left": "0.3",
      "right": "0.2",
      "format": "Letter"
    }
  },
  "data": {
    "employee": {
      "name": "Andres"
    }
  }
}
```

En Windows, si Chrome o Edge no están en una ruta estándar, define:

```bash
set CHROMIUM_EXECUTABLE_PATH=C:\ruta\chrome.exe
```

## Docker Compose

También puedes correrlo con Docker:

```bash
pnpm pdf:local:docker
```
