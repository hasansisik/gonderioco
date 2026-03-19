import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Sadece Teklif",
  description: "Sadece Teklif CRM ve Teklif Yönetim Sistemi",
};

import { Toaster } from "@/components/ui/sonner";
import { SocketListener } from "@/components/socket-listener";
import { Metadata } from "next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Providers>
          {children}
          <SocketListener />
          <Toaster position="bottom-right" expand={true} richColors />
        </Providers>
      </body>
    </html>
  );
}
