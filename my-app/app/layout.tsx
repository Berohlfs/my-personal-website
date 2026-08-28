// CSS
import "./globals.css"
// Next
import type { Metadata, Viewport } from "next"
import { Fraunces, IBM_Plex_Mono } from "next/font/google"

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://bernardorohlfs.com"),
  title: "Bernardo Rohlfs — Software Engineer",
  description:
    "Personal site of Bernardo Rohlfs, software engineer — a small interactive night sky.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Bernardo Rohlfs",
    title: "Bernardo Rohlfs — Software Engineer",
    description:
      "Personal site of Bernardo Rohlfs, software engineer — a small interactive night sky.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Bernardo Rohlfs — software engineer, under a night sky",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bernardo Rohlfs — Software Engineer",
    description:
      "Personal site of Bernardo Rohlfs, software engineer — a small interactive night sky.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0f1e",
  colorScheme: "dark",
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
