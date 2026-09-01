import type { Language } from '@/lib/i18n/config'
import MainProvider from '../components/provider/main'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import Header from './layout/header'
import InitialPageTransition from './layout/initial-page-transition'
import { MainStage } from './layout/main-stage'

export default function MainLayout({
  children,
  language,
}: {
  children: React.ReactNode
  language: Language
}) {
  return (
    <MainProvider initialLanguage={language}>
      <InitialPageTransition>
        <MainStage>
          <div className="site-whiteboard flex h-[calc(100dvh-1.5rem)] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg sm:h-[calc(100dvh-2.5rem)]">
            <Header />

            <div
              data-main-scroll-container
              className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <MaxWidthWrapper className="flex min-h-full flex-col overflow-x-clip">
                <main className="flex flex-1 flex-col">{children}</main>
              </MaxWidthWrapper>
            </div>
          </div>
        </MainStage>
      </InitialPageTransition>
    </MainProvider>
  )
}
