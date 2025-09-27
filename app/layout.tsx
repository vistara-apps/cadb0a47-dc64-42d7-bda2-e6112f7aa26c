import type { Metadata } from 'next';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'PixelForge - AI Video Generation Marketplace',
  description: 'Forge stunning videos with AI and own your media on the blockchain.',
  openGraph: {
    title: 'PixelForge',
    description: 'Forge stunning videos with AI and own your media on the blockchain.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
