import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/pages/api/auth/[...nextauth]";
import { type NextApiRequest, type NextApiResponse } from "next";
import superjson from "superjson";
import { appRouter } from "./root"; // <-- Add this line
import type { AppRouter } from "./root"; // <-- Add this line

export const createTRPCContext = async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
  const session = await getServerSession(req, res, authOptions);
  return {
    req,
    res,
    session,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

/**
 * ✅ Add this export — used to call procedures on the server directly
 */
export const createCallerFactory = () => appRouter.createCaller;

