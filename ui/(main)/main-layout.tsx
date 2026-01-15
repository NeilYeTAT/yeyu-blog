import LenisScrollProvider from '@/ui/components/provider/lenis-scroll-provider'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import { Toaster } from '@/ui/shadcn/sonner'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import { DraggableFloatingMenu } from './(home)/draggable-floating-menu'
import { Background } from './background'
import { ContactMe } from './contact-me'
import MainHeader from './main-header'
import StartUpMotion from './start-up-motion'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisScrollProvider>
      <main className="flex min-h-screen max-w-screen flex-col justify-between gap-2 md:text-lg dark:text-white">
        <MainHeader />

        <MaxWidthWrapper className="flex flex-1 flex-col justify-between gap-2 overflow-x-hidden">
          <main className="flex flex-1 flex-col">{children}</main>

          <HorizontalDividingLine dividerColor="var(--clear-sky-primary)" />
          <ContactMe />
        </MaxWidthWrapper>

        <Background />
        <DraggableFloatingMenu />
        <StartUpMotion />
        <Toaster position="top-center" richColors />
      </main>
    </LenisScrollProvider>
  )
}
