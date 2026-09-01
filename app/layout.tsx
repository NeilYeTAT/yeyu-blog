import Script from 'next/script'
import { defaultLanguage, languageHtmlLang } from '@/lib/i18n/config'
import '@/lib/styles/index.css'
import GlobalProvider from '@/ui/components/provider/global'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={languageHtmlLang[defaultLanguage]} suppressHydrationWarning>
      <body className="font-ye-font">
        <Script id="sync-document-language" strategy="beforeInteractive">
          {`const language = window.location.pathname.split('/')[1]
const htmlLanguage = { zh: 'zh-CN', en: 'en' }[language]
if (htmlLanguage !== undefined) document.documentElement.lang = htmlLanguage`}
        </Script>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  )
}
