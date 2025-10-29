"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Data freshness and caching
						staleTime: 60 * 1000, // 1 minute - data considered fresh
						gcTime: 5 * 60 * 1000, // 5 minutes - cache garbage collection

						// Auto-refetching for real-time updates (perfect for departure boards)
						refetchInterval: 15 * 1000, // 15 seconds
						refetchIntervalInBackground: true, // Keep refetching even when tab is inactive

						// Network resilience
						retry: 3, // Retry failed requests 3 times
						retryDelay: (attemptIndex) =>
							Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff: 1s, 2s, 4s

						// Performance optimizations
						refetchOnWindowFocus: false, // Don't refetch on window focus (we have auto-refresh)
						refetchOnReconnect: true, // Do refetch when internet reconnects
						refetchOnMount: true, // Refetch when component mounts
					},
					mutations: {
						// Retry mutations once on failure
						retry: 1,
						retryDelay: 1000,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* DevTools only render in development */}
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
		</QueryClientProvider>
	);
}
