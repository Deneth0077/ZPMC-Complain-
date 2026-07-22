import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileShell } from "@/components/mobile/MobileShell";

export const metadata: Metadata = {
  title: "Hambantota Port HR Complaint Management System",
  description: "Enterprise HR Complaint Management Mobile Portal for Hambantota International Port Group",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      </head>
      <body>
        <MobileShell>{children}</MobileShell>
      </body>
    </html>
  );
}
