// imported from https://github.com/nextauthjs/next-auth/blob/main/docs/pages/animated-stars.css
import './animated-stars.css'

export default function StarsBackground() {
  return (
    <div className="pointer-events-none fixed top-0 left-0 z-0 h-screen w-screen">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <div id="stars4" />
    </div>
  )
}
