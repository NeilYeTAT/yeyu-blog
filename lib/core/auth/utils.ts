import type { useSession } from './client'

const ethereumAddressRegExp = /^0x[a-fA-F0-9]{40}$/

const isEthereumAddress = (value?: string | null) =>
  value !== null && value !== undefined && ethereumAddressRegExp.test(value)

// * 0x42e49a294a253f38af8d690d27884d3eb8154444@http://localhost:3000
const isWalletEmail = (email: string) => {
  const at = email.indexOf('@')
  if (at <= 0) return false
  const local = email.slice(0, at)
  return isEthereumAddress(local)
}

export const isWalletLoggedIn = ({
  data: session,
}: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user
  return user != null && isEthereumAddress(user.name) && isWalletEmail(user.email)
}

export const isEmailLoggedIn = ({ data: session }: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user
  return user != null && user.email !== '' && !isWalletEmail(user.email)
}

export const isAdminLoggedIn = ({ data: session }: Pick<ReturnType<typeof useSession>, 'data'>) => {
  return session?.isAdmin === true
}
