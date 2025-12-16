'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TextBlock {
  text: string;
  confidence: number;
}

export default function ConfirmPage() {
  const [imageData, setImageData] = useState<string>('');
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(2);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const captured = sessionStorage.getItem('capturedImage');
    if (!captured) {
      router.push('/camera');
      return;
    }
    setImageData(captured);
    processOCR(captured);
  }, []);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isCountingDown && countdown === 0) {
      proceedToMap();
    }
  }, [countdown, isCountingDown]);

  const processOCR = async (image: string) => {
    try {
      // Simulate OCR processing (replace with actual Google Cloud Vision API call)
      // For prototype, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockTexts: TextBlock[] = [
        { text: '配達先住所', confidence: 0.95 },
        { text: '東京都渋谷区道玄坂1-2-3', confidence: 0.98 },
        { text: 'サンプルマンション 405号室', confidence: 0.96 },
        { text: 'お客様名: 山田太郎', confidence: 0.94 },
        { text: '電話番号: 090-1234-5678', confidence: 0.93 },
        { text: '配達時間: 18:00-19:00', confidence: 0.92 },
      ];

      setTextBlocks(mockTexts);

      // Auto-select address (index 1 in this case)
      const addressIndex = findAddressIndex(mockTexts);
      setSelectedIndex(addressIndex);

      setIsProcessing(false);
      setIsCountingDown(true);
    } catch (err) {
      setError('テキストを読み取れませんでした。明るい場所で再撮影してください。');
      setIsProcessing(false);
    }
  };

  const findAddressIndex = (texts: TextBlock[]): number => {
    // Simple address detection logic
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i].text;
      if (
        text.includes('都') || text.includes('府') || text.includes('県') ||
        /\d+-\d+-\d+/.test(text) ||
        /\d+丁目/.test(text)
      ) {
        return i;
      }
    }
    return 0;
  };

  const handleTextSelect = (index: number) => {
    setSelectedIndex(index);
    setCountdown(2);
    setIsCountingDown(true);
  };

  const proceedToMap = () => {
    const selectedText = textBlocks[selectedIndex]?.text || '';
    sessionStorage.setItem('selectedAddress', selectedText);
    router.push('/map');
  };

  const retake = () => {
    sessionStorage.removeItem('capturedImage');
    router.push('/camera');
  };

  if (isProcessing) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ fontSize: '18px', fontWeight: '600' }}>テキストを読み取り中...</p>
          <p style={{ fontSize: '14px', color: '#5f6368', marginTop: '8px' }}>
            約3-4秒かかります
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
        <button className="button" onClick={retake} style={{ marginTop: '20px' }}>
          再撮影
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
          📝 テキスト確認
        </h1>
        <p style={{ color: '#5f6368', marginBottom: '20px' }}>
          住所を確認してください(自動選択されています)
        </p>
      </div>

      {imageData && (
        <img
          src={imageData}
          alt="Captured"
          style={{
            width: '100%',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        />
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          検出されたテキスト:
        </h2>
        {textBlocks.map((block, index) => (
          <div
            key={index}
            className={`text-block ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleTextSelect(index)}
          >
            {block.text}
          </div>
        ))}
      </div>

      {isCountingDown && (
        <div className="countdown">
          {countdown}秒後に地図を表示...
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button
          className="button button-secondary"
          onClick={retake}
          style={{ flex: 1 }}
        >
          再撮影
        </button>
        <button
          className="button"
          onClick={proceedToMap}
          style={{ flex: 2 }}
        >
          すぐに地図で確認
        </button>
      </div>
    </div>
  );
}
