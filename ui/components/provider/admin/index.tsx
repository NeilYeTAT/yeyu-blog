import { AdminModalProvider } from './admin-modal-provider'

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  return <AdminModalProvider> {children} </AdminModalProvider>
}
