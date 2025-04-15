import BioSection from './internal/bio-section'
import TechStack from './internal/tech-stack'
import YeAvatar from './internal/ye-avatar'

export default function MainLayoutContainer() {
  return (
    <main className="flex items-center justify-center flex-col gap-6 py-4">
      <YeAvatar />
      <BioSection />
      <TechStack />
    </main>
  )
}
