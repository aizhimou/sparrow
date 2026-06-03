# Frontend Template Design

日期：2026-06-03

目标：沉淀一套适合 Java + Spring Boot 后端工程师长期复用的 React + Mantine frontend template。

这个 template 不是为了展示 frontend 技巧。它的目标是像一个好的 Spring Boot starter project：

```text
结构可预测
分层清楚
API 小
命名明确
行为显式
容易 review AI code
```

够用、稳定、production-friendly，sweet as。

## 1. 技术基线

第一版使用：

- Vite
- React
- TypeScript
- Mantine v9
- React Router v7
- TanStack Query v5
- Axios
- Tabler Icons
- Mantine Notifications

当前 Context7 docs 确认的关键 setup：

- Mantine app root 需要 `MantineProvider`，并导入 `@mantine/core/styles.css`
- Notifications 需要在 root 放 `<Notifications />`，并导入 `@mantine/notifications/styles.css`
- React Router 使用 `BrowserRouter` + `Routes` + nested `Route` + `Outlet`
- TanStack Query 使用 `QueryClientProvider`，mutation 成功后通过 `queryClient.invalidateQueries(...)` 刷新相关 server state

## 2. Template 原则

### 保持简单

优先普通 function、普通 component、普通 folder。

不要为了“架构感”引入复杂 abstraction。template 里的每一层都应该能回答：

```text
它解决什么具体问题？
没有它会不会明显更乱？
一个后端工程师能不能快速读懂？
```

### platform pages + feature data layer

页面按 platform 放，业务 data layer 按 feature 放：

```text
src/desktop/pages/DesktopHomePage.tsx
src/mobile/pages/MobileHomePage.tsx

src/shared/features/projects/
  projectsApi.ts
  projectsQueries.ts
  projectsTypes.ts
```

原因：

```text
desktop 和 mobile 的 layout、interaction、navigation、density 往往不一样。
但它们读取的 server data、mutation payload、query key 通常应该一致。
```

所以：

- `desktop` 放 desktop-specific screens and interaction
- `mobile` 放 mobile-specific screens and interaction
- `shared/features` 放 shared API/query/type/business helpers
- `shared/components` 放跨 platform 的 small reusable UI
- `shared/api` 放跨 feature 的 API utilities
- `shared/notifications` 放跨 platform 的 notification command helpers

不要搞全局巨大 `types` folder。type 跟着 feature 走，哪里用，哪里维护。Chur。

### TypeScript 是 validation layer

TypeScript 用来保护 frontend 实际使用的数据边界：

- View Model
- form values
- mutation payload
- component props
- API return shape

不完整复制 backend DTO。不要把 TypeScript 当 modeling religion。

禁止复杂 generic、type gymnastics、framework-style abstraction。AI 可以写重复代码，人要能快速 review。

## 3. Recommended Folder Structure

```text
src/
  app/
    App.tsx
    responsive/
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

  shared/
    api/
      apiData.ts
      apiError.ts
      httpClient.ts
    constants/
      .gitkeep
    components/
      EmptyState.tsx
      ErrorState.tsx
      LoadingState.tsx
      PageHeader.tsx
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

  assets/
    logo.svg
  global.css
  main.tsx
```

## 4. App Layer Responsibilities

`src/app` 是 application wiring，类似 Spring Boot 里的 configuration + application shell。

它负责：

- providers
- route wiring in `App.tsx`
- global theme
- QueryClient
- auth placeholder
- route guard
- responsive client selection

它不应该包含 feature business logic。

### AppProviders

Provider 顺序建议：

```tsx
<MantineProvider>
  <Notifications />
  <QueryClientProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
</MantineProvider>
```

原因：

- Mantine 是 UI runtime config，放最外层
- Notifications 依赖 Mantine context
- TanStack Query 提供 server state runtime
- AuthProvider 提供 frontend auth placeholder
- BrowserRouter 提供 routing context

### App

`App.tsx` 是 application entry。它可以直接声明 top-level routes：

```tsx
<Routes>
  <Route element={<ResponsiveClient desktop={<DesktopShell />} mobile={<MobileShell />} />}>
    {/* route children */}
  </Route>
</Routes>
```

当前 template 不再单独保留 `router.tsx`。如果以后 routes 明显变多，再把 route config 拆出去也来得及。

### RequireAuth

所有业务页面默认需要登录。`RequireAuth` 是 route guard：

```text
authenticated -> render protected route through <Outlet />
anonymous     -> redirect to /login
```

公开页面：

- `/login`
- `/403`
- `*` 404

业务页面：

- `/home`

### ResponsiveClient

`ResponsiveClient` 是唯一 app-level responsive primitive。它只做一件事：

```text
desktop -> DesktopShell
mobile  -> MobileShell
```

或：

```text
desktop -> DesktopHomePage
mobile  -> MobileHomePage
```

也就是说，`app` 只判断 client surface，不关心 desktop/mobile 的具体 UI 长什么样。

`DesktopShell` 和 `MobileShell` 归各自 platform 包负责。它们都可以使用 Mantine `AppShell`，但不要求 UI 一样。

shell 职责：

- top navigation
- side navigation / bottom navigation
- color scheme toggle
- user/auth placeholder display
- 渲染 `<Outlet />`

不要把 list data、form mutation、feature state 放进 layout。

