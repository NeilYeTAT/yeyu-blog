import AdminLayout from '@/ui/admin/admin-layout'

export default async function layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
