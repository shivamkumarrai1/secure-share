import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import type { AppRouter } from "~/server/api/root";
import type { NextPageContext } from "next";

export const trpcHOC = createTRPCNext<AppRouter>({
    config({ ctx }: { ctx?: NextPageContext }) {
        return {
            links: [
                httpBatchLink({
                    url: "/api/trpc",
                }),
            ],
            transformer: superjson,
        };
    },
    ssr: false,
});

