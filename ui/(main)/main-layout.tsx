import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import MainProvider from '../components/provider/main'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import { Background } from './layout/background'
import { ContactMe } from './layout/contact-me'
import { DraggableFloatingMenu } from './layout/draggable-floating-menu'
import Header from './layout/header'
import StartUpMotion from './layout/start-up-motion'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainProvider>
      <div className="flex min-h-dvh max-w-screen flex-col justify-between gap-2 md:text-lg dark:text-white">
        <Header />

        <MaxWidthWrapper className="flex flex-1 flex-col justify-between gap-2 overflow-x-hidden">
          <main className="flex flex-1 flex-col">{children}</main>

          <HorizontalDividingLine />
          <ContactMe />
        </MaxWidthWrapper>

        <Background />
        <DraggableFloatingMenu />
        <StartUpMotion />
      </div>
    </MainProvider>
  )
}
