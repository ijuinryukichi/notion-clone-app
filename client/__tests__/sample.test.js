/**
 * サンプル単体テスト
 * Android JUnitテストと同様の構造
 */

describe('Sample Tests', () => {
  test('基本的なテストが動作する', () => {
    expect(1 + 1).toBe(2);
  });

  test('DOM操作のテスト例', () => {
    // DOM要素を作成（Android Viewの作成と同様）
    document.body.innerHTML = '<div id="test">Hello World</div>';
    
    // 要素を取得（Android findViewByIdと同様）
    const element = document.getElementById('test');
    
    // アサーション（Android assertThatと同様）
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('Hello World');
  });
});
