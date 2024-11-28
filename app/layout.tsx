import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SNP Manager",
  description: "Manage your passwords securely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="header">
          <nav className="navbar">
            <a href="/">Home</a>
            <a href="/auth/login">Login</a>
            <a href="/auth/register">Register</a>
          </nav>
        </header>
        <div className="main-content">{children}</div>
      </body>
    </html>
  );
}
