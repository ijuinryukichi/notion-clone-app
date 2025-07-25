# Pull Request

## 📋 概要 (Summary)
このPRで何を実装・修正・改善したかを簡潔に説明してください。

## 🎯 関連Issue
Closes #[issue number]

## 🔄 変更内容 (Changes Made)
### 追加機能 (New Features)
- [ ] [新機能の説明]

### バグ修正 (Bug Fixes)
- [ ] [修正したバグの説明]

### リファクタリング (Refactoring)
- [ ] [改善したコードの説明]

### その他 (Others)
- [ ] [その他の変更]

## 🎨 Android → Web 対応パターン
**このPRで実装した Android → Web の対応関係**:
| Android概念 | Web実装 | 実装箇所 |
|-------------|---------|-----------|
| [例: ViewModel] | [例: JavaScript Class] | [例: script.js:100-150] |

## 🧪 テスト (Testing)
### 単体テスト (Unit Tests)
- [ ] 新規テストを追加した
- [ ] 既存テストがすべて通る
- [ ] カバレッジが適切に保たれている

### E2Eテスト (End-to-End Tests)  
- [ ] 新規E2Eテストを追加した
- [ ] 既存E2Eテストがすべて通る
- [ ] 主要なユーザーシナリオをテストした

### 手動テスト (Manual Testing)
- [ ] ローカル環境で動作確認した
- [ ] 異なるブラウザで動作確認した
- [ ] レスポンシブデザインを確認した
- [ ] ダークモードで動作確認した

## 📸 スクリーンショット (Screenshots)
**変更前 (Before)**:
[変更前のスクリーンショット]

**変更後 (After)**:
[変更後のスクリーンショット]

## 🔍 コードレビューのポイント
**特に注目してほしい箇所**:
- [ ] [ファイル名: 行数] - [理由]
- [ ] [ファイル名: 行数] - [理由]

## ✅ チェックリスト (Pre-merge Checklist)
### コード品質
- [ ] ESLint チェックに通る (`npm run lint`)
- [ ] Prettier フォーマットが適用されている
- [ ] TypeScript エラーがない（該当する場合）
- [ ] コンソールエラーがない

### テスト
- [ ] `npm run test:unit` がすべて通る
- [ ] `npm run test:e2e:headless` がすべて通る
- [ ] `npm run quality` が成功する

### 機能
- [ ] 既存機能を壊していない
- [ ] 新機能が仕様通りに動作する
- [ ] パフォーマンスに悪影響がない
- [ ] アクセシビリティを考慮している

### ドキュメント
- [ ] CLAUDE.md を更新した（必要に応じて）
- [ ] README.md を更新した（必要に応じて）
- [ ] APIドキュメントを更新した（該当する場合）

## 📝 補足事項 (Additional Notes)
**reviewerに伝えたいこと**:
- Android開発からの学びや気づき
- 技術的な判断の理由
- 今後の改善予定
- 既知の制限事項

## 🚀 デプロイ後の確認事項
- [ ] サーバー再起動が必要
- [ ] データベースマイグレーションが必要
- [ ] 設定ファイルの更新が必要
- [ ] 特別な確認手順がある

---
**🤖 Claude Code Generated**: このPRはClaude Codeによって生成されました。