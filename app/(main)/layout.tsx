import MainLayoutHeader from '@/modules/main/layout/main-layout-header'
import LenisScrollProvider from '@/ui/components/provider/lenis-scroll-provider'
import ContactMe from '@/ui/components/shared/contact-me'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import MaxWidthWrapper from '@/ui/components/shared/max-width-wrapper'
import StarsBackground from '@/ui/components/shared/stars-background'
import StartUpMotion from '@/ui/components/shared/start-up-motion'

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
