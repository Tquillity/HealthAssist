import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
  { ignores: ['**/dist/', '**/build/', '**/.turbo/', '**/node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['client/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    languageOptions: {
      globals: {
        browser: true,
        es2020: true,
        console: true,
        fetch: true,
        URL: true,
        Response: true,
        caches: true,
        self: true,
        clients: true,
      },
    },
  },
  {
    files: ['client/public/**/*.js'],
    languageOptions: {
      globals: {
        browser: true,
        es2020: true,
        console: true,
        fetch: true,
        URL: true,
        Response: true,
        caches: true,
        self: true,
        clients: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: ['client/tailwind.config.js'],
    languageOptions: {
      globals: {
        module: true,
        require: true,
        process: true,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: ['server/**/*.{ts,js}'],
    languageOptions: {
      globals: { node: true, es2020: true },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  prettierConfig, // Must be last to override other configs
];
