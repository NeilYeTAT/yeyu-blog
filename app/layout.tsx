import { metadata } from '@/config/seo'
import { languageHtmlLang } from '@/lib/i18n/config'
import { getCurrentLanguage } from '@/lib/i18n/get-current-language'
import '@/lib/styles/index.css'
import GlobalProvider from '@/ui/components/provider/global'

export { metadata }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const language = await getCurrentLanguage()

  return (
    <html lang={languageHtmlLang[language]} suppressHydrationWarning>
      <body className="font-ye-font">
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  )
}
