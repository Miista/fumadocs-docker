import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { DevClient } from '@fumadocs/local-md/dev/react-client';
import SearchDialog from '@/components/search';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ SearchDialog }}>
          <DevClient />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
