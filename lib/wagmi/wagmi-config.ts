import { createClient } from 'viem'
import { createConfig, http, injected } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  // TODO: mainnet, bsc or eth （*＾-＾*）
  chains: [sepolia],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
})
