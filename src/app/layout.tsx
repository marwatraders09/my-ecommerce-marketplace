import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noura Market",
  description: "A considered marketplace for everyday discoveries.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}