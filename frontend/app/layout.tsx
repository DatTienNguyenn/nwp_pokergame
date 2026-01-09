import type { Metadata } from "next";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import "./globals.css";
import "./index.css";
import "./styles/navigation.css";

export const metadata: Metadata = {
  title: "Poker Online",
  description: "A multiplayer poker game built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          <main className="main-content">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
