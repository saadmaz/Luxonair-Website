import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { routeTree } from "./routeTree.gen";
import { ApiError } from "@/lib/api";

// Admin-only: session died mid-visit (cookie expired/revoked) — every admin
// API call starts 401ing well before the `me` query's 5-minute staleTime
// would notice on its own, so redirect immediately instead of leaving the
// user staring at blank tables and silently-failing saves.
function handleQueryError(error: unknown) {
  if (typeof window === "undefined") return;
  if (!window.location.pathname.startsWith("/admin")) return;

  if (error instanceof ApiError && error.status === 401) {
    if (window.location.pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }
    return;
  }

  toast.error(error instanceof Error ? error.message : "Something went wrong.");
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleQueryError }),
    mutationCache: new MutationCache({ onError: handleQueryError }),
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
