import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./authContext";

<<<<<<< HEAD
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
=======
const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
>>>>>>> 5d17fdde6ce75fe68e564e555f4daf75ce770e75
}
