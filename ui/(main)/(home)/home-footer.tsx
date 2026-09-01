'use client'

import type { Variants } from 'motion/react'
import * as motion from 'motion/react-client'
import { siGithub, siGmail, siX } from 'simple-icons/icons'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { HomeTextMotion } from './home-motion'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yeyuqwer',
    icon: siGithub,
  },
  {
    name: 'X',
    url: 'https://x.com/yeyuTvT',
    icon: siX,
  },
  {
    name: 'Gmail',
    url: 'mailto:yeyuqwer@gmail.com',
    icon: siGmail,
  },
]

const socialLinksVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const socialLinkVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HomeFooter() {
  const translations = useTranslations()

  return (
    <footer className="mx-auto mt-auto flex w-full max-w-[550px] items-center justify-between gap-4 px-4 pb-1 font-serif text-sm md:px-0">
      <HomeTextMotion className="shrink-0">
        <p className="leading-5">
          © {new Date().getFullYear()} {translations.home.copyrightName}
        </p>
      </HomeTextMotion>

      <motion.nav
        aria-label={translations.home.socialLinksLabel}
        className="flex justify-end gap-6"
        variants={socialLinksVariants}
      >
        {socialLinks.map(link => (
          <motion.a
            aria-label={link.name}
            className="size-5 text-zinc-700 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 dark:text-zinc-300 dark:focus-visible:outline-white dark:hover:text-white"
            href={link.url}
            key={link.url}
            target="_blank"
            rel="noreferrer"
            variants={socialLinkVariants}
          >
            <svg role="img" viewBox="0 0 24 24" className="size-full" fill="currentColor">
              <path d={link.icon.path} />
            </svg>
          </motion.a>
        ))}
      </motion.nav>
    </footer>
  )
}
