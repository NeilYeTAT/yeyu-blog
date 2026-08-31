import MainProvider from '../components/provider/main'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import { Background } from './layout/background'
import { ContactMe } from './layout/contact-me'
import { DraggableFloatingMenu } from './layout/draggable-floating-menu'
import Header from './layout/header'
import InitialPageTransition from './layout/initial-page-transition'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainProvider>
      <InitialPageTransition>
        <div className="relative isolate flex min-h-dvh max-w-screen p-3 text-black sm:p-5 dark:text-white">
          <div className="flex min-h-[calc(100dvh-1.5rem)] w-full flex-1 flex-col rounded-lg bg-white/90 sm:min-h-[calc(100dvh-2.5rem)] dark:bg-black/85">
            <Header />

            <MaxWidthWrapper className="flex flex-1 flex-col overflow-x-hidden">
              <main className="flex flex-1 flex-col">{children}</main>

              <ContactMe />
            </MaxWidthWrapper>
          </div>

          <Background />
          <DraggableFloatingMenu />
        </div>
      </InitialPageTransition>
    </MainProvider>
  )
}
