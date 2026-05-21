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

const outerRingTechStackData = [
  {
    key: 'ts',
    component: <TypeScriptIcon className="size-full" />,
  },
  {
    key: 'react',
    component: <ReactIcon className="size-full" />,
  },
  {
    key: 'tailwindcss',
    component: <TailwindcssIcon className="size-full" />,
  },
  {
    key: 'next',
    component: <NextjsIcon className="size-full" />,
  },
  {
    key: 'nest',
    component: <NestjsIcon className="size-full" />,
  },
  {
    key: 'node',
    component: <NodejsIcon className="size-full" />,
  },
  {
    key: 'react-query',
    component: <ReactQueryIcon className="size-full" />,
  },
  {
    key: 'wagmi',
    component: <WagmiIcon className="size-full" />,
  },
] satisfies { key: string; component: ReactNode }[]

const innerRingTechStackData = [
  {
    key: 'github actions',
    component: <GitHubActionsIcon className="size-full" />,
  },
  {
    key: 'git',
    component: <GitIcon className="size-full" />,
  },
  {
    key: 'neovim',
    component: <NeovimIcon className="size-full" />,
  },
  {
    key: 'obsidian',
    component: <ObsidianIcon className="size-full" />,
  },
  {
    key: 'prisma',
    component: <PrismaIcon className="size-full" />,
  },
  {
    key: 'shadcnui',
    component: <ShadcnuiIcon className="size-full" />,
  },
  {
    key: 'vim',
    component: <VimIcon className="size-full" />,
  },
] satisfies { key: string; component: ReactNode }[]

const outerTechStackData = [...outerRingTechStackData, ...outerRingTechStackData]
const innerTechStackData = [...innerRingTechStackData, ...innerRingTechStackData]
const ringBaseCount = Math.max(outerRingTechStackData.length, innerRingTechStackData.length)

function TechStack() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="mask-[linear-gradient(to_bottom,black_70%,transparent_100%)] flex h-44 justify-center overflow-hidden md:mt-20 md:h-88">
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
