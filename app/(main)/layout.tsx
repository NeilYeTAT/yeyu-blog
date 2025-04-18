import MainLayoutHeader from '@/modules/main/layout/main-layout-header'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import StarsBackground from '@/components/shared/stars-background'
import StartUpMotion from '@/components/shared/start-up-motion'
import ContactMe from '@/components/shared/contact-me'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main
      className="min-h-screen max-w-screen
                  flex flex-col justify-between gap-2
                bg-slate-200 dark:bg-black dark:text-white
                  md:text-lg"
    >
      <MainLayoutHeader />
      <MaxWidthWrapper className="overflow-x-hidden flex flex-col justify-between flex-1">
        <main className="flex flex-col flex-1">{children}</main>
        <ContactMe />
      </MaxWidthWrapper>

      <StartUpMotion />
      <StarsBackground />
    </main>
  )
}
