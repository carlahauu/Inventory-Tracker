import { Varela_Round } from "next/font/google";

import "./globals.css";

export const varela = Varela_Round({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Inventory Tracker",
  description: "Developed by Carla Hau",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={varela.className}>{children}</body>
      </html>
  );
}
