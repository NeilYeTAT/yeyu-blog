import { getAllPublishedEcho } from '@/actions/echos'
import BioSection from './bio-section'
import EchoCard from './echo-card'
import HomeContent from './home-content'
import TechStack from './tech-stack'
import YeAvatar from './ye-avatar'

export default async function HomePage() {
  const allPublishedEcho = await getAllPublishedEcho()

  return (
    <HomeContent
      avatarSlot={<YeAvatar />}
      bioSlot={<BioSection />}
      echoSlot={<EchoCard allPublishedEcho={allPublishedEcho} />}
      techSlot={<TechStack />}
    />
  )
}
