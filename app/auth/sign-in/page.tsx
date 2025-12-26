'use client'

import { GithubIcon, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import StarsBackground from '@/ui/components/shared/stars-background'
import { Button } from '@/ui/shadcn/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/card'

export default function LoginPage() {
  return (
    <div className="m-auto flex flex-col">
      <Card className="relative w-[320px] rounded-3xl py-4 sm:w-full sm:max-w-none sm:min-w-[360px]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle>
            <h3>你要登录喵?</h3>
          </CardTitle>
          <CardDescription>暂时仅支持GitHub登录喵 OvO</CardDescription>
        </CardHeader>
        <CardFooter>
          <main className="flex w-full flex-col gap-4">
            <Button
              type="button"
              onClick={() => signIn('github', { redirectTo: '/admin' })}
              className="cursor-pointer"
            >
              <GithubIcon />
              GitHub登录
            </Button>

            <HorizontalDividingLine />

            <Link href="/">
              <Button type="button" className="w-full cursor-pointer">
                <RotateCcw />
                回到过去喵~
              </Button>
            </Link>
          </main>
        </CardFooter>
      </Card>
      <StarsBackground />
    </div>
  )
}
