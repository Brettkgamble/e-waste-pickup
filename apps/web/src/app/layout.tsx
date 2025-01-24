import "@workspace/ui/globals.css";

import { revalidatePath, revalidateTag } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { NavbarServer, NavbarSkeleton } from "@/components/navbar";
import { SanityLive } from "@/lib/sanity/live";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Suspense fallback={<NavbarSkeleton />}>
          <NavbarServer />
        </Suspense>
        {(await draftMode()).isEnabled ? (
          <>
            {children}
            <VisualEditing
              refresh={async (payload) => {
                "use server";
                if (payload.source === "manual") {
                  revalidatePath("/", "layout");
                  return;
                }
                const id = payload?.document?._id?.startsWith("drafts.")
                  ? payload?.document?._id.slice(7)
                  : payload?.document?._id;
                const slug = payload?.document?.slug?.current;
                const type = payload?.document?._type;
                for (const tag of [slug, id, type]) {
                  if (tag) revalidateTag(tag);
                }
              }}
            />
          </>
        ) : (
          children
        )}
        <Suspense fallback={<FooterSkeleton />}>
          <FooterServer />
        </Suspense>
        <Suspense>
          <SanityLive />
        </Suspense>
      </body>
    </html>
  );
}
