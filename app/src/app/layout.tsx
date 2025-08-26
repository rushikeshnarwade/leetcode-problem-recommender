import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "LeetCode Problem Recommender",
  description: "Get personalized LeetCode problem recommendations based on your skill level and progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-primary antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-background text-text transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="animate-fade-in">
                {children}
              </div>
            </main>
            {/* Subtle background pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-blue/10"></div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}