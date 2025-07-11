const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['client/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        jest: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'warn',
      'no-case-declarations': 'off',
      'no-self-assign': 'warn',
      'no-redeclare': 'off', // API変数の再定義を許可
    }
  }
];
