import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'

export function render(url: string, context?: any) {
  const helmetContext: any = {}
  const appHtml = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )
  const helmet = helmetContext.helmet || {}
  const head = [
    helmet.title ? helmet.title.toString() : '',
    helmet.meta ? helmet.meta.toString() : '',
    helmet.link ? helmet.link.toString() : ''
  ].filter(Boolean).join('\n')
  return { appHtml, head }
}
