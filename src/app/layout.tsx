import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Range exercises | Slash Mobility',
  description: 'Custom Range component with continuous and fixed values.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
