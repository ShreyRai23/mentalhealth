import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { MoodProvider } from '@/context/mood-context';
import AppLayout from '@/components/app-layout';
import { ProfileProvider } from '@/context/profile-context';
import { AuthProvider } from '@/context/auth-context';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'AI Doc',
  description: 'Your personal AI health assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className={cn('font-body antialiased bg-background text-foreground')}>
        <AuthProvider>
          <ProfileProvider>
            <MoodProvider>
              <AppLayout>{children}</AppLayout>
              <Toaster />
            </MoodProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
