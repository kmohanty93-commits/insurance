import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaimFlow - Insurance Claim Management",
  description: "Enterprise insurance claim workflow management system for manufacturing companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
