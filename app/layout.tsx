
import Footer from '../components/Footer'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Ivan Nevares',
  description: 'Web developer and UI designer interested in generating creative and performant digital experiences',
  icons: {
    icon: {url: "/favicon_v2.ico"},
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className='custom'>
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}
