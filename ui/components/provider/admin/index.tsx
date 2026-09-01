import ReactQueryProvider from '../react-query-provider'
import { AdminModalProvider } from './admin-modal-provider'

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AdminModalProvider>{children}</AdminModalProvider>
    </ReactQueryProvider>
  )
}
