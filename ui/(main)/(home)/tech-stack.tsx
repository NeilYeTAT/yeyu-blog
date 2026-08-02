import type { ReactNode } from 'react'
import { GitIcon } from './assets/svg/inner-ring/git-icon'
import { GitHubActionsIcon } from './assets/svg/inner-ring/github-actions-icon'
import { NeovimIcon } from './assets/svg/inner-ring/neovim-icon'
import { ObsidianIcon } from './assets/svg/inner-ring/obsidian-icon'
import { PrismaIcon } from './assets/svg/inner-ring/prisma-icon'
import { ShadcnuiIcon } from './assets/svg/inner-ring/shadcnui-icon'
import { VimIcon } from './assets/svg/inner-ring/vim-icon'
// * svg
import { NestjsIcon } from './assets/svg/outer-ring/nestjs-icon'
import { NextjsIcon } from './assets/svg/outer-ring/nextjs-icon'
import { NodejsIcon } from './assets/svg/outer-ring/nodejs-icon'
import { ReactIcon } from './assets/svg/outer-ring/react-icon'
import { ReactQueryIcon } from './assets/svg/outer-ring/react-query-icon'
import { TailwindcssIcon } from './assets/svg/outer-ring/tailwindcss-icon'
import { TypeScriptIcon } from './assets/svg/outer-ring/typescript-icon'
import { WagmiIcon } from './assets/svg/outer-ring/wagmi-icon'
import { TechStackRings } from './tech-stack-rings'

const techStackIconClassName =
  'size-full transition-none hover:text-zinc-400 dark:hover:text-zinc-400'

const outerRingTechStackData = [
  {
    key: 'ts',
    component: <TypeScriptIcon className={techStackIconClassName} />,
  },
  {
    key: 'react',
    component: <ReactIcon className={techStackIconClassName} />,
  },
  {
    key: 'tailwindcss',
    component: <TailwindcssIcon className={techStackIconClassName} />,
  },
  {
    key: 'next',
    component: <NextjsIcon className={techStackIconClassName} />,
  },
  {
    key: 'nest',
    component: <NestjsIcon className={techStackIconClassName} />,
  },
  {
    key: 'node',
    component: <NodejsIcon className={techStackIconClassName} />,
  },
  {
    key: 'react-query',
    component: <ReactQueryIcon className={techStackIconClassName} />,
  },
  {
    key: 'wagmi',
    component: <WagmiIcon className={techStackIconClassName} />,
  },
] satisfies { key: string; component: ReactNode }[]

const innerRingTechStackData = [
  {
    key: 'github actions',
    component: <GitHubActionsIcon className={techStackIconClassName} />,
  },
  {
    key: 'git',
    component: <GitIcon className={techStackIconClassName} />,
  },
  {
    key: 'neovim',
    component: <NeovimIcon className={techStackIconClassName} />,
  },
  {
    key: 'obsidian',
    component: <ObsidianIcon className={techStackIconClassName} />,
  },
  {
    key: 'prisma',
    component: <PrismaIcon className={techStackIconClassName} />,
  },
  {
    key: 'shadcnui',
    component: <ShadcnuiIcon className={techStackIconClassName} />,
  },
  {
    key: 'vim',
    component: <VimIcon className={techStackIconClassName} />,
  },
] satisfies { key: string; component: ReactNode }[]

const outerTechStackData = [
  ...outerRingTechStackData.map(item => ({ ...item, key: `${item.key}-first` })),
  ...outerRingTechStackData.map(item => ({ ...item, key: `${item.key}-second` })),
]
const innerTechStackData = [
  ...innerRingTechStackData.map(item => ({ ...item, key: `${item.key}-first` })),
  ...innerRingTechStackData.map(item => ({ ...item, key: `${item.key}-second` })),
]
const ringBaseCount = Math.max(outerRingTechStackData.length, innerRingTechStackData.length)

function TechStack() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="mask-[linear-gradient(to_bottom,black_70%,transparent_100%)] flex h-44 justify-center overflow-hidden md:h-88">
        <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] flex w-full justify-center pt-12">
          <TechStackRings
            outerItems={outerTechStackData}
            innerItems={innerTechStackData}
            ringBaseCount={ringBaseCount}
          />
        </div>
      </div>
    </div>
  )
}

export default TechStack
