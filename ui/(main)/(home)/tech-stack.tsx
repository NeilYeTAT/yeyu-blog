import type { Variants } from 'motion/react'
import * as motion from 'motion/react-client'
import { siFigma, siHono, siNestjs, siNextdotjs, siReact, siTypescript } from 'simple-icons/icons'

const techStackData = [siTypescript, siReact, siNextdotjs, siHono, siNestjs, siFigma]

const techStackVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const techStackItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function TechStack() {
  return (
    <motion.ul
      aria-label="技术栈"
      className="mt-[21px] grid grid-cols-6 gap-[10px]"
      variants={techStackVariants}
    >
      {techStackData.map(icon => (
        <motion.li
          key={icon.slug}
          title={icon.title}
          className="size-6"
          variants={techStackItemVariants}
        >
          <svg
            role="img"
            aria-label={icon.title}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-full"
          >
            <path d={icon.path} />
          </svg>
        </motion.li>
      ))}
    </motion.ul>
  )
}
