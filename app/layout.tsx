import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { CartContextProvider } from "./cart/context/cartContext";
import NavbarLoader from "./components/navbar/navbar-loader";
import FooterLoader from "./components/footer/footer_loader";
import { Toaster } from "@/components/ui/toaster";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden no-scrollbar overflow-y-auto min-h-screen"`}
      >
        <SessionProvider>
          <CartContextProvider>
            <NavbarLoader />
            <main className="flex-1 overflow-y-auto">{children}</main>
            <Toaster />
            <FooterLoader />
          </CartContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
