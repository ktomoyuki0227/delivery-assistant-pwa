# 📱 スマホでカメラが動作しない問題の解決方法

## ❌ 問題

スマホ(Safari/Chrome)でカメラ画面にアクセスすると、以下のエラーが発生:

```
TypeError: Cannot read properties of undefined (reading 'getUserMedia')
```

## 🔍 原因

**HTTPSでないとカメラAPIが動作しません**

- ブラウザのセキュリティポリシーにより、`navigator.mediaDevices.getUserMedia()` はHTTPS接続でのみ利用可能
- 例外: `localhost` はHTTPでも動作(開発用)
- スマホから `http://192.168.x.x:3000` でアクセスすると、HTTPSではないためカメラが使えない

---

## ✅ 解決方法

### 方法1: Vercelにデプロイ(推奨・最も簡単)

Vercelにデプロイすると、自動的にHTTPS対応のURLが発行されます。

#### ステップ1: Vercel CLIをインストール

```bash
npm install -g vercel
```

#### ステップ2: デプロイ

```bash
cd "c:\Users\ktomo\OneDrive - 同志社大学\dev\pizza-hut\delivery-assistant-pwa"
vercel
```

プロンプトに従って設定:
- プロジェクト名を入力
- デプロイ先を選択

#### ステップ3: 完了!

デプロイが完了すると、HTTPS対応のURLが発行されます:

```
https://delivery-assistant-pwa-xxxxx.vercel.app
```

このURLをスマホのブラウザで開けば、カメラが正常に動作します!

---

### 方法2: ngrokを使用(一時的なHTTPSトンネル)

開発環境のまま、HTTPSでアクセスできるようにします。

#### ステップ1: ngrokをインストール

```bash
npm install -g ngrok
```

#### ステップ2: トンネルを作成

```bash
ngrok http 3000
```

#### ステップ3: 表示されたURLにアクセス

ngrokが生成したHTTPS URLをスマホで開く:

```
https://xxxx-xxxx-xxxx.ngrok.io
```

> **注意**: ngrokの無料版は、セッションが終了するとURLが変わります。

---

### 方法3: 自己署名SSL証明書(上級者向け)

ローカル開発環境でHTTPSを有効にします。

#### ステップ1: mkcertをインストール

```bash
# Chocolateyを使用(Windowsの場合)
choco install mkcert

# または手動でダウンロード
# https://github.com/FiloSottile/mkcert/releases
```

#### ステップ2: ローカルCA証明書を作成

```bash
mkcert -install
```

#### ステップ3: localhost用の証明書を生成

```bash
cd "c:\Users\ktomo\OneDrive - 同志社大学\dev\pizza-hut\delivery-assistant-pwa"
mkcert localhost 192.168.11.15
```

#### ステップ4: Next.jsでHTTPSを有効化

`package.json`を編集:

```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0 --experimental-https --experimental-https-key ./localhost+1-key.pem --experimental-https-cert ./localhost+1.pem"
  }
}
```

#### ステップ5: サーバーを再起動

```bash
npm run dev
```

これで `https://192.168.11.15:3000` でアクセス可能!

---

## 🎯 推奨: Vercelにデプロイ

**最も簡単で確実な方法は、Vercelにデプロイすることです。**

### メリット
- ✅ 自動HTTPS対応
- ✅ 無料プラン利用可能
- ✅ 高速CDN
- ✅ 自動デプロイ
- ✅ どこからでもアクセス可能

### デメリット
- ❌ コード変更のたびにデプロイが必要(開発中は不便)

---

## 🚀 クイックデプロイ手順

```bash
# 1. Vercel CLIをインストール
npm install -g vercel

# 2. プロジェクトディレクトリに移動
cd "c:\Users\ktomo\OneDrive - 同志社大学\dev\pizza-hut\delivery-assistant-pwa"

# 3. デプロイ
vercel

# 4. 表示されたURLをスマホで開く
# 例: https://delivery-assistant-pwa.vercel.app
```

---

## 📝 まとめ

| 方法 | 難易度 | 推奨度 | 用途 |
|------|--------|--------|------|
| Vercel | ★☆☆ | ★★★ | 本番環境・実機テスト |
| ngrok | ★★☆ | ★★☆ | 一時的なテスト |
| 自己署名SSL | ★★★ | ★☆☆ | ローカル開発 |

**結論**: まずは**Vercel**にデプロイして、スマホでテストすることを強く推奨します!

---

## 💡 次のステップ

1. Vercelにデプロイ
2. スマホでHTTPS URLにアクセス
3. カメラ権限を許可
4. アプリをテスト!

問題が解決したら、実際のタブレット画面を撮影してOCRをテストしてください!
