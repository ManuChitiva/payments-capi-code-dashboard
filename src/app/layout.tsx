import { Cormorant_Garamond, Geist, Geist_Mono, Rajdhani } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { siteMetadata } from "@/lib/site-seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const brandScript = Cormorant_Garamond({
  variable: "--font-brand-script",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} ${brandScript.variable} min-h-screen antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('capicode-theme');var m=t==='light'?'light':'dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(m);document.documentElement.style.colorScheme=m;}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-brand-bg font-sans text-brand-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
