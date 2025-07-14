---
name: 機能実装 (Feature Implementation)
about: 新機能の実装を依頼する (Request a new feature implementation)
title: '[FEATURE] '
labels: ['type/feature', 'priority/medium']
assignees: ''
---

## 機能概要
- [ ] 何を実装するか（Android開発での類似機能があれば記載）

## 実装詳細
- [ ] 具体的な実装内容
- [ ] Android開発との類推（Activity/Fragment/ViewModel等）
- [ ] 技術的考慮事項

## 完了条件 (Definition of Done)
- [ ] 単体テスト作成・ローカル実行 (Jest Unit Tests)
- [ ] E2Eテスト作成・ローカル実行 (Playwright E2E Tests)
- [ ] 手動テスト実行・動作確認 (Manual Testing)
- [ ] Claude Codeでの実装品質確認 (Code Quality Check)
- [ ] ESLint・Prettier チェック通過

## テストケース（Android JUnit/Espressoと同様）
### 正常系 (Happy Path)
- [ ] [具体的なケース]

### 異常系 (Error Cases)
- [ ] [具体的なケース]

### 境界値 (Edge Cases)
- [ ] [具体的なケース]

## Android → Web 対応表
| Android概念 | Web実装 |
|-------------|---------|
| Activity/Fragment | HTML + JavaScript Class |
| ViewModel | JavaScript State Management |
| findViewById | querySelector/data-testid |
| OnClickListener | addEventListener |

## 追加情報
- [ ] デザインモックアップがある場合は添付
- [ ] 参考になるNotionの実際の機能があれば記載
- [ ] 既存コードとの連携が必要な部分があれば記載