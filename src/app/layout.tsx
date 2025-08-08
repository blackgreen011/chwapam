import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHANS PAW - Sorteios Premium",
  description: "Participe dos sorteios mais exclusivos do mundo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}