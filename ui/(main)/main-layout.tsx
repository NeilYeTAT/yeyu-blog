import MainProvider from '../components/provider/main'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import { Background } from './layout/background'
import { DraggableFloatingMenu } from './layout/draggable-floating-menu'
import Header from './layout/header'
import InitialPageTransition from './layout/initial-page-transition'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainProvider>
      <InitialPageTransition>
        <div className="relative isolate flex h-dvh max-w-screen overflow-hidden p-3 text-black sm:p-5 dark:text-white">
          <div className="flex h-[calc(100dvh-1.5rem)] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg bg-white/90 sm:h-[calc(100dvh-2.5rem)] dark:bg-black/85">
            <Header />

            <div
              data-main-scroll-container
              className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-color:color-mix(in_srgb,var(--theme-accent)_46%,transparent)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] dark:[scrollbar-color:color-mix(in_srgb,white_36%,transparent)_transparent] [&::-webkit-scrollbar-thumb:hover]:bg-theme-accent/70 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-theme-accent/45 [&::-webkit-scrollbar-thumb]:bg-clip-padding dark:[&::-webkit-scrollbar-thumb]:bg-white/35 [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
            >
              <MaxWidthWrapper className="flex min-h-full flex-col overflow-x-hidden">
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
