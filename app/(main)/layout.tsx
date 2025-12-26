import LenisScrollProvider from '@/components/provider/lenis-scroll-provider'
import ContactMe from '@/components/shared/contact-me'
import HorizontalDividingLine from '@/components/shared/horizontal-dividing-line'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import StarsBackground from '@/components/shared/stars-background'
import StartUpMotion from '@/components/shared/start-up-motion'
import MainLayoutHeader from '@/modules/main/layout/main-layout-header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisScrollProvider>
      <main className="flex min-h-screen max-w-screen flex-col justify-between gap-2 bg-slate-200 md:text-lg dark:bg-black dark:text-white">
        <MainLayoutHeader />

        <MaxWidthWrapper className="flex flex-1 flex-col justify-between gap-2 overflow-x-hidden">
          <main className="flex flex-1 flex-col">{children}</main>

          <HorizontalDividingLine />
          <ContactMe />
        </MaxWidthWrapper>

        <StartUpMotion />
        <StarsBackground />
      </main>
    </LenisScrollProvider>
  )
}
