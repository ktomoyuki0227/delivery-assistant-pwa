'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('カメラAPIが利用できません。HTTPSでアクセスする必要があります。');
        setIsLoading(false);
        return;
      }

      // Try with environment camera first (back camera on mobile)
      let mediaStream: MediaStream | null = null;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      } catch (err) {
        // Fallback: try with simpler constraints for iOS
        console.log('Trying fallback camera constraints...');
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }

      console.log('Camera stream obtained:', mediaStream);
      console.log('Video tracks:', mediaStream.getVideoTracks());

      setStream(mediaStream);
      setIsLoading(false);

      // Wait for next render cycle to ensure video element exists
      setTimeout(() => {
        if (videoRef.current && mediaStream) {
          console.log('Setting srcObject...');
          videoRef.current.srcObject = mediaStream;
          console.log('srcObject set successfully');

          // Force video to play immediately after a short delay
          setTimeout(async () => {
            if (videoRef.current) {
              console.log('Attempting to play video...');
              console.log('Video readyState:', videoRef.current.readyState);
              console.log('Video paused:', videoRef.current.paused);
              try {
                await videoRef.current.play();
                console.log('Video playing successfully');
                console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
              } catch (playErr) {
                console.error('Video play error:', playErr);
              }
            } else {
              console.error('videoRef.current is null in setTimeout');
            }
          }, 100);
        } else {
          console.error('videoRef.current or mediaStream is null after render');
        }
      }, 200);
    } catch (err: any) {
      console.error('Camera error:', err);
      let errorMessage = 'カメラへのアクセスが必要です。';

      if (err.name === 'NotAllowedError') {
        errorMessage = 'カメラへのアクセスが拒否されました。Safariの設定 > このWebサイト > カメラ を「許可」に変更してください。';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'カメラが見つかりません。';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'カメラが他のアプリで使用中です。他のアプリを閉じてから再試行してください。';
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Store image in sessionStorage and navigate to confirm page
    sessionStorage.setItem('capturedImage', imageData);
    router.push('/confirm');
  };

  const cancelCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    router.push('/');
  };

  return (
    <div className="container">
      <div style={{ padding: '20px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
          📸 タブレット画面を撮影
        </h1>
        <p style={{ color: '#5f6368', marginBottom: '20px' }}>
          画面全体が入るように撮影してください
        </p>
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button
            className="button button-secondary"
            onClick={startCamera}
            style={{ marginTop: '12px', padding: '12px 24px', fontSize: '14px' }}
          >
            再試行
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="loading">
          <div className="spinner"></div>
          <p>カメラを起動中...</p>
        </div>
      )}

      {!error && !isLoading && (
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />

          <div className="camera-controls">
            <button
              onClick={cancelCapture}
              className="button button-secondary"
              style={{ padding: '12px 24px', width: 'auto' }}
            >
              キャンセル
            </button>
            <button
              onClick={captureImage}
              className="capture-button"
              title="撮影"
            />
            <div style={{ width: '120px' }}></div> {/* Spacer for centering */}
          </div>
        </div>
      )}

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#e8f0fe', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', color: '#1967d2' }}>
          💡 <strong>撮影のコツ:</strong>
        </p>
        <ul style={{ marginTop: '8px', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', color: '#1967d2' }}>
          <li>明るい場所で撮影</li>
          <li>画面に対して正面から</li>
          <li>反射を避ける</li>
        </ul>
      </div>
    </div>
  );
}
