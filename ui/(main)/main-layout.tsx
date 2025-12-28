import LenisScrollProvider from '@/ui/components/provider/lenis-scroll-provider'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import StartUpMotion from '@/ui/components/shared/start-up-motion'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import { Background } from './background'
import { ContactMe } from './contact-me'
import MainHeader from './main-header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisScrollProvider>
      <main className="flex min-h-screen max-w-screen flex-col justify-between gap-2 md:text-lg dark:text-white">
        <MainHeader />

        <MaxWidthWrapper className="flex flex-1 flex-col justify-between gap-2 overflow-x-hidden">
          <main className="flex flex-1 flex-col">{children}</main>

          <HorizontalDividingLine />
          <ContactMe />
        </MaxWidthWrapper>

        <Background />
        <StartUpMotion />
      </main>
    </LenisScrollProvider>
  )
}
