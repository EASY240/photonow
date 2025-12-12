import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'

export function render(url: string): { appHtml: string; helmet: Record<string, unknown> | null } {
  const helmetContext: Record<string, unknown> = {}

  const appHtml = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )

  const helmet = (helmetContext as { helmet?: unknown }).helmet ?? null

  return {
    appHtml,
    helmet,
  }
}
