# Notion Clone with Node.js Backend

フルスタックのNotionクローンアプリケーションです。Node.js + Express + SQLiteのバックエンドと、バニラJavaScriptのフロントエンドで構成されています。

## 機能

### フロントエンド
- ✅ ブロックベースエディタ（8種類のブロックタイプ）
- ✅ ページ階層管理システム
- ✅ 左サイドバーのページツリー表示
- ✅ ドラッグ&ドロップでのブロック並び替え
- ✅ スラッシュコマンド（"/"）メニュー
- ✅ ダークモード対応
- ✅ レスポンシブデザイン

### バックエンド
- ✅ RESTful API（Pages & Blocks）
- ✅ SQLiteデータベース
- ✅ CORS設定
- ✅ リアルタイム自動保存
- ✅ エラーハンドリング

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. サーバーの起動
```bash
# 開発モード（nodemon使用）
npm run dev

# 本番モード
npm start
```

サーバーは http://localhost:3001 で起動します。

### 3. フロントエンドのアクセス
ブラウザで http://localhost:3001 にアクセスしてください。

## API エンドポイント

### Pages API
- `GET /api/pages` - 全ページ取得
- `GET /api/pages/:id` - 特定ページ取得
- `POST /api/pages` - ページ作成
- `PUT /api/pages/:id` - ページ更新
- `DELETE /api/pages/:id` - ページ削除

### Blocks API
- `GET /api/pages/:pageId/blocks` - ページのブロック取得
- `POST /api/pages/:pageId/blocks` - ブロック作成
- `PUT /api/blocks/:id` - ブロック更新
- `DELETE /api/blocks/:id` - ブロック削除
- `PUT /api/pages/:pageId/blocks/reorder` - ブロック順序変更

## データベース

SQLiteを使用しています。初回起動時に自動的にテーブルが作成されます。

### テーブル構造

**pages**
- id (TEXT PRIMARY KEY)
- title (TEXT)
- parent_id (TEXT)
- created_at (TEXT)
- updated_at (TEXT)

**blocks**
- id (TEXT PRIMARY KEY)
- page_id (TEXT)
- type (TEXT)
- content (TEXT)
- order_index (INTEGER)
- checked (INTEGER)
- created_at (TEXT)
- updated_at (TEXT)

## ブロックタイプ

1. **text** - 通常のテキスト
2. **heading1** - 大見出し
3. **heading2** - 中見出し
4. **heading3** - 小見出し
5. **bullet** - 箇条書きリスト
6. **numbered** - 番号付きリスト
7. **todo** - To-Doリスト
8. **code** - コードブロック
9. **quote** - 引用ブロック
10. **divider** - 区切り線

## 操作方法

- **新規ページ作成**: 左サイドバーの「新規ページ」ボタン
- **ブロック追加**: Enterキーまたは「ブロックを追加」ボタン
- **ブロックタイプ変更**: 空のブロックで"/"を入力
- **ブロック削除**: 空のブロックでBackspaceキー
- **ブロック並び替え**: ドラッグ&ドロップ
- **ダークモード**: 右上の月/太陽アイコン

## 技術スタック

### バックエンド
- Node.js
- Express.js
- SQLite3
- UUID
- CORS

### フロントエンド
- HTML5
- CSS3 (Bootstrap使用)
- Vanilla JavaScript
- Font Awesome

## 今後の拡張予定

- [ ] ユーザー認証システム
- [ ] リアルタイム共同編集
- [ ] ファイルアップロード機能
- [ ] 検索機能
- [ ] エクスポート機能
- [ ] テーマカスタマイズ

## ライセンス

ISC