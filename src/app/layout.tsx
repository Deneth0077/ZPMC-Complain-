import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileShell } from "@/components/mobile/MobileShell";

export const metadata: Metadata = {
  title: "Hambantota Port HR - ZPMC Issues",
  description: "Enterprise HR Complaint Management Mobile Portal for Hambantota International Port Group",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "HIP HR",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HIP HR" />
      </head>
      <body>
        <MobileShell>{children}</MobileShell>
      </body>
    </html>
  );
}
