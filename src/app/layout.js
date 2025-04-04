import { Inter, Playfair_Display, Montserrat } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

export const metadata = {
  title: "Wedding Invitation | Couple Name",
  description: "Join us on our special day",
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} font-sans bg-ivory`}>
        {children}
      </body>
    </html>
  )
}