当同一个 route 在 desktop/mobile 上需要不同 screen 时，也使用同一个 primitive：

```tsx
<Route
  path="home"
  element={<ResponsiveClient desktop={<DesktopHomePage />} mobile={<MobileHomePage />} />}
/>
```

这个写法有一点重复，但非常容易 review。template 第一版优先 explicit，不做 route config abstraction。

## 5. Data Fetching Rules

整体链路：

```text
Axios instance
  -> apiData
  -> feature api function
  -> TanStack Query hook
  -> page component
```

### Axios instance

`httpClient.ts` 负责技术层 HTTP：

- baseURL
- auth token header
- language header
- request interceptor
- response interceptor

page 和 feature 不直接创建 Axios instance。

### apiData

`apiData.ts` 负责解析业务 response envelope。

推荐 backend envelope：

```ts
type ApiEnvelope<T> = {
  code?: number;
  message?: string;
  data: T;
};
```

template 默认兼容两种 response：

```text
plain JSON
business envelope: { code, message, data }
```

这样第一版可以更容易接不同 Spring Boot backend。

### feature api

feature api 是纯 async function，不包含 React：

```ts
export function listProjects(): Promise<ProjectSummary[]> {
  return apiData(httpClient.get('/projects'));
}
```

规则：

- 不用 hook
- 不读 React state
- 不处理 UI notification
- function name 用业务语义，例如 `listProjects`、`createProject`

### TanStack Query

GET / 读取 server data：默认 TanStack Query。

POST / PUT / DELETE：优先 `useMutation`。

mutation 成功后 invalidate 对应 query key：

```ts
await queryClient.invalidateQueries({ queryKey: projectsQueryKeys.list() });
```

Query key 只做简单 feature scoped constant，不做复杂 query key factory。

### Local state

React state 只负责 UI state：

- modal opened
- selected row
- active tab
- temporary form draft
- small command loading

Form draft state 不属于 TanStack Query。

简单 one-off command action 可以用 `async/await + local state`，不必强行 `useMutation`。

## 6. Error Handling

第一版保持简单：

- `ApiError` 表达可展示的业务错误
- `getErrorMessage(error)` 把 unknown error 转成 string
- page-level query error 用 `ErrorState`
- mutation error 用 notification helper

不要一开始就做复杂 global error framework。

够用的规则：

```text
server data load failed -> ErrorState
mutation failed -> notification
unexpected error -> fallback message
```

## 7. UI State Components

template 提供三个基础状态 component：

- `LoadingState`
- `EmptyState`
- `ErrorState`

这些 component 应该很小，只负责统一页面体验，不负责业务判断。

业务判断留在 page：

```tsx
if (query.isLoading) return <LoadingState />;
if (query.isError) return <ErrorState error={query.error} />;
if (projects.length === 0) return <EmptyState title="No projects yet" />;
```

## 8. Forms And Mutations

第一版 form pattern：

- Mantine `useForm`
- feature scoped form value type
- desktop modal / mobile drawer 内 submit
- `useMutation`
- success notification
- invalidate list query
- close modal
- reset form

推荐结构：

```text
desktop/components/DesktopProjectCreateModal.tsx
  owns desktop modal form state
  calls createProjectMutation
  shows submit loading
  closes on success

mobile/components/MobileProjectCreateDrawer.tsx
  owns mobile drawer form state
  calls createProjectMutation
  shows submit loading
  closes on success
```

不要把 form logic 提前抽成 generic helper。等第二、第三个真实 form 出现相同重复，再考虑 extraction。

## 9. Auth Placeholder

第一版只放 placeholder：

- `AuthProvider`
- `useAuth`
- `authTokenStorage`
- demo sign in / sign out
- Axios interceptor 从 storage 读 token

不实现完整 login flow。

原因：

```text
真实 auth 通常强依赖 backend、token format、refresh strategy、security policy。
template 只保留稳定边界，不假装知道业务细节。
```

## 10. Styling Rules

默认使用：

- Mantine theme 配全局 defaults
- Mantine style props 做简单 spacing/layout
- CSS modules 做 layout-level 或复杂局部样式

不要：

- 到处写 inline style object
- 过早建立 design system package
- 为每个小 component 写复杂 Styles API

Mantine `AppShell` 做 application frame。业务 page 内用 `Stack`、`Group`、`Paper`、`Table`、`Modal` 等基础 component。

## 11. Template Acceptance Criteria

第一版完成后应具备：

- `npm run dev` 可启动
- `npm run build` 通过
- MantineProvider + theme + color scheme 可用
- React Router 可导航
- QueryClientProvider 可用
- Axios API client 可替换 backend baseURL
- AppShell layout 可用
- desktop/mobile layout split 可用
- auth placeholder 可读懂
- notification helpers 可用
- loading / empty / error states 可复用
- 一个 desktop list page example
- 一个 mobile list page example
- 一个 desktop modal mutation example
- 一个 mobile drawer mutation example
- README 写清楚 development rules

## 12. What Not To Add Yet

第一版暂不加入：

- route-level code splitting
- generated API client
- OpenAPI tooling
- complex auth refresh flow
- global state manager
- custom design system factory
- table abstraction
- form abstraction
- test framework
- MSW
- i18n framework

这些以后有真实项目需要再加。先把 starter 做扎实，no worries。
