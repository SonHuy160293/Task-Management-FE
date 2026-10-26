# Frontend fundamentals in DevFlow

## A browser renders a document

The browser downloads `index.html`, reads its `<script type="module">`, and loads
the application's JavaScript. `main.tsx` locates `<div id="root">` and tells React
to render `App`. React creates DOM nodes: buttons, text, navigation, forms. The DOM
(Document Object Model) is the browser's in-memory tree of HTML elements.

CSS determines how those elements look. The browser calculates styles, measures
layout, and paints pixels. A class change may require layout or repaint; it does
not call ASP.NET automatically. Clicking the sidebar collapse button updates
Zustand state, causes React to rerender, and changes width/padding classes locally.

HTML carries meaning as well as appearance: `<button>` is keyboard-operable;
`<a>` navigates; `<label>` names a field; `<main>` identifies primary content.
Making a `<div>` look clickable does not give it those behaviors. DevFlow uses
semantic elements, Base UI primitives in its Nova components, and direct Radix
dialogs/menus in the older shell. These provide interaction behavior; labels,
composition, visible focus, and keyboard checks remain the application's job.

The visual rules live in [DESIGN.md](../DESIGN.md). `components.json` selects
the Nova neutral theme and Lucide icons; the global stylesheet maps semantic
roles and uses the locally bundled Geist font. Reuse the owned UI components
instead of copying screen-specific colors into a new feature. See
[styling](styling-guide.md) for how those roles become Tailwind utilities.

## Single-page application (SPA)

The initial HTML hosts a persistent application. React Router changes the displayed
page when a user clicks `/organizations`; it does not request a complete Razor
view for every navigation. The URL still matters: browser Back/Forward works and
a route can be bookmarked. Links must use React Router's `Link` for internal SPA
navigation. External documentation uses ordinary `<a>` elements.

A hard refresh on `/organizations` does request that path from the web server.
Nginx's `try_files ... /index.html` sends the SPA shell so React Router can resolve
the route. Missing `/api` or `/assets` requests must not receive this HTML fallback.
Otherwise Axios may receive HTML with HTTP 200 and hide a real server failure.

## Requests and browser security

Filling a field changes local form state. Submitting registration invokes a
mutation hook, then the API function, then Axios. Axios sends JSON via HTTP POST
to the configured API base URL. A response returns asynchronously; React remains
responsive while the request is in flight. The button is disabled to prevent
duplicate submissions, and errors are displayed after completion.

An origin is protocol + hostname + port. `http://localhost:8081` and
`http://127.0.0.1:5173` are different origins. Browsers enforce CORS for cross-origin
requests; PowerShell does not. A successful Invoke-RestMethod does not prove CORS
works. The development proxy makes API traffic same-origin from the browser's view.
In production the container proxies `/api` to its server-configured upstream.

HTTPS encrypts traffic. Vite's `VITE_` variables are bundled into public JavaScript;
they are configuration, never a secret store. An integration API key belongs on a
server. The generated internal Users schema is not permission to call that endpoint
from a browser. Cookies, CORS and CSRF are discussed in [authentication](authentication.md).

## Developer Tools: a practical walkthrough

Open DevFlow and press F12 (or Ctrl+Shift+I) in your browser. DevTools capabilities
depend on your browser; a regular Chrome/Edge window is useful for local debugging.

1. **Elements:** inspect the Create account button. Its classes control spacing and
   colors. Temporarily edit padding to experiment; these edits disappear on reload.
2. **Console:** rendering errors and failed module loads appear here. Expand the
   first relevant error and inspect its source location. Do not paste tokens or
   passwords into console commands, screenshots, or bug reports.
3. **Network:** enable Preserve log, filter to Fetch/XHR, submit a test registration
   against an isolated backend. Check method, URL, status, response shape and timing.
   Request bodies contain credentials; redact them before sharing.
4. **Sources:** the development source map points back to TSX. Set a breakpoint in
   `registerAccount` to follow the transport boundary. Production source maps are
   not enabled by this configuration.
5. **Application/Storage:** this implementation does not persist access/refresh
   tokens. A future cookie-based refresh token should be HttpOnly so JavaScript
   cannot read it. The backend must set that cookie correctly.

## Differences from ASP.NET Core

| Familiar backend idea        | Frontend counterpart and difference                                              |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Request scoped DI            | Providers supply context to a rendered subtree, which can live for many requests |
| Controller -> handler -> DTO | Component -> query/mutation hook -> API function -> generated DTO                |
| Model validation             | Zod catches mistakes for UX; backend validation still enforces rules             |
| Middleware                   | Axios interceptors run for client requests, not all traffic at the server        |
| Authorization attribute      | Route/action guards improve UX; they cannot secure a backend                     |
| Program.cs                   | `main.tsx`, `App.tsx`, and providers compose the browser application             |
| Release binaries             | `dist/` holds HTML/CSS/JS deployed through a static server                       |

Users can inspect or modify their browser code. Treat every request as untrusted
on the backend, even if the frontend hides an action.
