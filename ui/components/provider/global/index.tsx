import { ThemeProvider } from 'next-themes'
import ReactQueryProvider from './react-query-provider'

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryProvider> {children} </ReactQueryProvider>
    </ThemeProvider>
  )
}
