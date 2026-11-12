import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoltMart | Electrical & Electronics",
  description: "Shop electrical supplies and electronics in Cambodia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="km"><body>{children}</body></html>;
}
