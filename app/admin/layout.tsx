import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { noPermission } from '@/lib/auth'
import AdminNavbar from '@/modules/admin/layout/admin-layout-header'
import { ModalProvider } from '@/ui/components/provider/modal-provider'
import ReactQueryProvider from '@/ui/components/provider/react-query-provider'
import { Toaster } from '@/ui/shadcn/sonner'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (await noPermission()) {
    redirect('/')
  }

  return (
    <SessionProvider>
      <ReactQueryProvider>
        <ModalProvider>
          <main className="flex min-h-screen max-w-screen flex-col dark:bg-black dark:text-white">
            <AdminNavbar />
            <div className="mt-2 flex flex-1 px-6">
              <main className="flex flex-1">{children}</main>
            </div>
            <Toaster position="top-center" richColors />
          </main>
        </ModalProvider>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
