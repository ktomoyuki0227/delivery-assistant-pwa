import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '配達支援アプリ',
  description: 'タブレット画面を撮影して配達先を素早く検索',
  manifest: '/manifest.json',
  themeColor: '#4285f4',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '配達支援',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
