import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#4285f4' }}>
            📦 配達支援アプリ
          </h1>
          <p style={{ fontSize: '18px', color: '#5f6368', marginBottom: '8px' }}>
            タブレット画面を撮影するだけで
          </p>
          <p style={{ fontSize: '18px', color: '#5f6368' }}>
            配達先を素早く検索できます
          </p>
        </div>

        <Link href="/camera" style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <button className="button" style={{ fontSize: '20px', padding: '20px 40px' }}>
            📸 配達先を撮影
          </button>
        </Link>

        <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            使い方
          </h2>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>タブレット画面を撮影</li>
            <li>住所が自動で検出されます</li>
            <li>地図で位置を確認</li>
            <li>Googleマップでナビ開始!</li>
          </ol>
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#5f6368' }}>
            ⏱️ 撮影から地図表示まで約10秒
          </p>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: '#5f6368', fontSize: '14px' }}>
        <p>© 2025 配達支援アプリ</p>
      </footer>
    </div>
  );
}
