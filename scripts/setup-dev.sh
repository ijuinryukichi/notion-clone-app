#!/bin/bash
# setup-dev.sh - Android開発者向けNotionクローン開発環境セットアップ

echo "🚀 Notion Clone Development Setup"
echo "================================="
echo "Android開発者向けWeb開発環境をセットアップします"
echo ""

# Node.js バージョン確認
echo "📋 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js が見つかりません。Node.js をインストールしてください。"
    echo "   https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION が見つかりました"

# npm dependencies インストール
echo ""
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Dependencies installation failed"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# データベース初期化確認
echo ""
echo "🗄️ Database setup..."
if [ -f "notion.db" ]; then
    echo "✅ Database file exists: notion.db"
else
    echo "⚠️  Database file not found. It will be created when you start the server."
fi

# 設定ファイル確認
echo ""
echo "⚙️ Configuration check..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
    exit 1
fi

# テスト実行
echo ""
echo "🧪 Running initial tests..."
echo "This ensures your environment is properly set up (like Android SDK check)"

# ESLint check
echo "📝 ESLint check..."
npm run lint:check
if [ $? -ne 0 ]; then
    echo "⚠️  ESLint issues found. Run 'npm run lint' to fix them."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📚 Next steps for Android developers:"
echo "1. Start development server: npm run dev"
echo "2. Open browser: http://localhost:3001"
echo "3. Read development guide: docs/DEVELOPMENT_GUIDE.md"
echo "4. Check project context: CLAUDE.md"
echo ""
echo "🛠️ Common commands (Android equivalent):"
echo "npm run dev          # 開発サーバー起動 (like gradle assembleDebug)"
echo "npm run test:unit    # 単体テスト (like ./gradlew test)"
echo "npm run test:e2e     # E2Eテスト (like ./gradlew connectedAndroidTest)"
echo "npm run lint         # コード品質チェック (like Android Lint)"
echo "npm run quality      # 全品質チェック (like CI pipeline)"
echo ""
echo "🚀 Happy coding! AndroidスキルをWebに活かしましょう!"