import BioSection from './bio-section'
import {
  HomeAvatarMotion,
  HomeBioMotion,
  HomeFadeMotion,
  HomeMotionMain,
} from './home-content-motion'
import TechStack from './tech-stack'
import YeAvatar from './ye-avatar'

export default function HomeContent() {
  return (
    <HomeMotionMain>
      <HomeAvatarMotion>
        <YeAvatar />
      </HomeAvatarMotion>

      <HomeBioMotion>
        <BioSection />
      </HomeBioMotion>

      <HomeFadeMotion>
        <TechStack />
      </HomeFadeMotion>
    </HomeMotionMain>
  )
}
