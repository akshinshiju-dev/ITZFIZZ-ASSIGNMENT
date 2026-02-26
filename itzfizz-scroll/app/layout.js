import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "900"] });

export const metadata = {
  title: "Welcome ITZFIZZ – Scroll Animation",
  description: "ITZFIZZ – Premium Delivery Experience with real-time intelligence and blazing-fast routes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
