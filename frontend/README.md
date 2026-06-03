# React + Mantine Frontend Template

Small production-friendly starter for REST API driven apps.

**This template is intentionally boring: predictable structure, explicit routing, small APIs, and low-complexity code. It is designed for AI-assisted frontend work where generated code must be easy to review, debug, and extend.**

## Stack

- Vite
- React
- TypeScript
- Mantine v9
- React Router v7
- TanStack Query v5
- Axios
- Tabler Icons
- Mantine Notifications

## Environment

Create `.env.local` when needed:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_API=true
```

The example feature uses mock data by default so the template runs without a backend.

Set `VITE_USE_MOCK_API=false` when wiring a real Spring Boot API.

## Structure

```text
src/
  main.tsx
  global.css

  app/
    App.tsx
    ResponsiveClient.tsx
    providers/
      AppProviders.tsx
    auth/
      AuthProvider.tsx
      RequireAuth.tsx
      authTokenStorage.ts
      useAuth.ts
    queryClient.ts
    theme.ts

  desktop/
    shell/
      DesktopShell.tsx
      DesktopShell.module.css
    pages/
      DesktopLoginPage.tsx
      DesktopHomePage.tsx
    components/
      DesktopProjectCreateModal.tsx

  mobile/
    shell/
      MobileShell.tsx
      MobileShell.module.css
    pages/
      MobileLoginPage.tsx
      MobileHomePage.tsx
    components/
      MobileProjectCreateDrawer.tsx

  shared/
    api/
      httpClient.ts
      apiData.ts
      apiError.ts
    components/
      EmptyState.tsx
      ErrorState.tsx
      LoadingState.tsx
      PageHeader.tsx
    constants/
      .gitkeep
    features/
      projects/
        projectsApi.ts
        projectsQueries.ts
        projectsTypes.ts
    notifications/
      appNotifications.tsx
    pages/
      ForbiddenPage.tsx
      NotFoundPage.tsx

  assets/
    logo.svg
```

## Layer Rules

`main.tsx` is the React bootstrap only. It imports global styles, creates the React root, and renders:

```tsx
<AppProviders>
  <App />
</AppProviders>
```

`app/` is global application wiring. It owns providers, theme, auth placeholder, route guard, query client config, and responsive client selection. It must not contain feature business logic.

`desktop/` is desktop-only UI. Put desktop shells, pages, and desktop-specific components here.

`mobile/` is mobile-only UI. Put mobile shells, pages, and mobile-specific components here.

`shared/` is cross-client code. Use it for API infrastructure, reusable UI components, shared feature data/query/type files, notification command helpers, shared public pages, and constants.

`shared/features/` is the shared business/data layer. It should contain API functions, TanStack Query hooks, frontend view types, form values, mutation payload types, and small feature-specific display/business helpers when needed. Do not put page components in `shared/features`.

## App Loading Chain

The full loading chain is:

```text
main.tsx
-> AppProviders
-> App
-> ResponsiveClient
-> DesktopShell / MobileShell
-> Outlet
-> DesktopPage / MobilePage
-> shared feature query/api
```

More concretely:

```text
main.tsx
  loads Mantine styles, notification styles, global.css
  renders AppProviders + App

AppProviders
  MantineProvider
  Notifications
  QueryClientProvider
  AuthProvider
  BrowserRouter

App
  declares top-level routes
  applies RequireAuth to protected routes
  uses ResponsiveClient for desktop/mobile shell and pages

DesktopShell / MobileShell
  render app navigation and <Outlet />

DesktopPage / MobilePage
  render client-specific UI
  call shared feature query hooks

shared/features
  query hook -> API function -> httpClient/apiData
```

## Routing Rules

Use one business URL when desktop and mobile represent the same destination.

Current routes:

```text
/login   public
/403     public
/home    protected business page
*        public 404
```

Protected route shape:

```tsx
<Route element={<RequireAuth />}>
  <Route element={<ResponsiveClient desktop={<DesktopShell />} mobile={<MobileShell />} />}>
    <Route index element={<Navigate to="/home" replace />} />
    <Route
      path="home"
      element={<ResponsiveClient desktop={<DesktopHomePage />} mobile={<MobileHomePage />} />}
    />
  </Route>
