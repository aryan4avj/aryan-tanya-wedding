import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.social.url),
  title: siteConfig.social.title,
  description: siteConfig.social.description,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: siteConfig.social.url,
    title: siteConfig.social.title,
    description: siteConfig.social.description,
    images: [{ url: siteConfig.social.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.social.title,
    description: siteConfig.social.description,
    images: [siteConfig.social.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9F1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon / app icons - using the couple logo */}
        <link rel="icon"             href="/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400;1,6..96,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Manrope:wght@300;400;500;600;700&family=Dancing+Script:wght@500;600&family=Noto+Sans+Devanagari:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#FFF9F1", margin: 0, padding: 0, overflowX: "hidden" }}>
        {/* Responsive helpers - reliable across all CSS build modes */}
        <style>{`
          @media (min-width: 768px) {
            .md\\:hidden  { display: none !important; }
            .md\\:flex    { display: flex !important; }
            .hidden       { display: none; }
          }
          @media (max-width: 767px) {
            .hidden       { display: none; }
            .md\\:flex    { display: none !important; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
