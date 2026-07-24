import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileShell } from "@/components/mobile/MobileShell";

export const metadata: Metadata = {
  title: "ZPMC Issues - Hambantota International Port",
  description: "Enterprise HR Complaint Management Mobile Portal for Hambantota International Port Group",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "ZPMC Issues",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/zpmc-hr-icon.png", sizes: "512x512", type: "image/png" },
      { url: "/app-icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/zpmc-hr-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F4C81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/zpmc-hr-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/app-icon.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/zpmc-hr-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZPMC Issues" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ZPMC Issues" />
      </head>
      <body suppressHydrationWarning>
        <MobileShell>{children}</MobileShell>
      </body>
    </html>

  );
}