</Route>
```

Do not introduce `/m/*` mobile routes by default. This template uses the same URL and chooses the desktop/mobile UI with `ResponsiveClient`. Add a separate mobile route tree only when mobile is truly a separate app with different deep links or information architecture.

## Responsive Rules

`ResponsiveClient` is the only app-level responsive primitive:

```tsx
<ResponsiveClient desktop={<DesktopHomePage />} mobile={<MobileHomePage />} />
```

The `app` layer decides only which client surface to render. It must not know how desktop or mobile UI is implemented.

Desktop and mobile pages may duplicate JSX. Prefer readable, client-specific screens over premature shared abstractions.

Use shared pages only when the page is genuinely simple and platform-neutral, such as `ForbiddenPage` and `NotFoundPage`.

## Auth Rules

All business pages require login by default.

`RequireAuth` behavior:

```text
authenticated -> render protected route through <Outlet />
anonymous     -> redirect to /login with state.from
```

Login pages redirect back to `state.from.pathname`, with `/home` as fallback.

Current auth is a placeholder:

- `AuthProvider`
- `useAuth`
- `authTokenStorage`
- demo sign in / sign out
- Axios interceptor reads token from storage

Do not implement refresh tokens, real login, or role logic unless the backend contract exists.

## Data Fetching Rules

Use this chain:

```text
Axios instance
-> apiData
-> feature API function
-> TanStack Query hook
-> page component
```

`shared/api/httpClient.ts` owns HTTP-level concerns:

- base URL
- timeout
- auth token header
- language header
- request interceptors

`shared/api/apiData.ts` owns response parsing. It supports plain JSON and a simple backend envelope:

```ts
type ApiEnvelope<T> = {
  code?: number;
  message?: string;
  data: T;
};
```

Feature API files are pure async functions. They must not import React, show notifications, read component state, or call hooks.

Example:

```ts
export function listProjects(): Promise<ProjectSummary[]> {
  return apiData(httpClient.get('/projects'));
}
```

TanStack Query hooks live near the feature:

```text
src/shared/features/projects/projectsQueries.ts
```

GET/read server data with `useQuery`. POST/PUT/DELETE with `useMutation`. Invalidate affected query keys on mutation success.

React state is for UI state only:

- modal/drawer opened
- selected row
- active tab
- temporary form draft
- small command loading

Form draft state does not belong in TanStack Query.

## TypeScript Rules

TypeScript is a lightweight validation layer, not a modeling religion.

Maintain only frontend-used types:

- View models
- form values
- mutation payloads
- component props
- API return shapes

Do not mirror full backend DTOs unless the frontend actually uses those fields.

Keep types feature-scoped:

```text
src/shared/features/<feature>/<feature>Types.ts
```

Avoid complex generics, type gymnastics, and framework-style abstractions. Repeated explicit code is acceptable when it is easier to review.

## UI State Rules

Use shared state components for common query states:

- `LoadingState`
- `EmptyState`
- `ErrorState`

Business decisions stay in the page:

```tsx
if (query.isLoading) return <LoadingState />;
if (query.isError) return <ErrorState error={query.error} />;
if (items.length === 0) return <EmptyState title="No items yet" />;
```

Use Mantine components first. Use CSS modules for local layout or styling that is too large for simple Mantine props.

Do not create table, form, modal, or page abstractions until repeated real code proves they are useful.

## Notification Rules

Mantine runtime is configured once in `AppProviders`:

```tsx
<Notifications position="bottom-right" />
```

Application notification helpers live in:

```text
src/shared/notifications/appNotifications.tsx
```

Use helpers from pages/components:

```tsx
showSuccess('Project created');
showError(error, 'Failed to create project');
```

Do not call Mantine `notifications.show()` directly from every page unless a one-off notification truly needs custom behavior.

## Form And Mutation Rules

Use Mantine `useForm` for forms.

Use feature-scoped form value and mutation payload types.

Desktop and mobile forms may use different containers:

```text
desktop/components/DesktopProjectCreateModal.tsx
  modal form
  calls shared mutation hook

mobile/components/MobileProjectCreateDrawer.tsx
  drawer form
  calls shared mutation hook
```

On successful mutation:

```text
call mutation
show success notification
invalidate affected query
close modal/drawer
reset form
```

Do not extract generic form helpers early.

## Adding A New Feature

Follow this checklist:

```text
1. Add shared feature folder:
   src/shared/features/<feature>/
     <feature>Api.ts
     <feature>Queries.ts
     <feature>Types.ts

2. Add desktop page:
   src/desktop/pages/Desktop<Feature>Page.tsx

3. Add mobile page:
   src/mobile/pages/Mobile<Feature>Page.tsx

4. Add desktop/mobile components only if the page needs them:
   src/desktop/components/...
   src/mobile/components/...

5. Add route in App.tsx:
   <ResponsiveClient desktop={<Desktop... />} mobile={<Mobile... />} />

6. Add navigation links in DesktopShell and MobileShell when needed.

7. Run:
   npm run typecheck
   npm run lint
   npm run build
```

Keep the feature API/query/types shared unless desktop and mobile genuinely use different backend contracts.

## What Not To Add By Default

Do not add these to the template unless a real project requires them:

- `/m/*` mobile route tree
- admin module
- role guard
- i18n
- register / forgot password flows
- account/subscription pages
- global state manager
- generated API client
- OpenAPI tooling
- route config abstraction
- table abstraction
- form abstraction
- test framework
- MSW
- complex auth refresh flow

Keep v1 small. Add structure only when it solves a real repeated problem.
