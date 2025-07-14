# 個人開発フロー・品質管理ガイド

## 🎯 開発フロー設計

### 基本原則：Claude Code Driven Development
```
Issue作成 → Claude Code実装 → ローカルテスト → 動作確認 → 技術リーダーレビュー
```

### 完了条件（Definition of Done）
- ✅ 単体テストがローカルでオールグリーン
- ✅ E2Eテスト（Playwright）がローカルで成功
- ✅ 手動での動作確認完了
- ✅ 技術リーダーによるコードレビュー完了

## 📋 Issue管理戦略（個人リポジトリ用）

### Issue分類とラベル（各自のリポジトリで設定）
```yaml
ラベル体系:
  - type/feature: 新機能
  - type/bug: バグ修正
  - type/refactor: リファクタリング
  - priority/high: 高優先度
  - priority/medium: 中優先度
  - priority/low: 低優先度
  - size/small: 1-2時間
  - size/medium: 半日
  - size/large: 1日以上
```

### Issue テンプレート（個人用）
```markdown
## 機能概要
- [ ] 何を実装するか（Android開発での類似機能があれば記載）

## 実装詳細
- [ ] 具体的な実装内容
- [ ] Android開発との類推（Activity/Fragment/ViewModel等）
- [ ] 技術的考慮事項

## 完了条件
- [ ] 単体テスト作成・ローカル実行
- [ ] E2Eテスト作成・ローカル実行
- [ ] 手動テスト実行・動作確認
- [ ] Claude Codeでの実装品質確認

## テストケース（Android JUnit/Espressoと同様）
- [ ] 正常系: [具体的なケース]
- [ ] 異常系: [具体的なケース]
- [ ] 境界値: [具体的なケース]
```

## 🧪 ローカル中心のテスト戦略

### package.json スクリプト
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "npm run test:unit",
    "test:unit": "jest",
    "test:unit:watch": "jest --watch",
    "test:unit:coverage": "jest --coverage",
    "test:e2e": "playwright test --ui",
    "test:e2e:headless": "playwright test",
    "lint": "eslint client/ --fix",
    "check": "npm run lint && npm run test:unit",
    "quality": "npm run check && echo '✅ Ready for review!'",
    "android-style-test": "npm run test:unit && npm run test:e2e:headless"
  }
}
```

### 品質チェックスクリプト
```bash
#!/bin/bash
# quality-check.sh - Android開発者向け品質チェック

echo "🔍 Quality Check (Android style)"
echo "================================"

echo "📝 Linting (like Android Lint)..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint failed"
    exit 1
fi

echo "🧪 Unit Tests (like JUnit)..."
npm run test:unit
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed"
    exit 1
fi

echo "📱 E2E Tests (like Espresso)..."
npm run test:e2e:headless
if [ $? -ne 0 ]; then
    echo "❌ E2E tests failed"
    exit 1
fi

echo "✅ All quality checks passed!"
echo "👍 Ready for technical leader review!"
echo ""
echo "📊 Coverage Report:"
npm run test:unit:coverage
```

## 📊 個人開発向け品質指標

### 自己チェック指標
```markdown
## 日次チェックリスト
- [ ] 今日実装した機能のテストが通る
- [ ] E2Eテストで画面操作確認済み
- [ ] Android開発との類推ができている
- [ ] data-testid属性が適切に設定されている
- [ ] 既存機能を破壊していない

## 週次振り返り
- [ ] 実装したIssue数
- [ ] テストカバレッジ
- [ ] Android知見の活用度
- [ ] 困った点と解決方法
- [ ] 次週の改善点
```

## 🚀 導入手順（個人開発版）

### Phase 1: 個人環境整備（Day 1）
1. ✅ 既存Notionクローンプロジェクトのfork
2. ✅ ローカルテスト環境セットアップ
3. ✅ Claude Codeカスタムコマンド設定
4. ✅ 品質チェックスクリプト配置

### Phase 2: 開発プロセス習得（Day 2-3）
1. ✅ サンプルIssueでClaude Code実行練習
2. ✅ Jest/Playwrightテスト実行確認
3. ✅ Android → Web対応パターン習得
4. ✅ 技術リーダーとの連携確認

### Phase 3: 実装期間（Day 4-14）
1. ✅ Issue駆動開発の実践
2. ✅ 継続的品質チェック
3. ✅ 定期的な技術リーダーレビュー
4. ✅ Android知見の活用拡大

## 🛠️ Claude Code自動実装システム

### Android経験者向けカスタムコマンド

#### カスタムコマンド設定
```markdown
コマンド名: implement-web-feature
引数: GitHubのIssue番号

プロンプト:
Android開発経験者向けのNotionクローン機能実装

Issue #$ARGUMENTSを以下のAndroid開発パターンで実装してください：

## Android → Web 対応表
- Component ≈ Activity/Fragment
- Props ≈ Intent Extras/Bundle
- State ≈ ViewModel LiveData
- Event Handler ≈ OnClickListener
- Jest ≈ JUnit
- Playwright ≈ Espresso

## 実装手順
1. Issue内容分析（要件定義）
2. コンポーネント設計（Activity/Fragment設計と同様）
3. TDD実装：
   - Red: 失敗するテスト作成（JUnitパターン）
   - Green: 最小実装（ロジック実装）
   - Refactor: コード改善（リファクタリング）
4. E2Eテスト作成（Espressoパターン）
5. data-testid属性適切設定（Android findById equivalent）

## 技術制約
- 既存のVanilla JS構造を維持
- /Users/m.ishihara/WS/notion-clone のファイル構造に従う
- 後方互換性を保つ

## 出力形式
1. 実装計画の説明
2. テストコード（Jest）
3. 実装コード
4. E2Eテストコード（Playwright）
5. 動作確認手順

Android開発の知見を活かしたクリーンな実装をお願いします。
```

## 🎯 期待される効果

### 短期効果（ハッカソン期間中）
- **Android知見活用**: 既存スキルでWeb開発加速
- **品質向上**: 自動テストによる安心感
- **学習効果**: TDD + E2Eテストの体験
- **開発効率**: Claude Code自動実装

### 長期効果（ハッカソン後）
- **技術スキル**: Web開発 + テスト自動化スキル
- **開発思考**: TDD思考の定着
- **品質意識**: テストファーストの習慣化
- **生産性**: AI活用開発の体得

---

**💡 成功のポイント**: AndroidのActivity/Fragment開発の経験を活かし、Component設計とテスト駆動開発で高品質なWeb開発を実現する。Claude Codeを開発パートナーとして活用し、実装からテストまでを効率化する。