import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import "~/styles/globals.css";
import "~/styles/globals.css";
import { trpcHOC } from "~/utils/trpc";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className={geist.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};
export default trpcHOC.withTRPC(MyApp);