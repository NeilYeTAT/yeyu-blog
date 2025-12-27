import * as motion from 'motion/react-client'
import { getAllPublishedEcho } from '@/actions/echos'
import BioSection from './bio-section'
import EchoCard from './echo-card'
import TechStack from './tech-stack'
import YeAvatar from './ye-avatar'

export default async function HomePage() {
  const allPublishedEcho = await getAllPublishedEcho()

  return (
    <motion.main
      className="flex flex-col items-center justify-center gap-6 overflow-hidden py-4"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: [-10, 0] }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <YeAvatar />
      <BioSection />
      <EchoCard allPublishedEcho={allPublishedEcho} />
      <TechStack />
    </motion.main>
  )
}
