# 🚀 開発ワークフロー (Development Workflow)

Android開発者のためのNotionクローン開発ワークフローガイド

## 📋 はじめに

このドキュメントは、Android開発経験者がWeb開発（特にNotionクローン）を効率的に行うためのワークフローを定義しています。AndroidのCI/CDパイプラインやテスト戦略を参考に、Web開発でも同様の品質管理を実現します。

## 🛠️ 環境セットアップ

### 初回セットアップ
```bash
# リポジトリクローン
git clone [repository-url]
cd notion-clone

# 開発環境セットアップ（Android SDK setupと同様）
./scripts/setup-dev.sh

# 開発サーバー起動
npm run dev
```

### 日次開発開始時
```bash
# 最新コードの取得
git pull origin main

# 依存関係の更新確認
npm install

# 開発サーバー起動
npm run dev
```

## 🔄 Claude Code Driven Development

### 基本フロー
```
Issue作成 → Claude Code実装 → ローカルテスト → 動作確認 → 技術リーダーレビュー
```

### 1. Issue作成
```bash
# GitHub Issues または Claude Code で Issue を作成
# テンプレートを使用して以下を明記：
# - Android開発での類似機能
# - 実装詳細・技術的考慮事項
# - 完了条件（DoD）
# - テストケース
```

### 2. Claude Code実装
```bash
# Claude Codeに以下を指示：
# 1. Issue内容の分析
# 2. Android → Web対応表の確認
# 3. TDD実装（Red-Green-Refactor）
# 4. E2Eテスト作成
# 5. 品質チェック
```

### 3. ローカルテスト（Android CI/CDと同様）
```bash
# 品質チェック実行（Android Lintと同様）
./scripts/quality-check.sh

# または個別実行
npm run lint              # ESLint (Android Lintと同様)
npm run test:unit         # Jest (JUnitと同様)
npm run test:e2e          # Playwright (Espressoと同様)
```

## 🧪 テスト戦略

### Android → Web テスト対応表
| Android | Web | 用途 |
|---------|-----|------|
| JUnit | Jest | 単体テスト・ビジネスロジック |
| Espresso | Playwright | UI・E2Eテスト |
| Android Lint | ESLint | 静的解析・コード品質 |
| Robolectric | JSDOM | DOM操作テスト |

### TDD サイクル
```bash
# Red: 失敗するテストを書く
npm run test:unit:watch

# Green: 最小実装で通す
# [実装作業]

# Refactor: コード改善
npm run lint --fix

# 最終確認
npm run quality
```

### E2Eテスト実行
```bash
# UI付きで実行（Espresso対話実行と同様）
npm run test:e2e

# ヘッドレス実行（CI環境と同様）
npm run test:e2e:headless
```

## 📊 品質管理

### 定義された完了条件 (Definition of Done)
- [ ] ✅ 単体テストがローカルでオールグリーン
- [ ] ✅ E2Eテスト（Playwright）がローカルで成功
- [ ] ✅ 手動での動作確認完了
- [ ] ✅ ESLint・Prettierチェック通過
- [ ] ✅ 技術リーダーによるコードレビュー完了

### 品質チェックコマンド
```bash
# 全品質チェック（Android CI pipelineと同様）
npm run quality

# または詳細チェック
./scripts/quality-check.sh
```

### カバレッジ管理
```bash
# カバレッジレポート生成
npm run test:unit:coverage

# カバレッジ目標（Androidプロジェクトと同様）
# - Unit Test: 80%以上
# - Integration Test: 主要フロー100%
```

## 🔀 Git ワークフロー

### ブランチ戦略（Git Flow簡易版）
```bash
# 機能開発
git checkout -b feature/issue-123-block-type-conversion
# [開発作業]
git add .
git commit -m "feat: add block type conversion feature"

# プルリクエスト作成
gh pr create --title "feat: add block type conversion" --body-file .github/pull_request_template.md
```

### コミットメッセージ規約
```bash
# Android開発でよく使うプレフィックス準拠
feat: 新機能追加
fix: バグ修正
refactor: リファクタリング
test: テスト追加・修正
docs: ドキュメント更新
style: コードスタイル修正
```

## 🎯 日次・週次チェック

### 日次チェックリスト
```bash
# 開発開始時
- [ ] git pull & npm install
- [ ] npm run dev でサーバー起動確認
- [ ] 前日の作業内容確認

# 開発終了時
- [ ] npm run quality で品質確認
- [ ] 作業内容のコミット
- [ ] 明日のタスク整理
```

### 週次振り返り
```bash
# 実装完了したIssue数
- [ ] 今週完了: X件
- [ ] テストカバレッジ: X%
- [ ] Android知見の活用度: [振り返り記述]
- [ ] 困った点と解決方法: [記述]
- [ ] 次週の改善点: [記述]
```

## 🔧 トラブルシューティング

### よくある問題と解決法

#### サーバー起動失敗
```bash
# ポート3001が使用中の場合
lsof -ti:3001 | xargs kill -9
npm run dev
```

#### テスト失敗時
```bash
# キャッシュクリア
npm run test:unit -- --clearCache
npm run test:e2e -- --update-snapshots
```

#### ESLint エラー
```bash
# 自動修正
npm run lint --fix

# 手動確認が必要な場合
npm run lint:check
```

## 📚 参考リソース

### 必読ドキュメント
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Android → Web 学習ガイド
- [CLAUDE.md](../CLAUDE.md) - プロジェクトコンテキスト
- [GitHub Issue Templates](../.github/ISSUE_TEMPLATE/) - Issue作成テンプレート

### 開発ツール
- **Claude Code**: AI駆動開発パートナー
- **Jest**: 単体テストフレームワーク（JUnit相当）
- **Playwright**: E2Eテストフレームワーク（Espresso相当）
- **ESLint**: 静的解析ツール（Android Lint相当）

## 🎉 成功指標

### 短期目標（2週間）
- [ ] Claude Code Driven Developmentの習得
- [ ] TDD + E2Eテストの定着
- [ ] Android → Web開発パターンの理解
- [ ] 品質チェック自動化の活用

### 長期目標（1ヶ月）
- [ ] 独立したWeb開発スキルの獲得
- [ ] 高品質なNotionクローン機能の完成
- [ ] AI活用開発手法の体得
- [ ] チーム開発でのベストプラクティス確立

---

**💡 成功のコツ**: Android開発の良い習慣（テストファースト、コードレビュー、CI/CD）をWeb開発にも適用し、Claude Codeを効果的なペアプログラミングパートナーとして活用する。