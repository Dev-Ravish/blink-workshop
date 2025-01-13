import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Blink Workshop",
  description: "Generate blink for your workshop in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
