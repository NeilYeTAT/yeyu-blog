import type { Language } from '@/lib/i18n/config'
import MainProvider from '../components/provider/main'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import { Background } from './layout/background'
import { DraggableFloatingMenu } from './layout/draggable-floating-menu'
import Header from './layout/header'
import InitialPageTransition from './layout/initial-page-transition'

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
        <div className="relative isolate flex h-dvh max-w-screen overflow-hidden p-3 text-black sm:p-5 dark:text-white">
          <div className="flex h-[calc(100dvh-1.5rem)] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg bg-white/90 sm:h-[calc(100dvh-2.5rem)] dark:bg-black/85">
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

          <Background />
          <DraggableFloatingMenu />
        </div>
      </InitialPageTransition>
    </MainProvider>
  )
}
