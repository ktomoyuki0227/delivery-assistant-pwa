'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@googlemaps/js-api-loader';

export default function MapPage() {
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const selectedAddress = sessionStorage.getItem('selectedAddress');
    if (!selectedAddress) {
      router.push('/camera');
      return;
    }
    setAddress(selectedAddress);
    loadMap(selectedAddress);
  }, []);

  const loadMap = async (addr: string) => {
    try {
      // For prototype, we'll use a mock map
      // In production, replace with actual Google Maps API key
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock: Create a simple placeholder
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">📍</div>
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">配達先の位置</div>
            <div style="font-size: 16px; opacity: 0.9;">${addr}</div>
            <div style="margin-top: 20px; padding: 12px 24px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 14px;">
              ※ プロトタイプ版: 実際の地図はGoogle Maps APIで表示されます
            </div>
          </div>
        `;
      }

      setIsLoading(false);
    } catch (err) {
      setError('地図を読み込めませんでした。もう一度お試しください。');
      setIsLoading(false);
    }
  };

  const startNavigation = () => {
    // Open Google Maps with the address
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const goBack = () => {
    router.push('/confirm');
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ fontSize: '18px', fontWeight: '600' }}>地図を読み込み中...</p>
          <p style={{ fontSize: '14px', color: '#5f6368', marginTop: '8px' }}>
            約2-3秒かかります
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>{error}</p>
        </div>
        <button className="button" onClick={() => loadMap(address)} style={{ marginTop: '20px' }}>
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
          🗺️ 配達先の確認
        </h1>
        <p style={{ color: '#5f6368', marginBottom: '12px', fontSize: '16px', fontWeight: '500' }}>
          {address}
        </p>
      </div>

      <div ref={mapRef} className="map-container"></div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          className="button button-secondary"
          onClick={goBack}
          style={{ flex: 1 }}
        >
          戻る
        </button>
        <button
          className="button"
          onClick={startNavigation}
          style={{ flex: 2 }}
        >
          🧭 ナビ開始
        </button>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#e8f0fe', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', color: '#1967d2' }}>
          ✅ <strong>完了!</strong>
        </p>
        <p style={{ fontSize: '14px', color: '#1967d2', marginTop: '8px' }}>
          「ナビ開始」をタップすると、Googleマップアプリ(またはWeb版)が起動し、ナビゲーションが開始されます。
        </p>
      </div>

      <button
        className="button button-secondary"
        onClick={() => router.push('/')}
        style={{ marginTop: '20px', width: '100%' }}
      >
        ホームに戻る
      </button>
    </div>
  );
}
