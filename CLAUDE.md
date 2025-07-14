# Notion Clone - Claude Development Context

## 🚀 プロジェクト概要

フルスタックのNotionクローンアプリケーション。Android開発者がWeb開発を学習するための実践的プロジェクト。

### 技術スタック
- **Backend**: Node.js + Express + SQLite3
- **Frontend**: Vanilla JavaScript (HTML5 + CSS3 + Bootstrap Icons)
- **Database**: SQLite3
- **Testing**: Jest (Unit) + Playwright (E2E)
- **Development**: Claude Code Driven Development

## 📁 プロジェクト構造

```
notion-clone/
├── client/                 # フロントエンド
│   ├── index.html         # メインページ
│   ├── style.css          # スタイルシート
│   ├── script.js          # メインロジック
│   └── api.js             # API通信クライアント
├── docs/                  # ドキュメント
│   └── DEVELOPMENT_GUIDE.md  # 開発ガイド（Android → Web）
├── tests/                 # テストファイル（未実装）
│   ├── unit/             # Jest単体テスト
│   ├── integration/      # 統合テスト
│   └── e2e/              # Playwright E2Eテスト
├── server.js             # Express バックエンドサーバー
├── notion.db             # SQLiteデータベース
├── package.json          # 依存関係・スクリプト
└── CLAUDE.md             # このファイル
```

## 🎯 実装済み機能

### ✅ コア機能
- **ページ管理**: 作成・選択・タイトル編集・階層表示
- **ブロックエディタ**: 8種類のブロックタイプ
- **リアルタイム編集**: contenteditable + 自動保存
- **UI/UX**: ダークモード・レスポンシブデザイン・ドラッグ&ドロップ

### ✅ ブロックタイプ
1. テキスト (text)
2. 見出し1-3 (heading1, heading2, heading3)
3. 箇条書き (bullet)
4. 番号付きリスト (numbered)
5. To-Doリスト (todo)
6. コードブロック (code)
7. 引用 (quote)
8. 区切り線 (divider)

### ✅ インタラクション
- **Enter**: 新しいブロック作成
- **Backspace**: 空ブロック削除
- **"/" スラッシュコマンド**: ブロックタイプ選択メニュー
- **左側アイコン**: ブロックタイプ変更
- **ドラッグ&ドロップ**: ブロック並び替え

## 🔄 API エンドポイント

### Pages API
```
GET    /api/pages           # 全ページ取得
GET    /api/pages/:id       # 特定ページ取得
POST   /api/pages           # ページ作成
PUT    /api/pages/:id       # ページ更新
DELETE /api/pages/:id       # ページ削除
```

### Blocks API
```
GET    /api/pages/:pageId/blocks    # ページのブロック取得
POST   /api/pages/:pageId/blocks    # ブロック作成
PUT    /api/blocks/:id              # ブロック更新
DELETE /api/blocks/:id              # ブロック削除
PUT    /api/pages/:pageId/blocks/reorder  # ブロック順序変更
```

## 🗄️ データベース構造

### pages テーブル
```sql
CREATE TABLE pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    parent_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### blocks テーブル
```sql
CREATE TABLE blocks (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    order_index INTEGER NOT NULL,
    checked INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);
```

## 🚧 未実装機能

### 🎯 高優先度
- [ ] **ユーザー認証**: 登録・ログイン・セッション管理
- [ ] **リアルタイム編集**: WebSocket + Socket.IO
- [ ] **テスト環境**: Jest + Playwright テストスイート
- [ ] **データバリデーション**: API入力検証

### 🔮 将来実装
- [ ] **操作の競合解決**: Operational Transformation
- [ ] **ファイルアップロード**: 画像・添付ファイル
- [ ] **検索機能**: 全文検索
- [ ] **エクスポート**: PDF・Markdown出力
- [ ] **テーマシステム**: カスタムテーマ

## 🎨 開発フロー（Android → Web）

### Claude Code Driven Development
```
Issue作成 → Claude実装 → ローカルテスト → 動作確認 → レビュー
```

### Android → Web 対応表
```
Activity/Fragment → HTML + JavaScript Class
ViewModel         → JavaScript State Management
Intent/Bundle     → Function Parameters/Props
OnClickListener   → addEventListener
findViewById      → querySelector/data-testid
JUnit            → Jest
Espresso         → Playwright
```

## 🧪 品質保証

### テスト戦略
- **単体テスト**: Jest (JUnit相当)
- **E2Eテスト**: Playwright (Espresso相当)
- **リント**: ESLint + Prettier
- **カバレッジ**: Jest coverage reports

### 実行コマンド
```bash
npm run test:unit          # 単体テスト
npm run test:e2e          # E2Eテスト (UI)
npm run test:e2e:headless # E2Eテスト (ヘッドレス)
npm run lint              # コード品質チェック
npm run quality           # 総合品質チェック
```

## 🔧 サーバー管理

### 開発環境
```bash
npm run dev               # nodemon 開発サーバー
npm start                 # 本番サーバー
```

### API テスト
```bash
curl -X GET http://localhost:3001/api/pages
curl -X POST http://localhost:3001/api/pages -H "Content-Type: application/json" -d '{"title":"テストページ"}'
```

## 🎯 Claude 実装ガイドライン

### 実装時の重要原則
1. **既存構造を維持**: Vanilla JS構造を保持
2. **段階的実装**: 小さな単位で確実に
3. **テストファースト**: TDD アプローチ
4. **Android類推**: 既存Android知識を活用
5. **品質重視**: lint + test の通過を確認

### 実装パターン
- **機能追加**: Issue → Test → Implementation → E2E → Review
- **バグ修正**: 再現 → Test → Fix → Verification
- **リファクタリング**: Test保持 → Refactor → Test確認

## 📚 参考ドキュメント

- [開発ガイド](./docs/DEVELOPMENT_GUIDE.md) - Android開発者向け詳細ガイド
- [README.md](./README.md) - 基本的な使用方法・セットアップ
- package.json - 依存関係・実行可能スクリプト

---

**💡 開発のポイント**: Android開発の知見を活かし、Webにおけるコンポーネント設計とTDD実践で高品質な実装を目指す。Claude Codeを開発パートナーとして活用し、Issue駆動開発で段階的に機能を拡充する。