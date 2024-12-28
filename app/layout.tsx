import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { CartContextProvider } from "./cart/context/cartContext";
import NavbarLoader from "./components/navbar/navbar-loader";


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
}: Readonly<{
  children: React.ReactNode;
}>) {




  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden no-scrollbar`}
      >
        <SessionProvider>
          <CartContextProvider>
          <NavbarLoader />
            {children}
            </CartContextProvider>
      </ SessionProvider> 
      </body>
    </html>
  );
}
