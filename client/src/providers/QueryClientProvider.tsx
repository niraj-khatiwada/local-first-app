import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query"

const abc_def = "1"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    },
  },
})

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  )
}
