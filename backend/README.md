# Spring Boot Backend Template

Small production-friendly backend template for REST API driven full-stack apps.

**This backend is intentionally boring: one Spring Boot app, predictable packages, explicit REST routes, small service APIs, mapper interface + mapper XML for database access, and low-complexity code. It is designed for AI-assisted backend work where generated code must be easy to review, debug, and extend.**

## Stack

- Java 21
- Spring Boot 4.0
- Maven
- Sa-Token
- MyBatis
- MyBatis-Plus
- Flyway
- H2
- Lombok
- Spring Boot Validation
- Spring Boot Actuator
- JUnit 5

Version rules:

- use the latest stable Spring Boot 4.x release, not milestone/RC releases
- use Java 21 as the template baseline
- let Spring Boot dependency management control Spring ecosystem dependencies
- pin only libraries not managed by Spring Boot, such as Sa-Token and MyBatis-Plus

Current stable baseline checked on 2026-06-03:

```text
Java                  21
Spring Boot           4.0.6
Sa-Token              1.45.0, use sa-token-spring-boot4-starter
MyBatis-Plus          3.5.16, use mybatis-plus-spring-boot4-starter
Lombok                use the latest stable version compatible with Java 21
H2                    managed by Spring Boot unless there is a clear reason to override
Flyway                managed by Spring Boot unless there is a clear reason to override
JUnit                 managed by Spring Boot
```

Do not use RC versions by default. A template should be boring and shippable.

Dependency rules:

- keep dependency list short
- prefer Spring Boot starters over hand-assembling Spring dependencies
- do not add a dependency for code that is simpler to write locally
- do not introduce MapStruct, Lombok-heavy inheritance, code generators, or object mappers by default
- every new dependency needs a clear feature owner and a removal cost that is acceptable

## Design Goal

This template is not a mini SaaS platform. It is a practical starting point for small and medium full-stack apps.

Default scope:

- Single backend module
- One HTTP API app
- Simple auth
- CRUD-first database access
- Local H2 database
- Flyway schema migrations
- Explicit package boundaries
- Small request/response DTOs
- Lightweight tests

Out of scope by default:

- Multi-module Maven
- Redis
- JobRunr
- Stripe
- S3/object storage
- mail sending
- queue workers
- complex RBAC
- generated code framework
- heavy domain abstractions

Add those only when the app has a real need. Keep the starter sweet as, not overbuilt.

## Structure

```text
backend/
  pom.xml
  README.md

  src/
    main/
      java/
        top/asimov/sparrow/
          App.java

          config/
            CorsConfig.java
            MybatisConfig.java
            SaTokenConfig.java

          controller/
            AuthController.java
            ProjectController.java

          service/
            AuthService.java
            ProjectService.java

          mapper/
            UserMapper.java
            ProjectMapper.java

          exception/
            BusinessException.java
            ErrorCode.java
            GlobalExceptionHandler.java

          model/
            entity/
              User.java
              Project.java
            request/
              LoginRequest.java
              ProjectCreateRequest.java
              ProjectUpdateRequest.java
            response/
              LoginResponse.java
              ProjectResponse.java

          common/
            ApiResponse.java
            CurrentUser.java

      resources/
        application.yml
        mapper/
          UserMapper.xml
          ProjectMapper.xml
        db/
          migration/
            V1__init_schema.sql
            V2__seed_demo_data.sql

    test/
      java/
        top/asimov/sparrow/
          service/
          controller/
```

## Package Rules

`App.java` is the Spring Boot bootstrap only. It should not contain business configuration.

`config/` contains framework wiring only:

- Sa-Token interceptor setup
- MyBatis/MyBatis-Plus config
- CORS config
- Jackson/time config if needed

It must not contain feature business logic.

`controller/` owns HTTP concerns:

- route names
- request validation
- current user lookup
- response wrapping
- HTTP status decisions

Controllers should be thin. They call services and return DTOs.

`service/` owns application behavior:

- validation that depends on stored data
- transaction boundaries
- business decisions
- mapper orchestration

Services should receive explicit arguments, such as `userId`, instead of reading global auth state directly. This keeps tests easy.

`mapper/` contains database access contracts:

- mapper interfaces for method names and parameters
- mapper XML for SQL
- MyBatis-Plus `BaseMapper` only for simple CRUD helpers

Do not build SQL strings in services.

`model/entity/` contains database row models only. Entities are not API contracts.

`model/request/` contains incoming API payload DTOs.

`model/response/` contains outgoing API response DTOs.

`common/` contains shared backend primitives. Keep it small.

`exception/` contains all exception classes and exception handling:

- `BusinessException`
- `ErrorCode`
- `GlobalExceptionHandler`
- auth/permission exception adapters when needed

Do not scatter exception classes through feature packages unless a feature has a genuinely private internal exception that never crosses service boundaries.

## App Loading Chain

```text
HTTP request
-> Sa-Token interceptor
-> Controller
-> Service
-> Mapper interface
-> Mapper XML / MyBatis-Plus
-> H2 database
-> Service
-> Controller
-> ApiResponse
```

## API Rules

Use `/api` as the backend API prefix.

Default routes:

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}

GET    /actuator/health
```

Use nouns for resources. Keep route behavior obvious.

Avoid route names like:

```text
/api/project/doCreate
/api/project/queryAll
/api/project/updateStatusAndNotifyAndSync
```

Prefer:

```text
POST /api/projects
GET  /api/projects
PUT  /api/projects/{id}/status
```

## Response Contract

Use one response envelope for JSON APIs:

```text
{
  "code": 200,
  "message": "OK",
  "data": ...
}
```

Rules:

- `code = 200` means success
- `data` contains the actual payload
- business failures use a non-200 `code`
- validation failures return clear field-level messages where useful
- unexpected server failures must not leak secrets or stack traces

The frontend already accepts this envelope through `apiData`.

## Auth Rules

Use Sa-Token for the template.

Default auth behavior:

- `/api/auth/login` is public
- `/api/auth/logout` requires login
- `/api/auth/me` requires login
- `/api/projects/**` requires login
- `/actuator/health` is public

Sa-Token usage principles:

- use Sa-Token starter for Spring Boot 4
- configure token name, timeout, token style, and concurrent login in `application.yml`
- register a Sa-Token interceptor once in `config/`
- use `StpUtil.login(userId)` only inside auth flow
- use controller/helper layer to resolve current user id
- pass `userId` into services explicitly

Do not add role/permission complexity by default. Add role checks only when the app has admin-only or paid-only behavior.

Security defaults:

- keep auth token transport consistent with the frontend contract
- do not log tokens or session IDs
- keep CORS explicit and environment-driven
- allow local frontend origins by default
- do not use wildcard CORS with credentials
- health checks stay public; business APIs stay protected by default

## Database Rules

Use H2 by default so the template runs without external infrastructure.

Default database behavior:

- H2 file mode or in-memory mode for local development
- Flyway enabled
- schema created only through Flyway migrations
- MyBatis mapper XML for SQL
- MyBatis-Plus for simple CRUD and pagination helpers
- MyBatis-Plus snowflake IDs for primary keys
- MyBatis-Plus auto-fill for `created_at` and `updated_at`

Do not use `ddl-auto` style schema generation. Flyway is the source of truth.

Migration rules:

- migration files live in `src/main/resources/db/migration`
- use Flyway versioned naming: `V1__init_schema.sql`
- one migration should describe one schema/data change
- never edit an already-applied migration in real environments
- add a new migration for changes

Table naming:

- use clear snake_case table names
- use `created_at` and `updated_at` by default
- use indexes for lookup fields used by API queries
- avoid table prefixes unless the app needs them

ID rules:

- primary keys are Java `Long`
- database columns are `BIGINT NOT NULL`
- IDs are generated by MyBatis-Plus snowflake ID generation
- entity id fields use `@TableId(type = IdType.ASSIGN_ID)`
- do not rely on database auto-increment IDs
- Flyway migrations must not declare primary keys as `AUTO_INCREMENT`
- ID generation must work the same on H2 and future production databases

Frontend precision rules:

- JavaScript cannot safely represent long snowflake IDs as numbers
- API responses must serialize ID values as strings
- `id`, `userId`, `projectId`, and similar identifier fields must not be sent as JSON numbers
- do not manually convert IDs in business code for every response
- define one consistent serialization rule for ID fields, then reuse it everywhere

Preferred implementation choices:

- response DTO ID fields may be `String` when the DTO is manually mapped
- or `Long` ID fields may use Jackson `ToStringSerializer`
- keep count, page size, and other numeric values as JSON numbers
- do not globally serialize every `Long` as string unless the app accepts that tradeoff

Timestamp rules:

- every table has `created_at` and `updated_at`
- every entity has `createdAt` and `updatedAt`
- `createdAt` is filled on insert
- `updatedAt` is filled on insert and update
- use MyBatis-Plus `MetaObjectHandler` for timestamp fill
- business services must not set these fields manually
- use UTC as the backend default time zone
- H2 migrations should use SQL that can later be ported cleanly to MySQL/PostgreSQL

H2 compatibility rules:

- H2 is for local development and template tests
- avoid H2-only SQL features
- avoid production-database-only SQL in the initial template
- keep schema types portable: `BIGINT`, `VARCHAR`, `BOOLEAN`, `TIMESTAMP`
- when a future app targets MySQL/PostgreSQL, add integration tests for SQL that differs from H2

## Mapper Rules

Mapper interfaces should stay small and readable.

Use MyBatis-Plus for:

- snowflake ID generation
- `createdAt` / `updatedAt` auto-fill
- insert by entity
- update by id
- delete by id
- select by id
- simple wrapper queries

Use mapper XML for:

- joins
- search filters
- paginated list queries
- custom projections
- SQL that benefits from being visible and reviewable

Keep SQL explicit. A strong engineer should be able to open the mapper XML and understand the query without chasing several helper layers.

## CRUD Feature Shape

Each simple feature should follow this shape:

```text
controller/ProjectController
service/ProjectService
mapper/ProjectMapper
resources/mapper/ProjectMapper.xml
model/entity/Project
model/request/ProjectCreateRequest
model/request/ProjectUpdateRequest
model/response/ProjectResponse
```

Controller responsibilities:

- parse route/path/query/body
- validate request DTO
- get current user id
- call service
- return response DTO

Service responsibilities:

- enforce ownership
- check existence
- apply business rules
- call mapper
- map entity/projection to response DTO

Mapper responsibilities:

- execute database queries
- return entity or projection data

## Transaction Rules

Keep transaction boundaries in services.

Rules:

- read-only queries may use `@Transactional(readOnly = true)` when useful
- writes that touch more than one mapper call should use `@Transactional`
- controllers should not start transactions
- mapper methods should not hide business workflows
- do not make every service method transactional by default

Prefer small transaction scopes that cover one business operation.

## DTO Rules

Do not expose entities directly from controllers.

Reason:

- database fields change more often than API contracts
- entity annotations are database concerns
- sensitive fields can leak accidentally
- frontend contracts should be deliberate

Use request DTOs for incoming data and response DTOs for outgoing data.

Keep DTOs close to the feature. Do not create a large shared DTO hierarchy.

## Lombok Rules

Use Lombok in this template, but keep it constrained.

Allowed by default:

- `@Getter`
- `@Setter`
- `@NoArgsConstructor`
- `@AllArgsConstructor`
- `@RequiredArgsConstructor`
- `@Slf4j`

Allowed with care:

- `@Builder` for objects with many optional fields or test setup objects

Avoid by default:

- `@Data`
- `@EqualsAndHashCode`
- `@ToString`
- `@Value`
- `@SneakyThrows`

Entity rules:

- entities may use `@Getter`, `@Setter`, and `@NoArgsConstructor`
- entities should not use `@Data`
- entities should not use generated `@ToString`, because sensitive fields can leak into logs
- entities should not use generated `@EqualsAndHashCode`, because persistence identity and object equality are easy to get wrong
- if an entity needs `equals` or `hashCode`, write it explicitly

DTO rules:

- request/response DTOs may use Java `record` when immutable data is enough
- mutable request DTOs may use Lombok getter/setter annotations
- do not use Lombok to hide complex mapping logic

Service/controller rules:

- use constructor injection
- `@RequiredArgsConstructor` is allowed for dependency injection
- keep dependencies explicit and final where possible

Review rule:

- Lombok annotations are part of the public class design
- adding `@Data`, `@Builder`, or generated equality must be treated as a behavioral change, not formatting

## Validation Rules

Use Spring Boot Validation on request DTOs.

Default validation:

- required text fields are not blank
- enum-like values are constrained
- page and size have sensible bounds
- IDs from paths are checked in services for ownership/existence

Validation should produce actionable messages. Avoid vague messages like `Invalid request`.

## API Compatibility Rules

Keep API contracts explicit and stable.

Rules:

- response DTO fields are part of the frontend contract
- do not rename response fields casually
- additive response fields are usually safe
- removing or changing field types requires frontend coordination
- backend IDs are strings in JSON contracts even when Java stores them as `Long`
- dates/times are ISO-8601 strings

Do not add API versioning until there is a real compatibility problem. For this template, stable route and DTO discipline is enough.

## Error Handling Rules

Use one `GlobalExceptionHandler`.

Handle:

- business exceptions
- validation exceptions
- login/auth failures
- unexpected runtime exceptions

Package rules:

- exception code lives in `exception/`
- controllers and services throw `BusinessException` for expected business failures
- services should not return `null` to represent business errors
- mapper/database exceptions should be translated at service or global handler boundaries

Logging rules:

- business errors: `info`
- auth failures: `warn` when suspicious, otherwise `info`
- unexpected failures: `error`
- never log passwords, tokens, full auth headers, or secrets

## Logging Rules

The template uses Spring Boot default logging: `SLF4J + Logback`, writing to `stdout/stderr`.

Do not add a logging service, logging SDK, database audit table, or global logging facade by default.

Packaging rules:

- keep console logging enabled for local development and container deployment
- also write backend logs to a local rolling file by default
- roll one log file per day
- compress archived logs
- keep retention short by default, such as 14 days
- keep total log size bounded
- do not commit generated log files
- production deployments may disable file logging when container stdout collection is the source of truth

Default file layout:

```text
var/logs/backend/app.log
var/logs/backend/archive/app-2026-06-03.log.gz
```

The daily rolling file is for local debugging and simple VPS-style deployment. It must not replace stdout logging.

Code-level rules:

- use Lombok `@Slf4j`
- use parameterized logging, not string concatenation
- use stable English scope prefixes
- use `key=value` fields
- keep field names lowerCamelCase
- put the exception object as the last argument when logging a stack trace

Recommended format:

```text
[scope] event: key1={} key2={} elapsedMs={}
```

Examples:

```text
[auth] login succeeded: userId={} email={}
[auth] login failed: email={} reason={}
[project] created: projectId={} userId={}
[project] list completed: userId={} count={} elapsedMs={}
[api] request failed: method={} path={} userId={} reason={}
```

Default scope prefixes:

- `[api]` for request-level and controller boundary logs
- `[auth]` for login/logout/current-user events
- `[project]` for the example CRUD feature
- `[db]` for database or migration-related diagnostics
- `[config]` for startup/config validation

Add new prefixes only when a feature needs repeated operational search. Keep them short and stable.

Level rules:

- `debug`: local troubleshooting detail, skipped branches, low-value internals
- `info`: important business state changes and useful summaries
- `warn`: recoverable but suspicious states, retries, skipped inconsistent data
- `error`: unexpected request failure or unrecoverable operation failure

Do not log ordinary validation failures as `error`.

Sensitive data rules:

- never log passwords
- never log raw tokens
- never log full authorization headers
- never log verification codes
- mask emails when the full address is not needed
- redact query params named `token`, `apiKey`, `apikey`, `access_token`, `password`, or `code`

Context rules:

- API request logs should include `method`, `path`, `status`, `elapsedMs`, and `userId` when available
- use MDC only for request-scoped context such as `requestId` and `userId`
- always clear MDC at request completion
- business logs should still include important IDs explicitly

Do not use AOP as a replacement for business logs. Interceptors can record generic request summaries; business code records business events.

## Pagination Rules

Use a small shared pagination contract:

- request query params: `page`, `size`
- `page` starts at `1`
- enforce a maximum `size`
- response includes records and page metadata

Keep pagination response shape stable so frontend query hooks can reuse it.

## Configuration Rules

Keep `application.yml` safe to commit.

Allowed defaults:

- local H2 database URL
- server port
- actuator health exposure
- Sa-Token non-secret defaults
- logging levels

Do not commit:

- production passwords
- API keys
- webhook secrets
- external service credentials

When external configuration is needed, use environment variables with empty or harmless defaults.

## Testing Rules

Start with low-cost tests.

Default test coverage:

- service unit tests for business rules
- global exception handler tests for API error shape
- controller smoke tests for route contract where useful
- mapper/integration tests only when SQL behavior is important

Avoid heavy integration setup in the template. Add Testcontainers only when the real app outgrows H2 or depends on database-specific SQL.

Minimum template tests:

- auth service rejects invalid credentials
- project service enforces current-user ownership
- global exception handler preserves response envelope shape
- mapper XML can load under Spring context
- ID fields serialize as strings in API responses

## Development Workflow

Default commands:

```text
./scripts/mvn-java21.sh test
./scripts/dev-backend-start.sh
```

Recommended local API base URL:

```text
http://localhost:8080/api
```

Frontend wiring:

```text
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_API=false
```

## When To Add More

Add Redis when:

- session/token storage must survive process restart
- cache invalidation is a real production concern
- multiple API instances need shared state

Add background jobs when:

- user requests should enqueue work instead of waiting
- recurring tasks are part of the product
- retries and job visibility matter

Add object storage when:

- user uploads or generated files need durable storage
- local disk is not enough

Add admin/dashboard routes when:

- there are real operational workflows
- support/debugging needs are repeated

Do not add these just because the old project had them.

## Template Principle

The backend should feel like the frontend template:

```text
predictable structure
explicit routing
small APIs
low-complexity code
easy to review
easy to debug
easy to extend
```

If a generated change makes the code harder to explain in five minutes, simplify it before shipping.
