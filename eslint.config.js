import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    ...eslintPluginImport.flatConfigs.recommended,
    rules: {
      ...(eslintPluginImport.flatConfigs.recommended.rules ?? {}),
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['sibling', 'parent'],
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'off',
    },
  },
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  eslintConfigPrettier,
]);
