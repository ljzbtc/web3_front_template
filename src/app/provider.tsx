"use client"

import { WagmiProvider, State } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config, projectId } from "../../config"
import { createWeb3Modal } from '@web3modal/wagmi/react'


const queryClient = new QueryClient()

createWeb3Modal({
	wagmiConfig: config,
	projectId,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
	enableOnramp: true // Optional - false as default
})

export function Web3ModalProvider(
	{ children, initialState }: 
	{ children: React.ReactNode, initialState?: State }
) {
	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	)
}
