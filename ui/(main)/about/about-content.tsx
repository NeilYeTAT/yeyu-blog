import { BioSection } from './bio-section'
import { ClosingSection } from './closing-section'
import { IntroSection } from './intro-section'
import { PreferencesSection } from './preferences-section'

export function AboutContent() {
  return (
    <>
      <IntroSection />
      <BioSection />
      <PreferencesSection />
      <ClosingSection />
    </>
  )
}
