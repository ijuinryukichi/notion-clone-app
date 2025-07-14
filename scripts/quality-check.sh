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